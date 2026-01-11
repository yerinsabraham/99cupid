import 'package:cloud_firestore/cloud_firestore.dart';

/// VerificationService - Handles user verification operations
/// Ported from web app VerificationService.js
class VerificationService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Verification types
  static const String phoneVerification = 'phone';
  static const String photoVerification = 'photo';
  static const String idVerification = 'id';

  // Verification statuses
  static const String statusPending = 'pending';
  static const String statusApproved = 'approved';
  static const String statusRejected = 'rejected';
  static const String statusExpired = 'expired';

  /// Submit phone verification request
  Future<Map<String, dynamic>> submitPhoneVerification(
    String userId, 
    String phoneNumber, 
    String otp
  ) async {
    try {
      final verificationRef = _firestore.collection('verifications').doc();
      final verificationData = {
        'userId': userId,
        'verificationType': phoneVerification,
        'status': statusPending,
        'phoneNumber': phoneNumber,
        'otp': otp,
        'submittedAt': FieldValue.serverTimestamp(),
        'expiresAt': Timestamp.fromDate(
          DateTime.now().add(const Duration(days: 180))
        ),
        'verifiedAt': null,
        'rejectionReason': null,
      };

      await verificationRef.set(verificationData);

      // Update user profile with phone verification status
      await _firestore.collection('users').doc(userId).update({
        'verification.phone': statusPending,
        'verification.phoneNumber': phoneNumber,
        'verification.phoneVerifiedAt': null,
      });

      return {'success': true, 'verificationId': verificationRef.id};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Verify phone OTP
  Future<Map<String, dynamic>> verifyPhoneOTP(
    String userId, 
    String phoneNumber, 
    String otp
  ) async {
    try {
      // Find pending verification for this user and phone
      final snapshot = await _firestore
          .collection('verifications')
          .where('userId', isEqualTo: userId)
          .where('verificationType', isEqualTo: phoneVerification)
          .where('phoneNumber', isEqualTo: phoneNumber)
          .where('status', isEqualTo: statusPending)
          .orderBy('submittedAt', descending: true)
          .limit(1)
          .get();

      if (snapshot.docs.isEmpty) {
        return {'success': false, 'error': 'No pending verification found'};
      }

      final verificationDoc = snapshot.docs.first;
      final verificationData = verificationDoc.data();

      // Check if OTP matches
      if (verificationData['otp'] != otp) {
        return {'success': false, 'error': 'Invalid OTP'};
      }

      // Check if OTP is expired (10 minutes)
      final submittedAt = (verificationData['submittedAt'] as Timestamp).toDate();
      final now = DateTime.now();
      final diffMinutes = now.difference(submittedAt).inMinutes;

      if (diffMinutes > 10) {
        return {'success': false, 'error': 'OTP expired'};
      }

      // Update verification status
      await _firestore.collection('verifications').doc(verificationDoc.id).update({
        'status': statusApproved,
        'verifiedAt': FieldValue.serverTimestamp(),
      });

      // Update user profile
      await _firestore.collection('users').doc(userId).update({
        'verification.phone': statusApproved,
        'verification.phoneVerifiedAt': FieldValue.serverTimestamp(),
        'isPhoneVerified': true,
      });

      return {'success': true};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Submit photo verification request
  Future<Map<String, dynamic>> submitPhotoVerification(
    String userId, 
    String selfieUrl, 
    {Map<String, dynamic>? metadata}
  ) async {
    try {
      final verificationRef = _firestore.collection('verifications').doc();
      final verificationData = {
        'userId': userId,
        'verificationType': photoVerification,
        'status': statusPending,
        'selfieUrl': selfieUrl,
        'metadata': metadata ?? {},
        'submittedAt': FieldValue.serverTimestamp(),
        'expiresAt': Timestamp.fromDate(
          DateTime.now().add(const Duration(days: 180))
        ),
        'reviewedAt': null,
        'reviewedBy': null,
        'rejectionReason': null,
      };

      await verificationRef.set(verificationData);

      // Update user profile with photo verification status
      await _firestore.collection('users').doc(userId).update({
        'verification.photo': statusPending,
        'verification.photoSubmittedAt': FieldValue.serverTimestamp(),
      });

      return {'success': true, 'verificationId': verificationRef.id};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Submit ID verification request
  Future<Map<String, dynamic>> submitIDVerification(
    String userId, 
    String idType, 
    String frontUrl, 
    {String? backUrl, Map<String, dynamic>? extractedData}
  ) async {
    try {
      final verificationRef = _firestore.collection('verifications').doc();
      final verificationData = {
        'userId': userId,
        'verificationType': idVerification,
        'status': statusPending,
        'idType': idType,
        'frontUrl': frontUrl,
        'backUrl': backUrl,
        'extractedData': extractedData ?? {},
        'submittedAt': FieldValue.serverTimestamp(),
        'expiresAt': Timestamp.fromDate(
          DateTime.now().add(const Duration(days: 365))
        ),
        'reviewedAt': null,
        'reviewedBy': null,
        'rejectionReason': null,
      };

      await verificationRef.set(verificationData);

      // Update user profile with ID verification status
      await _firestore.collection('users').doc(userId).update({
        'verification.id': statusPending,
        'verification.idSubmittedAt': FieldValue.serverTimestamp(),
      });

      return {'success': true, 'verificationId': verificationRef.id};
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Get user verification status
  Future<Map<String, dynamic>> getUserVerificationStatus(String userId) async {
    try {
      final userDoc = await _firestore.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return {'success': false, 'error': 'User not found'};
      }

      final userData = userDoc.data()!;
      final verification = userData['verification'] as Map<String, dynamic>? ?? {};

      return {
        'success': true,
        'verification': verification,
        'isPhoneVerified': userData['isPhoneVerified'] ?? false,
        'isPhotoVerified': userData['isPhotoVerified'] ?? false,
        'isIDVerified': userData['isIDVerified'] ?? false,
      };
    } catch (e) {
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Get all verifications for a user
  Future<List<Map<String, dynamic>>> getUserVerifications(String userId) async {
    try {
      final snapshot = await _firestore
          .collection('verifications')
          .where('userId', isEqualTo: userId)
          .orderBy('submittedAt', descending: true)
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

  /// Check verification level (for trust badges)
  Future<int> getVerificationLevel(String userId) async {
    try {
      final userDoc = await _firestore.collection('users').doc(userId).get();
      if (!userDoc.exists) return 0;

      final data = userDoc.data()!;
      int level = 0;

      if (data['isPhoneVerified'] == true) level++;
      if (data['isPhotoVerified'] == true) level++;
      if (data['isIDVerified'] == true) level++;

      return level;
    } catch (e) {
      return 0;
    }
  }
}
