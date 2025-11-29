import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * MessagingService - Handles real-time messaging and chat operations
 */
export const MessagingService = {
  /**
   * Send a message in a chat
   */
  async sendMessage(chatId, senderId, senderName, receiverId, text) {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      const message = {
        senderId,
        senderName,
        receiverId,
        text: text.trim(),
        timestamp: serverTimestamp(),
        read: false,
        delivered: true,
      };

      const docRef = await addDoc(messagesRef, message);

      // Update chat metadata with last message
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: text.trim(),
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: senderId,
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Subscribe to messages in a chat (real-time)
   */
  subscribeToMessages(chatId, callback) {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback({ success: true, messages });
        },
        (error) => {
          console.error('Error subscribing to messages:', error);
          callback({ success: false, error: error.message });
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up message subscription:', error);
      return () => {};
    }
  },

  /**
   * Mark a message as read
   */
  async markMessageAsRead(chatId, messageId, userId) {
    try {
      const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
      await updateDoc(messageRef, {
        read: true,
        readBy: userId,
        readAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get chat metadata
   */
  async getChat(chatId) {
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        return { success: true, chat: { id: chatSnap.id, ...chatSnap.data() } };
      }

      return { success: false, error: 'Chat not found' };
    } catch (error) {
      console.error('Error getting chat:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all chats for a user (real-time)
   */
  subscribeToUserChats(userId, callback) {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', userId)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const chats = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Sort by last message time
          chats.sort((a, b) => {
            const timeA = a.lastMessageAt
              ? a.lastMessageAt.toDate?.().getTime() || new Date(a.lastMessageAt).getTime()
              : 0;
            const timeB = b.lastMessageAt
              ? b.lastMessageAt.toDate?.().getTime() || new Date(b.lastMessageAt).getTime()
              : 0;
            return timeB - timeA;
          });

          callback({ success: true, chats });
        },
        (error) => {
          console.error('Error subscribing to chats:', error);
          callback({ success: false, error: error.message });
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up chats subscription:', error);
      return () => {};
    }
  },

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(chatId, userId, isTyping) {
    try {
      const chatRef = doc(db, 'chats', chatId);
      const updateData = {};

      if (isTyping) {
        updateData[`typingUsers.${userId}`] = true;
      } else {
        updateData[`typingUsers.${userId}`] = false;
      }

      await updateDoc(chatRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error sending typing indicator:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Subscribe to chat typing indicators
   */
  subscribeToTypingIndicators(chatId, callback) {
    try {
      const chatRef = doc(db, 'chats', chatId);

      const unsubscribe = onSnapshot(
        chatRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const typingUsers = snapshot.data().typingUsers || {};
            const typingList = Object.keys(typingUsers).filter(
              (uid) => typingUsers[uid] === true
            );
            callback({ success: true, typingUsers: typingList });
          }
        },
        (error) => {
          console.error('Error subscribing to typing indicators:', error);
          callback({ success: false, error: error.message });
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up typing subscription:', error);
      return () => {};
    }
  },

  /**
   * Delete a chat
   */
  async deleteChat(chatId) {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        deleted: true,
        deletedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting chat:', error);
      return { success: false, error: error.message };
    }
  },
};

export default MessagingService;
