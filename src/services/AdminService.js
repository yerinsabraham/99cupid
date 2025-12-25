import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * AdminService - Handles admin panel operations
 */
export const AdminService = {
  /**
   * Check if current user is admin
   */
  async isAdmin(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return false;
      return userDoc.data().isAdmin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  /**
   * Get all users
   */
  async getAllUsers() {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter out any deleted users from the view (optional, comment this out if you want to see deleted users)
      // const activeUsers = users.filter(u => u.accountStatus !== 'deleted');

      // Sort by creation date (newest first) with fallback for missing dates
      users.sort((a, b) => {
        const timeA = a.createdAt ? (a.createdAt.toDate?.() || new Date(a.createdAt)).getTime() : 0;
        const timeB = b.createdAt ? (b.createdAt.toDate?.() || new Date(b.createdAt)).getTime() : 0;
        return timeB - timeA;
      });

      console.log(`Admin: Fetched ${users.length} users from Firestore`);
      return { success: true, users };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all reports
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
   * Get all verification requests (pending only by default)
   */
  async getVerificationRequests(includeAll = false) {
    try {
      const verificationsRef = collection(db, 'verifications');
      let q;
      
      if (includeAll) {
        q = query(verificationsRef);
      } else {
        q = query(verificationsRef, where('status', '==', 'pending'));
      }
      
      const snapshot = await getDocs(q);

      const verifications = [];
      
      for (const verDoc of snapshot.docs) {
        const verData = verDoc.data();
        
        // Get user details
        const userDoc = await getDoc(doc(db, 'users', verData.userId));
        const userData = userDoc.exists() ? userDoc.data() : null;
        
        verifications.push({
          id: verDoc.id,
          ...verData,
          userName: userData?.name || 'Unknown',
          userEmail: userData?.email || '',
          userPhotos: userData?.photos || []
        });
      }

      // Sort by creation date (oldest pending first)
      verifications.sort((a, b) => {
        const timeA = a.submittedAt?.toDate?.().getTime() || new Date(a.submittedAt).getTime();
        const timeB = b.submittedAt?.toDate?.().getTime() || new Date(b.submittedAt).getTime();
        return timeA - timeB;
      });

      return { success: true, verifications };
    } catch (error) {
      console.error('Error getting verification requests:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Approve user verification (enhanced to work with VerificationService)
   */
  async approveVerification(verificationId, adminId) {
    try {
      const verificationRef = doc(db, 'verifications', verificationId);
      const verificationDoc = await getDoc(verificationRef);
      
      if (!verificationDoc.exists()) {
        return { success: false, error: 'Verification not found' };
      }

      const verData = verificationDoc.data();

      // Update verification status
      await updateDoc(verificationRef, {
        status: 'approved',
        reviewedAt: serverTimestamp(),
        reviewedBy: adminId,
        rejectionReason: null
      });

      // Update user profile based on verification type
      const userRef = doc(db, 'users', verData.userId);
      const updateData = {
        [`verification.${verData.verificationType}`]: 'approved',
        [`verification.${verData.verificationType}VerifiedAt`]: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Set the specific verified flag
      if (verData.verificationType === 'phone') {
        updateData.isPhoneVerified = true;
      } else if (verData.verificationType === 'photo') {
        updateData.isPhotoVerified = true;
      } else if (verData.verificationType === 'id') {
        updateData.isIDVerified = true;
      }

      await updateDoc(userRef, updateData);

      return { success: true };
    } catch (error) {
      console.error('Error approving verification:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Reject user verification (enhanced)
   */
  async rejectVerification(verificationId, adminId, reason = 'Does not meet verification requirements') {
    try {
      const verificationRef = doc(db, 'verifications', verificationId);
      const verificationDoc = await getDoc(verificationRef);
      
      if (!verificationDoc.exists()) {
        return { success: false, error: 'Verification not found' };
      }

      const verData = verificationDoc.data();

      // Update verification status
      await updateDoc(verificationRef, {
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: serverTimestamp(),
        reviewedBy: adminId
      });

      // Update user profile
      const userRef = doc(db, 'users', verData.userId);
      await updateDoc(userRef, {
        [`verification.${verData.verificationType}`]: 'rejected',
        [`verification.${verData.verificationType}RejectionReason`]: reason,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error rejecting verification:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Suspend user account
   */
  async suspendUser(userId, reason = '') {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountStatus: 'suspended',
        suspensionReason: reason,
        suspendedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error suspending user:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Unsuspend user account
   */
  async unsuspendUser(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountStatus: 'active',
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error unsuspending user:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Manually verify a user (admin action)
   */
  async verifyUser(userId) {
    try {
      console.log('=== VERIFY USER START ===');
      console.log('Verifying user:', userId);
      
      // Get user data first
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        console.error('User not found:', userId);
        return { success: false, error: 'User not found' };
      }
      
      const userData = userDoc.data();
      console.log('User data loaded:', userData);
      
      // Update user profile
      console.log('Updating user profile...');
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isVerified: true,
        'verification.isVerified': true,
        'verification.verifiedAt': serverTimestamp(),
        'verification.verifiedBy': 'admin',
        verificationLevel: 'verified',
        updatedAt: serverTimestamp(),
      });
      console.log('User profile updated successfully');

      // Create a verification record for admin's action
      console.log('Creating verification record...');
      const verificationsRef = collection(db, 'verifications');
      const verificationDoc = await addDoc(verificationsRef, {
        userId: userId,
        verificationType: 'admin_manual',
        status: 'approved',
        submittedAt: serverTimestamp(),
        reviewedAt: serverTimestamp(),
        reviewedBy: 'admin',
        userName: userData.displayName || userData.name || userData.email || 'User',
        userEmail: userData.email || '',
        notes: 'Manually verified by admin'
      });
      console.log('Verification record created with ID:', verificationDoc.id);
      console.log('=== VERIFY USER SUCCESS ===');

      return { success: true };
    } catch (error) {
      console.error('=== VERIFY USER ERROR ===');
      console.error('Error verifying user:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return { success: false, error: error.message };
    }
  },

  /**
   * Remove verification from a user (admin action)
   */
  async unverifyUser(userId) {
    try {
      // Update user profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isVerified: false,
        'verification.isVerified': false,
        verificationLevel: null,
        updatedAt: serverTimestamp(),
      });

      // Optionally, update the verification record to show it was revoked
      const verificationsRef = collection(db, 'verifications');
      const q = query(verificationsRef, where('userId', '==', userId), where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      
      // Update all approved verifications for this user to 'revoked'
      const updatePromises = snapshot.docs.map(verDoc => 
        updateDoc(doc(db, 'verifications', verDoc.id), {
          status: 'revoked',
          revokedAt: serverTimestamp(),
          revokedBy: 'admin'
        })
      );
      await Promise.all(updatePromises);

      return { success: true };
    } catch (error) {
      console.error('Error removing verification:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete user account (hard delete)
   */
  async deleteUser(userId) {
    try {
      // Mark as deleted instead of hard delete to maintain data integrity
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        accountStatus: 'deleted',
        deletedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update report status
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
   * Get user statistics
   */
  async getUserStats() {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      let totalUsers = 0;
      let activeUsers = 0;
      let suspendedUsers = 0;
      let deletedUsers = 0;
      let verifiedUsers = 0;
      let subscribedUsers = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        totalUsers++;
        if (data.accountStatus === 'active') activeUsers++;
        if (data.accountStatus === 'suspended') suspendedUsers++;
        if (data.accountStatus === 'deleted') deletedUsers++;
        if (data.isVerified) verifiedUsers++;
        if (data.hasActiveSubscription) subscribedUsers++;
      });

      return {
        success: true,
        stats: {
          totalUsers,
          activeUsers,
          suspendedUsers,
          deletedUsers,
          verifiedUsers,
          subscribedUsers,
        },
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return { success: false, error: error.message };
    }
  },
};

export default AdminService;
