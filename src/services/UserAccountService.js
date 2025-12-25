import { 
  deleteUser as deleteAuthUser, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * UserAccountService - Handles user account management and deletion
 */
const UserAccountService = {
  /**
   * Delete user account permanently
   * This includes:
   * - Firebase Auth account
   * - User profile in Firestore
   * - All related data (matches, chats, likes, swipes, verifications)
   * 
   * @param {string} password - User's current password for re-authentication
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteAccount(password) {
    const user = auth.currentUser;
    
    if (!user) {
      return { success: false, error: 'No user is currently logged in' };
    }

    try {
      console.log('Starting account deletion for user:', user.uid);

      // Step 1: Re-authenticate user (Firebase requires this for sensitive operations)
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      console.log('User re-authenticated successfully');

      // Step 2: Mark user as deleted in Firestore first (soft delete)
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          accountStatus: 'deleted',
          deletedAt: serverTimestamp(),
          email: null, // Clear sensitive data
          photoURLs: [],
          bio: 'Account deleted',
          displayName: 'Deleted User',
        });
        console.log('User marked as deleted in Firestore');
      }

      // Step 3: Delete related data using batched writes
      await this.deleteUserRelatedData(user.uid);

      // Step 4: Delete Firebase Auth account (point of no return)
      await deleteAuthUser(user);
      console.log('Firebase Auth account deleted');

      return { success: true };
    } catch (error) {
      console.error('Error deleting account:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/wrong-password') {
        return { success: false, error: 'Incorrect password. Please try again.' };
      } else if (error.code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many attempts. Please try again later.' };
      } else if (error.code === 'auth/requires-recent-login') {
        return { success: false, error: 'Please log out and log in again before deleting your account.' };
      }
      
      return { success: false, error: error.message || 'Failed to delete account' };
    }
  },

  /**
   * Delete all user-related data from Firestore
   * Uses batched writes for efficiency
   */
  async deleteUserRelatedData(userId) {
    try {
      console.log('Deleting user-related data for:', userId);
      const batch = writeBatch(db);
      let totalDeleted = 0;

      // 1. Delete matches where user is participant
      const matchesQuery1 = query(collection(db, 'matches'), where('user1Id', '==', userId));
      const matchesQuery2 = query(collection(db, 'matches'), where('user2Id', '==', userId));
      
      const [matches1, matches2] = await Promise.all([
        getDocs(matchesQuery1),
        getDocs(matchesQuery2)
      ]);
      
      matches1.forEach(doc => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
      matches2.forEach(doc => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
      console.log(`Queued ${matches1.size + matches2.size} matches for deletion`);

      // 2. Delete chats where user is participant
      const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', userId));
      const chatsSnapshot = await getDocs(chatsQuery);
      
      for (const chatDoc of chatsSnapshot.docs) {
        // Delete chat messages subcollection
        const messagesQuery = collection(db, 'chats', chatDoc.id, 'messages');
        const messagesSnapshot = await getDocs(messagesQuery);
        messagesSnapshot.forEach(msgDoc => {
          batch.delete(msgDoc.ref);
          totalDeleted++;
        });
        
        // Delete chat document
        batch.delete(chatDoc.ref);
        totalDeleted++;
      }
      console.log(`Queued ${chatsSnapshot.size} chats for deletion`);

      // 3. Delete likes from this user
      const likesQuery = query(collection(db, 'likes'), where('fromUserId', '==', userId));
      const likesSnapshot = await getDocs(likesQuery);
      likesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
      console.log(`Queued ${likesSnapshot.size} likes for deletion`);

      // 4. Delete swipes by this user
      const swipesQuery = query(collection(db, 'swipes'), where('userId', '==', userId));
      const swipesSnapshot = await getDocs(swipesQuery);
      swipesSnapshot.forEach(doc => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
      console.log(`Queued ${swipesSnapshot.size} swipes for deletion`);

      // 5. Delete verification requests
      const verificationsQuery = query(collection(db, 'verifications'), where('userId', '==', userId));
      const verificationsSnapshot = await getDocs(verificationsQuery);
      verificationsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
      console.log(`Queued ${verificationsSnapshot.size} verifications for deletion`);

      // 6. Delete blocks (both as blocker and blocked)
      const blocksQuery1 = query(collection(db, 'blocks'), where('blockerId', '==', userId));
      const blocksQuery2 = query(collection(db, 'blocks'), where('blockedId', '==', userId));
      
      const [blocks1, blocks2] = await Promise.all([
        getDocs(blocksQuery1),
        getDocs(blocksQuery2)
      ]);
      
      blocks1.forEach(doc => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
      blocks2.forEach(doc => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
      console.log(`Queued ${blocks1.size + blocks2.size} blocks for deletion`);

      // 7. Delete reports (authored by this user)
      const reportsQuery = query(collection(db, 'reports'), where('reporterId', '==', userId));
      const reportsSnapshot = await getDocs(reportsQuery);
      reportsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
        totalDeleted++;
      });
      console.log(`Queued ${reportsSnapshot.size} reports for deletion`);

      // Commit all deletions in batches (Firestore limit is 500 operations per batch)
      if (totalDeleted > 0) {
        await batch.commit();
        console.log(`Successfully deleted ${totalDeleted} related records`);
      } else {
        console.log('No related data to delete');
      }

      return { success: true, deletedCount: totalDeleted };
    } catch (error) {
      console.error('Error deleting user-related data:', error);
      throw error;
    }
  },

  /**
   * Export user data (GDPR compliance)
   * Returns all user data in JSON format
   */
  async exportUserData() {
    const user = auth.currentUser;
    
    if (!user) {
      return { success: false, error: 'No user is currently logged in' };
    }

    try {
      console.log('Exporting user data for:', user.uid);
      const userData = {};

      // Get user profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        userData.profile = userDoc.data();
      }

      // Get matches
      const matchesQuery1 = query(collection(db, 'matches'), where('user1Id', '==', user.uid));
      const matchesQuery2 = query(collection(db, 'matches'), where('user2Id', '==', user.uid));
      const [matches1, matches2] = await Promise.all([
        getDocs(matchesQuery1),
        getDocs(matchesQuery2)
      ]);
      userData.matches = [...matches1.docs, ...matches2.docs].map(doc => doc.data());

      // Get chats
      const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
      const chatsSnapshot = await getDocs(chatsQuery);
      userData.chats = [];
      
      for (const chatDoc of chatsSnapshot.docs) {
        const messagesSnapshot = await getDocs(collection(db, 'chats', chatDoc.id, 'messages'));
        userData.chats.push({
          ...chatDoc.data(),
          messages: messagesSnapshot.docs.map(msg => msg.data())
        });
      }

      // Get likes
      const likesQuery = query(collection(db, 'likes'), where('fromUserId', '==', user.uid));
      const likesSnapshot = await getDocs(likesQuery);
      userData.likes = likesSnapshot.docs.map(doc => doc.data());

      console.log('User data exported successfully');
      return { success: true, data: userData };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return { success: false, error: error.message };
    }
  }
};

export default UserAccountService;
