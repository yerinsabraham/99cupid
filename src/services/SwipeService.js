import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { SwipeModel, LikeModel, MatchModel } from '../models/SwipeModel';

/**
 * SwipeService - Handles swipe, like, and match operations
 */
export const SwipeService = {
  /**
   * Record a swipe action
   */
  async recordSwipe(userId, targetUserId, direction) {
    try {
      const swipeRef = collection(db, 'swipes');
      const swipe = new SwipeModel({
        userId,
        targetUserId,
        direction,
      });

      const docRef = await addDoc(swipeRef, swipe.toFirestore());
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error recording swipe:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if user has already swiped on a target user
   */
  async hasSwipedOn(userId, targetUserId) {
    try {
      const swipesRef = collection(db, 'swipes');
      const q = query(
        swipesRef,
        where('userId', '==', userId),
        where('targetUserId', '==', targetUserId)
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking swipe status:', error);
      return false;
    }
  },

  /**
   * Get all profiles swiped by user
   */
  async getSwipedProfiles(userId) {
    try {
      const swipesRef = collection(db, 'swipes');
      const q = query(swipesRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting swiped profiles:', error);
      return [];
    }
  },

  /**
   * Like a user (record like action)
   */
  async likeUser(fromUserId, toUserId, fromUserData, toUserData) {
    try {
      // Record the like
      const likeRef = collection(db, 'likes');
      const like = new LikeModel({
        fromUserId,
        toUserId,
      });

      await addDoc(likeRef, like.toFirestore());

      // Check if there's a mutual like (match)
      const mutualLikeQuery = query(
        likeRef,
        where('fromUserId', '==', toUserId),
        where('toUserId', '==', fromUserId)
      );

      const snapshot = await getDocs(mutualLikeQuery);
      if (!snapshot.empty) {
        // Create a match
        return await this.createMatch(
          fromUserId,
          toUserId,
          fromUserData,
          toUserData
        );
      }

      return { success: true, isMatch: false };
    } catch (error) {
      console.error('Error liking user:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create a match between two users
   */
  async createMatch(user1Id, user2Id, user1Data, user2Data) {
    try {
      // Create chat first
      const chatRef = collection(db, 'chats');
      const chatData = {
        user1Id,
        user2Id,
        user1Name: user1Data.displayName || 'User',
        user2Name: user2Data.displayName || 'User',
        user1Photo: user1Data.photoURL || null,
        user2Photo: user2Data.photoURL || null,
        participants: [user1Id, user2Id],
        createdAt: serverTimestamp(),
        lastMessageAt: null,
        lastMessage: null,
        unreadCount: 0,
      };

      const chatDocRef = await addDoc(chatRef, chatData);

      // Create match
      const matchRef = collection(db, 'matches');
      const match = new MatchModel({
        user1Id,
        user2Id,
        user1Name: user1Data.displayName || 'User',
        user2Name: user2Data.displayName || 'User',
        user1Photo: user1Data.photoURL || null,
        user2Photo: user2Data.photoURL || null,
        chatId: chatDocRef.id,
      });

      const matchDocRef = await addDoc(matchRef, match.toFirestore());

      return {
        success: true,
        isMatch: true,
        matchId: matchDocRef.id,
        chatId: chatDocRef.id,
        match: { id: matchDocRef.id, ...match.toFirestore() },
      };
    } catch (error) {
      console.error('Error creating match:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Check if two users have a match
   */
  async getMatchBetween(user1Id, user2Id) {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(matchesRef);
      const snapshot = await getDocs(q);

      const match = snapshot.docs.find((doc) => {
        const data = doc.data();
        return (
          (data.user1Id === user1Id && data.user2Id === user2Id) ||
          (data.user1Id === user2Id && data.user2Id === user1Id)
        );
      });

      return match
        ? { id: match.id, ...match.data() }
        : null;
    } catch (error) {
      console.error('Error checking match:', error);
      return null;
    }
  },

  /**
   * Get all matches for a user
   */
  async getUserMatches(userId) {
    try {
      const matchesRef = collection(db, 'matches');
      const q = query(matchesRef);
      const snapshot = await getDocs(q);

      const matches = snapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return data.user1Id === userId || data.user2Id === userId;
        })
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      return matches;
    } catch (error) {
      console.error('Error getting user matches:', error);
      return [];
    }
  },

  /**
   * Pass on a user (no like)
   */
  async passOnUser(userId, targetUserId) {
    try {
      return await this.recordSwipe(userId, targetUserId, 'left');
    } catch (error) {
      console.error('Error passing on user:', error);
      return { success: false, error: error.message };
    }
  },
};

export default SwipeService;
