/**
 * Cloud Functions for 99Cupid Dating App
 * Handles chat notifications, message processing, and data consistency
 */

import {setGlobalOptions} from "firebase-functions";
import {onDocumentCreated, onDocumentUpdated} from "firebase-functions/v2/firestore";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Set global options for cost control
setGlobalOptions({maxInstances: 10, region: "us-central1"});

/**
 * Helper function to send push notification via FCM
 * @param {string} userId - The user ID to send notification to
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {string} notificationType - Type of notification (matches, messages, likes)
 * @param {object} data - Optional data payload
 * @return {Promise<void>}
 */
async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  notificationType: "matches" | "messages" | "likes",
  data?: {[key: string]: string}
): Promise<void> {
  try {
    // Get user's FCM token and notification preferences
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    const fcmToken = userData?.fcmToken;

    if (!fcmToken) {
      logger.info(`No FCM token found for user ${userId}`);
      return;
    }

    // Check if user has enabled this notification type
    const notificationPrefs = userData?.notifications || {};
    const isEnabled = notificationPrefs[notificationType] !== false; // Default to true

    if (!isEnabled) {
      logger.info(`User ${userId} has disabled ${notificationType} notifications`);
      return;
    }

    // Send notification
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: fcmToken,
      android: {
        notification: {
          icon: "ic_launcher",
          color: "#E91E63",
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    await admin.messaging().send(message);
    logger.info(`Push notification sent to user ${userId}: ${title}`);
  } catch (error) {
    const errorCode = (error as {code?: string})?.code;
    if (errorCode === "messaging/registration-token-not-registered") {
      // Token is invalid, delete it from user doc
      logger.warn(`Invalid FCM token for user ${userId}, removing...`);
      await db.collection("users").doc(userId).update({
        fcmToken: admin.firestore.FieldValue.delete(),
      });
    } else {
      logger.error(`Error sending push notification to ${userId}:`, error);
    }
  }
}

/**
 * Triggered when a new message is created
 * Updates the parent chat document with last message info and unread counts
 */
export const onMessageCreated = onDocumentCreated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    const message = event.data?.data();
    const chatId = event.params.chatId;
    const messageId = event.params.messageId;

    if (!message) {
      logger.error("No message data found");
      return;
    }

    logger.info(`New message created in chat ${chatId}: ${messageId}`);

    try {
      // Get the chat document
      const chatRef = db.collection("chats").doc(chatId);
      const chatDoc = await chatRef.get();

      if (!chatDoc.exists) {
        logger.error(`Chat ${chatId} not found`);
        return;
      }

      const chatData = chatDoc.data();
      if (!chatData) {
        logger.error(`Chat ${chatId} has no data`);
        return;
      }

      const participants = chatData.participants || [];

      // Determine the other participant (receiver)
      const receiverId = participants.find((id: string) => id !== message.senderId);

      if (!receiverId) {
        logger.error("Could not determine receiver");
        return;
      }

      // Update chat document with last message info
      const updateData: {[key: string]: any} = {
        lastMessage: message.text || message.type || "Media",
        lastMessageAt: message.timestamp || admin.firestore.FieldValue.serverTimestamp(),
        lastMessageSenderId: message.senderId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Increment unread count for the receiver
      updateData[`unreadCount.${receiverId}`] = admin.firestore.FieldValue.increment(1);

      await chatRef.update(updateData);

      logger.info(`Chat ${chatId} updated successfully`);

      // Send push notification to receiver
      try {
        const senderDoc = await db.collection("users").doc(message.senderId).get();
        const senderName = senderDoc.data()?.displayName || "Someone";
        const messagePreview = message.text || "Sent a message";

        await sendPushNotification(
          receiverId,
          `💌 New message from ${senderName}`,
          messagePreview.substring(0, 100),
          "messages",
          {
            type: "new_message",
            chatId,
            senderId: message.senderId,
          }
        );
      } catch (notifError) {
        logger.error("Error sending notification:", notifError);
        // Don't fail the function if notification fails
      }

    } catch (error) {
      logger.error(`Error updating chat ${chatId}:`, error);
    }
  }
);

/**
 * Triggered when a new match is created
 * Sends push notifications to both users
 */
export const onMatchCreated = onDocumentCreated(
  "matches/{matchId}",
  async (event) => {
    const match = event.data?.data();
    const matchId = event.params.matchId;

    if (!match) {
      logger.error("No match data found");
      return;
    }

    const {user1Id, user2Id} = match;
    logger.info(`New match created: ${user1Id} ❤️ ${user2Id}`);

    try {
      // Get both users' names
      const [user1Doc, user2Doc] = await Promise.all([
        db.collection("users").doc(user1Id).get(),
        db.collection("users").doc(user2Id).get(),
      ]);

      const user1Name = user1Doc.data()?.displayName || "Someone";
      const user2Name = user2Doc.data()?.displayName || "Someone";

      // Send notification to user1
      await sendPushNotification(
        user1Id,
        "💕 It's a Match!",
        `You and ${user2Name} liked each other!`,
        "matches",
        {
          type: "new_match",
          matchId,
          otherUserId: user2Id,
        }
      );

      // Send notification to user2
      await sendPushNotification(
        user2Id,
        "💕 It's a Match!",
        `You and ${user1Name} liked each other!`,
        "matches",
        {
          type: "new_match",
          matchId,
          otherUserId: user1Id,
        }
      );

      logger.info(`Match notifications sent for ${matchId}`);
    } catch (error) {
      logger.error(`Error sending match notifications for ${matchId}:`, error);
    }
  }
);

/**
 * Triggered when a new like is created
 * Sends push notification to the liked user (only if not a match)
 */
export const onLikeCreated = onDocumentCreated(
  "likes/{likeId}",
  async (event) => {
    const like = event.data?.data();

    if (!like) {
      logger.error("No like data found");
      return;
    }

    const {fromUserId, toUserId} = like;
    logger.info(`New like: ${fromUserId} liked ${toUserId}`);

    try {
      // Check if this is a mutual like (match)
      // If so, skip notification since onMatchCreated will handle it
      const mutualLikeSnapshot = await db
        .collection("likes")
        .where("fromUserId", "==", toUserId)
        .where("toUserId", "==", fromUserId)
        .get();

      if (!mutualLikeSnapshot.empty) {
        logger.info("Mutual like detected, skipping notification (match notification will be sent)");
        return;
      }

      // Get sender's name
      const senderDoc = await db.collection("users").doc(fromUserId).get();
      const senderName = senderDoc.data()?.displayName || "Someone";

      // Send notification to the liked user
      await sendPushNotification(
        toUserId,
        "💖 New Like!",
        `${senderName} likes you!`,
        "likes",
        {
          type: "new_like",
          fromUserId,
        }
      );

      logger.info(`Like notification sent to ${toUserId}`);
    } catch (error) {
      logger.error("Error processing like notification:", error);
      // Don't fail the function if notification fails
    }
  }
);

/**
 * Triggered when a message is updated (e.g., marked as read)
 * Currently handles read receipts
 */
export const onMessageUpdated = onDocumentUpdated(
  "chats/{chatId}/messages/{messageId}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    const chatId = event.params.chatId;

    if (!before || !after) return;

    // Check if message was marked as read
    if (!before.isRead && after.isRead) {
      logger.info(`Message marked as read in chat ${chatId}`);
      // Could trigger additional logic here (delivery receipts, analytics, etc.)
    }
  }
);

/**
 * Callable function to mark all messages as read in a chat
 * Called from the mobile app when user opens a chat
 */
export const markMessagesAsRead = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  const {chatId} = request.data;
  if (!chatId) {
    throw new HttpsError("invalid-argument", "chatId is required");
  }

  try {
    logger.info(`Marking messages as read for user ${userId} in chat ${chatId}`);

    // Verify user is a participant
    const chatDoc = await db.collection("chats").doc(chatId).get();
    if (!chatDoc.exists) {
      throw new HttpsError("not-found", "Chat not found");
    }

    const chatData = chatDoc.data();
    if (!chatData) {
      throw new HttpsError("internal", "Chat data is missing");
    }
    const participants = chatData.participants || [];

    if (!participants.includes(userId)) {
      throw new HttpsError("permission-denied", "User is not a participant in this chat");
    }

    // Get all unread messages sent by other user
    const messagesSnapshot = await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .where("senderId", "!=", userId)
      .where("isRead", "==", false)
      .get();

    // Use batch write for efficiency
    const batch = db.batch();
    let count = 0;

    messagesSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        isRead: true,
        readAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      count++;
    });

    // Reset unread count for this user in chat document
    batch.update(db.collection("chats").doc(chatId), {
      [`unreadCount.${userId}`]: 0,
    });

    await batch.commit();

    logger.info(`Marked ${count} messages as read in chat ${chatId}`);

    return {success: true, markedCount: count};
  } catch (error) {
    logger.error("Error marking messages as read:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to mark messages as read");
  }
});

/**
 * Callable function to delete a chat and all its messages
 * Called when user deletes a conversation
 */
export const deleteChat = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  const {chatId} = request.data;
  if (!chatId) {
    throw new HttpsError("invalid-argument", "chatId is required");
  }

  try {
    logger.info(`Deleting chat ${chatId} for user ${userId}`);

    // Verify user is a participant
    const chatDoc = await db.collection("chats").doc(chatId).get();
    if (!chatDoc.exists) {
      throw new HttpsError("not-found", "Chat not found");
    }

    const chatData = chatDoc.data();
    if (!chatData) {
      throw new HttpsError("internal", "Chat data is missing");
    }
    const participants = chatData.participants || [];

    if (!participants.includes(userId)) {
      throw new HttpsError("permission-denied", "User is not a participant in this chat");
    }

    // Delete all messages in the chat
    const messagesSnapshot = await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .get();

    const batch = db.batch();
    messagesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the chat document
    batch.delete(db.collection("chats").doc(chatId));

    await batch.commit();

    logger.info(`Successfully deleted chat ${chatId} with ${messagesSnapshot.size} messages`);

    return {success: true, deletedMessages: messagesSnapshot.size};
  } catch (error) {
    logger.error("Error deleting chat:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to delete chat");
  }
});

/**
 * Callable function to create a new chat between two users
 * Ensures no duplicate chats exist
 */
export const createChat = onCall(async (request) => {
  const userId = request.auth?.uid;
  if (!userId) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  const {otherUserId} = request.data;
  if (!otherUserId) {
    throw new HttpsError("invalid-argument", "otherUserId is required");
  }

  if (userId === otherUserId) {
    throw new HttpsError("invalid-argument", "Cannot create chat with yourself");
  }

  try {
    logger.info(`Creating chat between ${userId} and ${otherUserId}`);

    // Check if chat already exists
    const existingChats = await db
      .collection("chats")
      .where("participants", "array-contains", userId)
      .get();

    for (const doc of existingChats.docs) {
      const participants = doc.data().participants || [];
      if (participants.includes(otherUserId)) {
        logger.info(`Chat already exists: ${doc.id}`);
        return {chatId: doc.id, created: false};
      }
    }

    // Get user display names
    const [user1Doc, user2Doc] = await Promise.all([
      db.collection("users").doc(userId).get(),
      db.collection("users").doc(otherUserId).get(),
    ]);

    const user1Name = user1Doc.data()?.firstName || "User";
    const user2Name = user2Doc.data()?.firstName || "User";
    const user1Photo = user1Doc.data()?.profilePhotoUrl || null;
    const user2Photo = user2Doc.data()?.profilePhotoUrl || null;

    // Create new chat
    const newChat = {
      participants: [userId, otherUserId],
      participantNames: {
        [userId]: user1Name,
        [otherUserId]: user2Name,
      },
      participantPhotos: {
        [userId]: user1Photo,
        [otherUserId]: user2Photo,
      },
      lastMessage: null,
      lastMessageAt: null,
      lastMessageSenderId: null,
      unreadCount: {
        [userId]: 0,
        [otherUserId]: 0,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const chatRef = await db.collection("chats").add(newChat);

    logger.info(`Created new chat: ${chatRef.id}`);

    return {chatId: chatRef.id, created: true};
  } catch (error) {
    logger.error("Error creating chat:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create chat");
  }
});

/**
 * Scheduled function to clean up old deleted messages (runs daily)
 * Removes messages older than 30 days that are marked as deleted
 */
// Uncomment to enable scheduled cleanup
// export const cleanupOldMessages = onSchedule("every 24 hours", async () => {
//   const thirtyDaysAgo = new Date();
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//   const chatsSnapshot = await db.collection("chats").get();
//   let totalDeleted = 0;

//   for (const chatDoc of chatsSnapshot.docs) {
//     const messagesSnapshot = await chatDoc.ref
//       .collection("messages")
//       .where("deletedAt", "<", thirtyDaysAgo)
//       .get();

//     const batch = db.batch();
//     messagesSnapshot.docs.forEach((doc) => {
//       batch.delete(doc.ref);
//       totalDeleted++;
//     });

//     if (messagesSnapshot.size > 0) {
//       await batch.commit();
//     }
//   }

//   logger.info(`Cleaned up ${totalDeleted} old messages`);
// });

