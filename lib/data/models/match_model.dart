import 'package:cloud_firestore/cloud_firestore.dart';

/// MatchModel - Represents a mutual match between two users
/// Ported from web app models/SwipeModel.js
class MatchModel {
  final String? id;
  final String user1Id;
  final String user2Id;
  final String user1Name;
  final String user2Name;
  final String? user1Photo;
  final String? user2Photo;
  final DateTime matchedAt;
  final String? chatId;

  MatchModel({
    this.id,
    required this.user1Id,
    required this.user2Id,
    required this.user1Name,
    required this.user2Name,
    this.user1Photo,
    this.user2Photo,
    required this.matchedAt,
    this.chatId,
  });

  /// Create from Firestore document
  factory MatchModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return MatchModel(
      id: doc.id,
      user1Id: data['user1Id'] ?? '',
      user2Id: data['user2Id'] ?? '',
      user1Name: data['user1Name'] ?? 'User',
      user2Name: data['user2Name'] ?? 'User',
      user1Photo: data['user1Photo'],
      user2Photo: data['user2Photo'],
      matchedAt: (data['matchedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      chatId: data['chatId'],
    );
  }

  /// Convert to Firestore map
  Map<String, dynamic> toFirestore() {
    return {
      'user1Id': user1Id,
      'user2Id': user2Id,
      'user1Name': user1Name,
      'user2Name': user2Name,
      'user1Photo': user1Photo,
      'user2Photo': user2Photo,
      'matchedAt': Timestamp.fromDate(matchedAt),
      'chatId': chatId,
    };
  }

  /// Get other user's ID (not current user)
  String getOtherUserId(String currentUserId) {
    return currentUserId == user1Id ? user2Id : user1Id;
  }

  /// Get other user's name (not current user)
  String getOtherUserName(String currentUserId) {
    return currentUserId == user1Id ? user2Name : user1Name;
  }

  /// Get other user's photo (not current user)
  String? getOtherUserPhoto(String currentUserId) {
    return currentUserId == user1Id ? user2Photo : user1Photo;
  }

  MatchModel copyWith({
    String? id,
    String? user1Id,
    String? user2Id,
    String? user1Name,
    String? user2Name,
    String? user1Photo,
    String? user2Photo,
    DateTime? matchedAt,
    String? chatId,
  }) {
    return MatchModel(
      id: id ?? this.id,
      user1Id: user1Id ?? this.user1Id,
      user2Id: user2Id ?? this.user2Id,
      user1Name: user1Name ?? this.user1Name,
      user2Name: user2Name ?? this.user2Name,
      user1Photo: user1Photo ?? this.user1Photo,
      user2Photo: user2Photo ?? this.user2Photo,
      matchedAt: matchedAt ?? this.matchedAt,
      chatId: chatId ?? this.chatId,
    );
  }
}
