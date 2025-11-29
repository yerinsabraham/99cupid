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

      // Sort by creation date (newest first)
      users.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });

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
   * Get all verification requests
   */
  async getVerificationRequests() {
    try {
      const verificationsRef = collection(db, 'verifications');
      const q = query(verificationsRef, where('status', '==', 'pending'));
      const snapshot = await getDocs(q);

      const verifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by creation date (oldest first - pending first)
      verifications.sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeA - timeB;
      });

      return { success: true, verifications };
    } catch (error) {
      console.error('Error getting verification requests:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Approve user verification
   */
  async approveVerification(verificationId, userId) {
    try {
      // Update verification status
      const verificationRef = doc(db, 'verifications', verificationId);
      await updateDoc(verificationRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
      });

      // Update user profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isVerified: true,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error approving verification:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Reject user verification
   */
  async rejectVerification(verificationId, userId, reason = '') {
    try {
      const verificationRef = doc(db, 'verifications', verificationId);
      await updateDoc(verificationRef, {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: serverTimestamp(),
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
