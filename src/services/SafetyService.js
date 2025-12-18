import { collection, addDoc, query, where, getDocs, doc, updateDoc, serverTimestamp, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * SafetyService - Comprehensive user safety and moderation system
 * Handles reporting, blocking, and safety features
 */
class SafetyService {
  // Report categories
  static REPORT_CATEGORIES = {
    INAPPROPRIATE_PHOTOS: {
      id: 'inappropriate_photos',
      label: 'Inappropriate Photos',
      description: 'Nudity, sexual content, or offensive images',
      severity: 'high'
    },
    HARASSMENT: {
      id: 'harassment',
      label: 'Harassment or Bullying',
      description: 'Threatening, intimidating, or abusive behavior',
      severity: 'high'
    },
    FAKE_PROFILE: {
      id: 'fake_profile',
      label: 'Fake Profile',
      description: 'Using someone else\'s photos or false information',
      severity: 'medium'
    },
    SPAM: {
      id: 'spam',
      label: 'Spam or Scam',
      description: 'Promoting products, services, or fraudulent activity',
      severity: 'medium'
    },
    HATE_SPEECH: {
      id: 'hate_speech',
      label: 'Hate Speech',
      description: 'Discriminatory or hateful content',
      severity: 'high'
    },
    UNDERAGE: {
      id: 'underage',
      label: 'Underage User',
      description: 'User appears to be under 18 years old',
      severity: 'critical'
    },
    INAPPROPRIATE_MESSAGES: {
      id: 'inappropriate_messages',
      label: 'Inappropriate Messages',
      description: 'Unwanted or offensive messages',
      severity: 'medium'
    },
    CATFISHING: {
      id: 'catfishing',
      label: 'Catfishing',
      description: 'Pretending to be someone else',
      severity: 'high'
    },
    PRIVACY_VIOLATION: {
      id: 'privacy_violation',
      label: 'Privacy Violation',
      description: 'Sharing private information without consent',
      severity: 'high'
    },
    OTHER: {
      id: 'other',
      label: 'Other',
      description: 'Other safety concerns',
      severity: 'low'
    }
  };

  // Report statuses
  static REPORT_STATUS = {
    PENDING: 'pending',
    UNDER_REVIEW: 'under_review',
    RESOLVED: 'resolved',
    DISMISSED: 'dismissed',
    ACTION_TAKEN: 'action_taken'
  };

  // Safety actions
  static SAFETY_ACTIONS = {
    WARNING: 'warning',
    SUSPEND_24H: 'suspend_24h',
    SUSPEND_7D: 'suspend_7d',
    SUSPEND_30D: 'suspend_30d',
    BAN_PERMANENT: 'ban_permanent',
    CONTENT_REMOVED: 'content_removed',
    PROFILE_HIDDEN: 'profile_hidden',
    NO_ACTION: 'no_action'
  };

  /**
   * Report a user
   */
  static async reportUser(reporterId, reportedUserId, category, description, evidence = {}) {
    try {
      const reportData = {
        reporterId,
        reportedUserId,
        category,
        description,
        evidence, // Can include screenshot URLs, message IDs, etc.
        status: this.REPORT_STATUS.PENDING,
        severity: this.REPORT_CATEGORIES[category]?.severity || 'low',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        reviewedBy: null,
        reviewedAt: null,
        action: null,
        actionReason: null
      };

      const reportRef = await addDoc(collection(db, 'reports'), reportData);

      // Track analytics
      if (typeof window !== 'undefined' && window.AnalyticsService) {
        window.AnalyticsService.trackEvent('safety_report_submitted', reporterId, {
          reportedUserId,
          category,
          severity: reportData.severity
        });
      }

      return {
        success: true,
        reportId: reportRef.id,
        message: 'Report submitted successfully. Our team will review it shortly.'
      };
    } catch (error) {
      console.error('Error reporting user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Block a user
   */
  static async blockUser(blockerId, blockedUserId) {
    try {
      // Create block record
      const blockId = `${blockerId}_${blockedUserId}`;
      await setDoc(doc(db, 'blocks', blockId), {
        blockerId,
        blockedUserId,
        createdAt: serverTimestamp()
      });

      // Remove any existing matches
      const matchesQuery1 = query(
        collection(db, 'matches'),
        where('user1Id', '==', blockerId),
        where('user2Id', '==', blockedUserId)
      );
      const matchesQuery2 = query(
        collection(db, 'matches'),
        where('user1Id', '==', blockedUserId),
        where('user2Id', '==', blockerId)
      );

      const [matches1, matches2] = await Promise.all([
        getDocs(matchesQuery1),
        getDocs(matchesQuery2)
      ]);

      const deletePromises = [];
      matches1.forEach(doc => deletePromises.push(deleteDoc(doc.ref)));
      matches2.forEach(doc => deletePromises.push(deleteDoc(doc.ref)));
      
      await Promise.all(deletePromises);

      // Track analytics
      if (typeof window !== 'undefined' && window.AnalyticsService) {
        window.AnalyticsService.trackEvent('user_blocked', blockerId, { blockedUserId });
      }

      return {
        success: true,
        message: 'User blocked successfully'
      };
    } catch (error) {
      console.error('Error blocking user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Unblock a user
   */
  static async unblockUser(blockerId, blockedUserId) {
    try {
      const blockId = `${blockerId}_${blockedUserId}`;
      await deleteDoc(doc(db, 'blocks', blockId));

      return {
        success: true,
        message: 'User unblocked successfully'
      };
    } catch (error) {
      console.error('Error unblocking user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get list of blocked users
   */
  static async getBlockedUsers(userId) {
    try {
      const blocksQuery = query(
        collection(db, 'blocks'),
        where('blockerId', '==', userId)
      );

      const snapshot = await getDocs(blocksQuery);
      const blockedUserIds = [];

      snapshot.forEach(doc => {
        blockedUserIds.push(doc.data().blockedUserId);
      });

      return blockedUserIds;
    } catch (error) {
      console.error('Error getting blocked users:', error);
      return [];
    }
  }

  /**
   * Check if user is blocked
   */
  static async isUserBlocked(userId, otherUserId) {
    try {
      const blockId1 = `${userId}_${otherUserId}`;
      const blockId2 = `${otherUserId}_${userId}`;

      const [block1, block2] = await Promise.all([
        getDoc(doc(db, 'blocks', blockId1)),
        getDoc(doc(db, 'blocks', blockId2))
      ]);

      return block1.exists() || block2.exists();
    } catch (error) {
      console.error('Error checking block status:', error);
      return false;
    }
  }

  /**
   * Get all reports (admin only)
   */
  static async getAllReports(status = null) {
    try {
      let reportsQuery;
      
      if (status) {
        reportsQuery = query(
          collection(db, 'reports'),
          where('status', '==', status)
        );
      } else {
        reportsQuery = collection(db, 'reports');
      }

      const snapshot = await getDocs(reportsQuery);
      const reports = [];

      snapshot.forEach(doc => {
        reports.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort by severity and date
      reports.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
          return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });

      return reports;
    } catch (error) {
      console.error('Error getting reports:', error);
      return [];
    }
  }

  /**
   * Update report status (admin only)
   */
  static async updateReport(reportId, adminId, updates) {
    try {
      const reportRef = doc(db, 'reports', reportId);
      
      await updateDoc(reportRef, {
        ...updates,
        reviewedBy: adminId,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // If action taken, update reported user's account
      if (updates.action && updates.action !== this.SAFETY_ACTIONS.NO_ACTION) {
        const report = await getDoc(reportRef);
        const reportedUserId = report.data().reportedUserId;
        
        await this.applySafetyAction(reportedUserId, updates.action, updates.actionReason);
      }

      return {
        success: true,
        message: 'Report updated successfully'
      };
    } catch (error) {
      console.error('Error updating report:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Apply safety action to user
   */
  static async applySafetyAction(userId, action, reason) {
    try {
      const userRef = doc(db, 'users', userId);
      const updates = {
        lastSafetyAction: action,
        lastSafetyActionReason: reason,
        lastSafetyActionAt: serverTimestamp()
      };

      switch (action) {
        case this.SAFETY_ACTIONS.WARNING:
          updates.warningCount = (await getDoc(userRef)).data()?.warningCount || 0 + 1;
          break;
        
        case this.SAFETY_ACTIONS.SUSPEND_24H:
          updates.accountStatus = 'suspended';
          updates.suspendedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
          break;
        
        case this.SAFETY_ACTIONS.SUSPEND_7D:
          updates.accountStatus = 'suspended';
          updates.suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          break;
        
        case this.SAFETY_ACTIONS.SUSPEND_30D:
          updates.accountStatus = 'suspended';
          updates.suspendedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          break;
        
        case this.SAFETY_ACTIONS.BAN_PERMANENT:
          updates.accountStatus = 'banned';
          updates.bannedAt = serverTimestamp();
          break;
        
        case this.SAFETY_ACTIONS.PROFILE_HIDDEN:
          updates.profileHidden = true;
          break;
      }

      await updateDoc(userRef, updates);

      // Send notification to user (could integrate email service here)
      await this.notifyUserOfAction(userId, action, reason);

      return { success: true };
    } catch (error) {
      console.error('Error applying safety action:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Notify user of safety action
   */
  static async notifyUserOfAction(userId, action, reason) {
    // This could send email, push notification, or in-app notification
    // For now, just log it
    console.log(`Safety action ${action} applied to user ${userId}: ${reason}`);
    
    // TODO: Implement email notification service
    // await EmailService.sendSafetyActionNotification(userId, action, reason);
  }

  /**
   * Get safety statistics
   */
  static async getSafetyStats() {
    try {
      const reportsSnapshot = await getDocs(collection(db, 'reports'));
      const blocksSnapshot = await getDocs(collection(db, 'blocks'));

      const stats = {
        totalReports: reportsSnapshot.size,
        pendingReports: 0,
        resolvedReports: 0,
        totalBlocks: blocksSnapshot.size,
        reportsByCategory: {},
        reportsBySeverity: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        }
      };

      reportsSnapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.status === this.REPORT_STATUS.PENDING) {
          stats.pendingReports++;
        } else if (data.status === this.REPORT_STATUS.RESOLVED || data.status === this.REPORT_STATUS.ACTION_TAKEN) {
          stats.resolvedReports++;
        }

        stats.reportsByCategory[data.category] = (stats.reportsByCategory[data.category] || 0) + 1;
        stats.reportsBySeverity[data.severity] = (stats.reportsBySeverity[data.severity] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting safety stats:', error);
      return null;
    }
  }

  /**
   * Get safety guidelines
   */
  static getSafetyGuidelines() {
    return {
      communityGuidelines: [
        {
          title: 'Be Respectful',
          description: 'Treat others with kindness and respect. No harassment, bullying, or hate speech.',
          icon: '🤝'
        },
        {
          title: 'Be Yourself',
          description: 'Use real photos and honest information. No fake profiles or catfishing.',
          icon: '✨'
        },
        {
          title: 'Stay Safe',
          description: 'Protect your personal information. Never share financial details or passwords.',
          icon: '🔒'
        },
        {
          title: 'Keep it Clean',
          description: 'No nudity, sexual content, or inappropriate messages.',
          icon: '🌟'
        },
        {
          title: 'Report Issues',
          description: 'If you see something concerning, report it to our team immediately.',
          icon: '🚨'
        },
        {
          title: 'Be Legal',
          description: 'You must be 18+ to use 99CUPID. No illegal activity.',
          icon: '⚖️'
        }
      ],
      safetyTips: [
        'Meet in public places for first dates',
        'Tell a friend or family member about your plans',
        'Trust your instincts - if something feels off, it probably is',
        'Don\'t share your home address, workplace, or financial information',
        'Video chat before meeting in person',
        'Stay on the platform until you\'re comfortable',
        'Watch out for red flags: asking for money, moving too fast, avoiding video calls',
        'Keep your account secure with a strong password'
      ],
      emergencyResources: [
        {
          name: 'National Emergency Hotline (Philippines)',
          number: '911',
          description: 'For immediate emergency assistance'
        },
        {
          name: 'PNP Women and Children Protection Center',
          number: '(02) 8723-0401',
          description: 'For cases of abuse or violence'
        },
        {
          name: 'DSWD Crisis Intervention Unit',
          number: '(02) 8931-8101 to 07',
          description: 'For social welfare concerns'
        },
        {
          name: 'National Mental Health Crisis Hotline',
          number: '0917-899-USAP (8727)',
          description: 'For mental health support'
        }
      ]
    };
  }
}

export default SafetyService;
