import 'package:cloud_firestore/cloud_firestore.dart';

/// SwipeModel - Represents a swipe action (left/right)
/// Ported from web app models/SwipeModel.js
class SwipeModel {
  final String? id;
  final String userId;
  final String targetUserId;
  final String direction; // 'left' or 'right'
  final DateTime timestamp;

  SwipeModel({
    this.id,
    required this.userId,
    required this.targetUserId,
    required this.direction,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  /// Create from Firestore document
  factory SwipeModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return SwipeModel(
      id: doc.id,
      userId: data['userId'] ?? '',
      targetUserId: data['targetUserId'] ?? '',
      direction: data['direction'] ?? 'left',
      timestamp: (data['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  /// Convert to Firestore map
  Map<String, dynamic> toFirestore() {
    return {
      'userId': userId,
      'targetUserId': targetUserId,
      'direction': direction,
      'timestamp': Timestamp.fromDate(timestamp),
    };
  }

  bool get isLike => direction == 'right';
  bool get isPass => direction == 'left';

  SwipeModel copyWith({
    String? id,
    String? userId,
    String? targetUserId,
    String? direction,
    DateTime? timestamp,
  }) {
    return SwipeModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      targetUserId: targetUserId ?? this.targetUserId,
      direction: direction ?? this.direction,
      timestamp: timestamp ?? this.timestamp,
    );
  }
}

/// LikeModel - Represents a like action
class LikeModel {
  final String? id;
  final String fromUserId;
  final String toUserId;
  final DateTime timestamp;

  LikeModel({
    this.id,
    required this.fromUserId,
    required this.toUserId,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();

  /// Create from Firestore document
  factory LikeModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return LikeModel(
      id: doc.id,
      fromUserId: data['fromUserId'] ?? '',
      toUserId: data['toUserId'] ?? '',
      timestamp: (data['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  /// Convert to Firestore map
  Map<String, dynamic> toFirestore() {
    return {
      'fromUserId': fromUserId,
      'toUserId': toUserId,
      'timestamp': Timestamp.fromDate(timestamp),
    };
  }
}
