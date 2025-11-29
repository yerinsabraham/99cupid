import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * BlockService - Handles blocking users
 */
export const BlockService = {
  /**
   * Block a user
   */
  async blockUser(currentUserId, userToBlockId) {
    try {
      const userRef = doc(db, 'users', currentUserId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' };
      }

      const blockedUsers = userDoc.data().blockedUsers || [];

      if (blockedUsers.includes(userToBlockId)) {
        return { success: false, error: 'User already blocked' };
      }

      await updateDoc(userRef, {
        blockedUsers: [...blockedUsers, userToBlockId],
        updatedAt: serverTimestamp(),
      });

      // Also update the blocked user's blockedByUsers
      const blockedUserRef = doc(db, 'users', userToBlockId);
      const blockedUserDoc = await getDoc(blockedUserRef);

      if (blockedUserDoc.exists()) {
        const blockedByUsers = blockedUserDoc.data().blockedByUsers || [];
        await updateDoc(blockedUserRef, {
          blockedByUsers: [...blockedByUsers, currentUserId],
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error blocking user:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Unblock a user
   */
  async unblockUser(currentUserId, userToUnblockId) {
    try {
      const userRef = doc(db, 'users', currentUserId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' };
      }

      const blockedUsers = userDoc.data().blockedUsers || [];
      const updatedBlockedUsers = blockedUsers.filter((id) => id !== userToUnblockId);

      await updateDoc(userRef, {
        blockedUsers: updatedBlockedUsers,
        updatedAt: serverTimestamp(),
      });

      // Also update the unblocked user's blockedByUsers
      const unblockedUserRef = doc(db, 'users', userToUnblockId);
      const unblockedUserDoc = await getDoc(unblockedUserRef);

      if (unblockedUserDoc.exists()) {
        const blockedByUsers = unblockedUserDoc.data().blockedByUsers || [];
        const updatedBlockedByUsers = blockedByUsers.filter((id) => id !== currentUserId);
        await updateDoc(unblockedUserRef, {
          blockedByUsers: updatedBlockedByUsers,
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error unblocking user:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if user is blocked by another user
   */
  async isBlockedBy(currentUserId, otherUserId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', otherUserId));
      if (!userDoc.exists()) return false;

      const blockedUsers = userDoc.data().blockedUsers || [];
      return blockedUsers.includes(currentUserId);
    } catch (error) {
      console.error('Error checking if blocked:', error);
      return false;
    }
  },

  /**
   * Check if user has blocked another user
   */
  async hasBlocked(currentUserId, otherUserId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUserId));
      if (!userDoc.exists()) return false;

      const blockedUsers = userDoc.data().blockedUsers || [];
      return blockedUsers.includes(otherUserId);
    } catch (error) {
      console.error('Error checking if blocked:', error);
      return false;
    }
  },

  /**
   * Get list of blocked users
   */
  async getBlockedUsers(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return [];

      const blockedIds = userDoc.data().blockedUsers || [];

      // Fetch blocked users' data
      const blockedUsers = await Promise.all(
        blockedIds.map(async (id) => {
          const userDoc = await getDoc(doc(db, 'users', id));
          return userDoc.exists() ? { id, ...userDoc.data() } : null;
        })
      );

      return blockedUsers.filter((user) => user !== null);
    } catch (error) {
      console.error('Error getting blocked users:', error);
      return [];
    }
  },
};

/**
 * ReportService - Handles reporting users
 */
export const ReportService = {
  /**
   * Report a user
   */
  async reportUser(reportedUserId, reportingUserId, reason, description) {
    try {
      const reportsRef = collection(db, 'reports');
      const report = {
        reportedUserId,
        reportingUserId,
        reason, // 'inappropriate', 'fake_profile', 'harassment', 'other'
        description,
        status: 'pending', // 'pending', 'under_review', 'resolved', 'dismissed'
        createdAt: serverTimestamp(),
        resolvedAt: null,
        adminNotes: '',
      };

      const docRef = await addDoc(reportsRef, report);

      // Add to user's reportedBy list
      const userRef = doc(db, 'users', reportedUserId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const reportedBy = userDoc.data().reportedBy || [];
        await updateDoc(userRef, {
          reportedBy: [...reportedBy, reportingUserId],
        });
      }

      return { success: true, reportId: docRef.id };
    } catch (error) {
      console.error('Error reporting user:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all reports (admin only)
   */
  async getAllReports() {
    try {
      const reportsRef = collection(db, 'reports');
      const snapshot = await getDocs(reportsRef);

      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by creation date (newest first)
      reports.sort((a, b) => {
        const timeA = a.createdAt?.toDate?.().getTime() || new Date(a.createdAt).getTime();
        const timeB = b.createdAt?.toDate?.().getTime() || new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

      return { success: true, reports };
    } catch (error) {
      console.error('Error getting reports:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get reports for a specific user (admin)
   */
  async getUserReports(userId) {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(reportsRef, where('reportedUserId', '==', userId));
      const snapshot = await getDocs(q);

      const reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return { success: true, reports };
    } catch (error) {
      console.error('Error getting user reports:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update report status (admin only)
   */
  async updateReportStatus(reportId, status, adminNotes = '') {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, {
        status,
        adminNotes,
        resolvedAt: status !== 'pending' ? serverTimestamp() : null,
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating report:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if user has reported another user
   */
  async hasReported(reportingUserId, reportedUserId) {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(
        reportsRef,
        where('reportingUserId', '==', reportingUserId),
        where('reportedUserId', '==', reportedUserId)
      );
      const snapshot = await getDocs(q);

      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking if reported:', error);
      return false;
    }
  },
};

export default { BlockService, ReportService };
