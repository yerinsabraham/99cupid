import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import '../../core/constants/firebase_collections.dart';

/// MessagingService - Real-time messaging
/// Ported from web app MessagingService.js
class MessagingService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Send a message in a chat
  Future<Map<String, dynamic>> sendMessage(
    String chatId,
    String senderId,
    String senderName,
    String receiverId,
    String text,
  ) async {
    try {
      final messageData = {
        'senderId': senderId,
        'senderName': senderName,
        'receiverId': receiverId,
        'text': text.trim(),
        'timestamp': FieldValue.serverTimestamp(),
        'read': false,
        'delivered': true,
      };

      final docRef = await _firestore
          .collection(FirebaseCollections.chats)
          .doc(chatId)
          .collection('messages')
          .add(messageData);

      // Update chat metadata
      await _firestore
          .collection(FirebaseCollections.chats)
          .doc(chatId)
          .update({
        'lastMessage': text.trim(),
        'lastMessageAt': FieldValue.serverTimestamp(),
        'lastMessageSenderId': senderId,
      });

      return {'success': true, 'id': docRef.id};
    } catch (e) {
      if (kDebugMode) {
        print('❌ Error sending message: $e');
      }
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Subscribe to messages in a chat (real-time)
  Stream<List<Map<String, dynamic>>> getMessagesStream(String chatId) {
    return _firestore
        .collection(FirebaseCollections.chats)
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp', descending: false)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => {'id': doc.id, ...doc.data()})
          .toList();
    });
  }

  /// Subscribe to user's chats (real-time)
  Stream<List<Map<String, dynamic>>> getUserChatsStream(String userId) {
    return _firestore
        .collection(FirebaseCollections.chats)
        .where('participants', arrayContains: userId)
        .snapshots()
        .map((snapshot) {
      final chats = snapshot.docs
          .map((doc) => {'id': doc.id, ...doc.data()})
          .toList();

      // Sort by last message time
      chats.sort((a, b) {
        final timeA = a['lastMessageAt'] as Timestamp?;
        final timeB = b['lastMessageAt'] as Timestamp?;
        if (timeA == null) return 1;
        if (timeB == null) return -1;
        return timeB.compareTo(timeA);
      });

      return chats;
    });
  }

  /// Mark message as read
  Future<Map<String, dynamic>> markMessageAsRead(
    String chatId,
    String messageId,
    String userId,
  ) async {
    try {
      await _firestore
          .collection(FirebaseCollections.chats)
          .doc(chatId)
          .collection('messages')
          .doc(messageId)
          .update({
        'read': true,
        'readBy': userId,
        'readAt': FieldValue.serverTimestamp(),
      });

      return {'success': true};
    } catch (e) {
      if (kDebugMode) {
        print('❌ Error marking message as read: $e');
      }
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Get chat metadata
  Future<Map<String, dynamic>?> getChat(String chatId) async {
    try {
      final doc = await _firestore
          .collection(FirebaseCollections.chats)
          .doc(chatId)
          .get();

      if (doc.exists) {
        return {'id': doc.id, ...doc.data()!};
      }
      return null;
    } catch (e) {
      if (kDebugMode) {
        print('❌ Error getting chat: $e');
      }
      return null;
    }
  }
}
