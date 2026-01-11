import 'package:cloud_firestore/cloud_firestore.dart';

/// BlockReportService - Handles blocking and reporting users
/// Ported from web app BlockReportService.js
class BlockReportService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Report reasons
  static const List<String> reportReasons = [
    'inappropriate',
    'fake_profile',
    'harassment',
    'spam',
    'other',
  ];

  /// Block a user
  Future<Map<String, dynamic>> blockUser(String currentUserId, String userToBlockId) async {
    try {
      final userRef = _firestore.collection('users').doc(currentUserId);
      final userDoc = await userRef.get();

      if (!userDoc.exists) {
        return {'success': false, 'error': 'User not found'};
      }

      final blockedUsers = List<String>.from(userDoc.data()?['blockedUsers'] ?? []);

      if (blockedUsers.contains(userToBlockId)) {
        return {'success': false, 'error': 'User already blocked'};
      }

      await userRef.update({
        'blockedUsers': [...blockedUsers, userToBlockId],
        'updatedAt': FieldValue.serverTimestamp(),
      });

      // Also update the blocked user's blockedByUsers
      final blockedUserRef = _firestore.collection('users').doc(userToBlockId);
      final blockedUserDoc = await blockedUserRef.get();

      if (blockedUserDoc.exists) {
        final blockedByUsers = List<String>.from(blockedUserDoc.data()?['blockedByUsers'] ?? []);
        await blockedUserRef.update({
          'blockedByUsers': [...blockedByUsers, currentUserId],
        });
      }

      return {'success': true};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Unblock a user
  Future<Map<String, dynamic>> unblockUser(String currentUserId, String userToUnblockId) async {
    try {
      final userRef = _firestore.collection('users').doc(currentUserId);
      final userDoc = await userRef.get();

      if (!userDoc.exists) {
        return {'success': false, 'error': 'User not found'};
      }

      final blockedUsers = List<String>.from(userDoc.data()?['blockedUsers'] ?? []);
      blockedUsers.remove(userToUnblockId);

      await userRef.update({
        'blockedUsers': blockedUsers,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      // Also update the unblocked user's blockedByUsers
      final unblockedUserRef = _firestore.collection('users').doc(userToUnblockId);
      final unblockedUserDoc = await unblockedUserRef.get();

      if (unblockedUserDoc.exists) {
        final blockedByUsers = List<String>.from(unblockedUserDoc.data()?['blockedByUsers'] ?? []);
        blockedByUsers.remove(currentUserId);
        await unblockedUserRef.update({
          'blockedByUsers': blockedByUsers,
        });
      }

      return {'success': true};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Check if user is blocked by another user
  Future<bool> isBlockedBy(String currentUserId, String otherUserId) async {
    try {
      final userDoc = await _firestore.collection('users').doc(otherUserId).get();
      if (!userDoc.exists) return false;

      final blockedUsers = List<String>.from(userDoc.data()?['blockedUsers'] ?? []);
      return blockedUsers.contains(currentUserId);
    } catch (e) {
      return false;
    }
  }

  /// Check if user has blocked another user
  Future<bool> hasBlocked(String currentUserId, String otherUserId) async {
    try {
      final userDoc = await _firestore.collection('users').doc(currentUserId).get();
      if (!userDoc.exists) return false;

      final blockedUsers = List<String>.from(userDoc.data()?['blockedUsers'] ?? []);
      return blockedUsers.contains(otherUserId);
    } catch (e) {
      return false;
    }
  }

  /// Get list of blocked users
  Future<List<Map<String, dynamic>>> getBlockedUsers(String userId) async {
    try {
      final userDoc = await _firestore.collection('users').doc(userId).get();
      if (!userDoc.exists) return [];

      final blockedIds = List<String>.from(userDoc.data()?['blockedUsers'] ?? []);

      final blockedUsers = <Map<String, dynamic>>[];
      for (final id in blockedIds) {
        final blockedUserDoc = await _firestore.collection('users').doc(id).get();
        if (blockedUserDoc.exists) {
          blockedUsers.add({
            'id': id,
            ...blockedUserDoc.data()!,
          });
        }
      }

      return blockedUsers;
    } catch (e) {
      return [];
    }
  }

  /// Report a user
  Future<Map<String, dynamic>> reportUser(
    String reportedUserId,
    String reportingUserId,
    String reason,
    String description,
  ) async {
    try {
      final report = {
        'reportedUserId': reportedUserId,
        'reportingUserId': reportingUserId,
        'reason': reason,
        'description': description,
        'status': 'pending',
        'createdAt': FieldValue.serverTimestamp(),
        'resolvedAt': null,
        'adminNotes': '',
      };

      final docRef = await _firestore.collection('reports').add(report);

      // Add to user's reportedBy list
      final userRef = _firestore.collection('users').doc(reportedUserId);
      final userDoc = await userRef.get();

      if (userDoc.exists) {
        final reportedBy = List<String>.from(userDoc.data()?['reportedBy'] ?? []);
        await userRef.update({
          'reportedBy': [...reportedBy, reportingUserId],
        });
      }

      return {'success': true, 'reportId': docRef.id};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Get reports for a specific user
  Future<List<Map<String, dynamic>>> getUserReports(String userId) async {
    try {
      final snapshot = await _firestore
          .collection('reports')
          .where('reportedUserId', isEqualTo: userId)
          .get();

      return snapshot.docs.map((doc) {
        return {
          'id': doc.id,
          ...doc.data(),
        };
      }).toList();
    } catch (e) {
      return [];
    }
  }

  /// Get my reports (reports I've made)
  Future<List<Map<String, dynamic>>> getMyReports(String userId) async {
    try {
      final snapshot = await _firestore
          .collection('reports')
          .where('reportingUserId', isEqualTo: userId)
          .get();

      return snapshot.docs.map((doc) {
        return {
          'id': doc.id,
          ...doc.data(),
        };
      }).toList();
    } catch (e) {
      return [];
    }
  }
}
