import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';

/// AdminService - Handles admin panel operations
/// Ported from web app AdminService.js
class AdminService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Check if current user is admin
  Future<bool> isAdmin(String userId) async {
    try {
      final userDoc = await _firestore.collection('users').doc(userId).get();
      if (!userDoc.exists) return false;
      return userDoc.data()?['isAdmin'] == true;
    } catch (e) {
      return false;
    }
  }

  /// Get all users
  Future<List<UserModel>> getAllUsers() async {
    try {
      final snapshot = await _firestore.collection('users').get();
      
      final users = snapshot.docs
          .map((doc) => UserModel.fromFirestore(doc))
          .toList();

      // Sort by creation date (newest first)
      users.sort((a, b) {
        final timeA = a.createdAt ?? DateTime.now();
        final timeB = b.createdAt ?? DateTime.now();
        return timeB.compareTo(timeA);
      });

      return users;
    } catch (e) {
      return [];
    }
  }

  /// Get all reports
  Future<List<Map<String, dynamic>>> getAllReports() async {
    try {
      final snapshot = await _firestore.collection('reports').get();

      final reports = snapshot.docs.map((doc) {
        final data = doc.data();
        return {
          'id': doc.id,
          ...data,
        };
      }).toList();

      // Sort by creation date (newest first)
      reports.sort((a, b) {
        final timeA = (a['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now();
        final timeB = (b['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now();
        return timeB.compareTo(timeA);
      });

      return reports;
    } catch (e) {
      return [];
    }
  }

  /// Get all verification requests
  Future<List<Map<String, dynamic>>> getVerificationRequests({bool includeAll = false}) async {
    try {
      Query query = _firestore.collection('verifications');
      
      if (!includeAll) {
        query = query.where('status', isEqualTo: 'pending');
      }
      
      final snapshot = await query.get();
      
      final verifications = <Map<String, dynamic>>[];
      
      for (final verDoc in snapshot.docs) {
        final verData = verDoc.data() as Map<String, dynamic>;
        
        // Get user details
        final userId = verData['userId'] as String?;
        Map<String, dynamic>? userData;
        
        if (userId != null) {
          final userDoc = await _firestore.collection('users').doc(userId).get();
          if (userDoc.exists) {
            userData = userDoc.data();
          }
        }
        
        verifications.add({
          'id': verDoc.id,
          ...verData,
          'userName': userData?['displayName'] ?? 'Unknown',
          'userEmail': userData?['email'] ?? '',
          'userPhotos': userData?['photos'] ?? [],
        });
      }

      // Sort by submission date (oldest pending first)
      verifications.sort((a, b) {
        final timeA = (a['submittedAt'] as Timestamp?)?.toDate() ?? DateTime.now();
        final timeB = (b['submittedAt'] as Timestamp?)?.toDate() ?? DateTime.now();
        return timeA.compareTo(timeB);
      });

      return verifications;
    } catch (e) {
      return [];
    }
  }

  /// Approve user verification
  Future<bool> approveVerification(String verificationId, String adminId) async {
    try {
      final verificationRef = _firestore.collection('verifications').doc(verificationId);
      final verificationDoc = await verificationRef.get();
      
      if (!verificationDoc.exists) return false;

      final verData = verificationDoc.data()!;

      // Update verification status
      await verificationRef.update({
        'status': 'approved',
        'reviewedAt': FieldValue.serverTimestamp(),
        'reviewedBy': adminId,
        'rejectionReason': null,
      });

      // Update user profile based on verification type
      final userRef = _firestore.collection('users').doc(verData['userId']);
      final updateData = <String, dynamic>{
        'verification.${verData['verificationType']}': 'approved',
        'verification.${verData['verificationType']}VerifiedAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      };

      // Set the specific verified flag
      if (verData['verificationType'] == 'phone') {
        updateData['isPhoneVerified'] = true;
      } else if (verData['verificationType'] == 'photo') {
        updateData['isPhotoVerified'] = true;
      } else if (verData['verificationType'] == 'id') {
        updateData['isIDVerified'] = true;
      }

      await userRef.update(updateData);

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Reject user verification
  Future<bool> rejectVerification(
    String verificationId, 
    String adminId, 
    {String reason = 'Does not meet verification requirements'}
  ) async {
    try {
      final verificationRef = _firestore.collection('verifications').doc(verificationId);
      final verificationDoc = await verificationRef.get();
      
      if (!verificationDoc.exists) return false;

      final verData = verificationDoc.data()!;

      // Update verification status
      await verificationRef.update({
        'status': 'rejected',
        'rejectionReason': reason,
        'reviewedAt': FieldValue.serverTimestamp(),
        'reviewedBy': adminId,
      });

      // Update user profile
      final userRef = _firestore.collection('users').doc(verData['userId']);
      await userRef.update({
        'verification.${verData['verificationType']}': 'rejected',
        'verification.${verData['verificationType']}RejectionReason': reason,
        'updatedAt': FieldValue.serverTimestamp(),
      });

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Suspend user account
  Future<bool> suspendUser(String userId, {String reason = ''}) async {
    try {
      await _firestore.collection('users').doc(userId).update({
        'accountStatus': 'suspended',
        'suspensionReason': reason,
        'suspendedAt': FieldValue.serverTimestamp(),
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Unsuspend user account
  Future<bool> unsuspendUser(String userId) async {
    try {
      await _firestore.collection('users').doc(userId).update({
        'accountStatus': 'active',
        'suspensionReason': null,
        'suspendedAt': null,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Delete user (soft delete)
  Future<bool> deleteUser(String userId, {String reason = ''}) async {
    try {
      await _firestore.collection('users').doc(userId).update({
        'accountStatus': 'deleted',
        'deletionReason': reason,
        'deletedAt': FieldValue.serverTimestamp(),
        'displayName': 'Deleted User',
        'bio': 'Account deleted',
        'photos': [],
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Resolve report
  Future<bool> resolveReport(String reportId, String status, {String? adminNotes}) async {
    try {
      await _firestore.collection('reports').doc(reportId).update({
        'status': status,
        'resolvedAt': FieldValue.serverTimestamp(),
        'adminNotes': adminNotes ?? '',
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Get dashboard stats
  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      final usersSnapshot = await _firestore.collection('users').get();
      final matchesSnapshot = await _firestore.collection('matches').get();
      final reportsSnapshot = await _firestore
          .collection('reports')
          .where('status', isEqualTo: 'pending')
          .get();
      final verificationsSnapshot = await _firestore
          .collection('verifications')
          .where('status', isEqualTo: 'pending')
          .get();

      // Count active users
      final activeUsers = usersSnapshot.docs.where((doc) {
        final status = doc.data()['accountStatus'];
        return status == null || status == 'active';
      }).length;

      // Count verified users
      final verifiedUsers = usersSnapshot.docs.where((doc) {
        final data = doc.data();
        return data['isPhotoVerified'] == true || 
               data['isIDVerified'] == true || 
               data['isPhoneVerified'] == true;
      }).length;

      return {
        'totalUsers': usersSnapshot.size,
        'activeUsers': activeUsers,
        'verifiedUsers': verifiedUsers,
        'totalMatches': matchesSnapshot.size,
        'pendingReports': reportsSnapshot.size,
        'pendingVerifications': verificationsSnapshot.size,
      };
    } catch (e) {
      return {
        'totalUsers': 0,
        'activeUsers': 0,
        'verifiedUsers': 0,
        'totalMatches': 0,
        'pendingReports': 0,
        'pendingVerifications': 0,
      };
    }
  }
}
