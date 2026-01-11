import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import '../../core/constants/firebase_collections.dart';
import '../models/user_model.dart';

/// MatchingService - Intelligent profile matching
/// Simplified version of web app MatchingService.js
class MatchingService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Get personalized matches for a user
  Future<List<UserModel>> getMatches(
    String userId, {
    int limit = 50,
    Map<String, dynamic>? filters,
  }) async {
    try {
      // Get current user profile
      final userDoc = await _firestore
          .collection(FirebaseCollections.users)
          .doc(userId)
          .get();
      
      if (!userDoc.exists) return [];
      
      final currentUser = UserModel.fromFirestore(userDoc);

      // Get all users with complete profiles
      var query = _firestore
          .collection(FirebaseCollections.users)
          .where('profileSetupComplete', isEqualTo: true);

      final snapshot = await query.get();
      final profiles = <UserModel>[];

      for (final doc in snapshot.docs) {
        final profile = UserModel.fromFirestore(doc);
        
        // Exclude self
        if (profile.uid == userId) continue;
        
        // Apply basic filters
        if (filters != null) {
          if (!_meetsFilters(profile, filters)) continue;
        }
        
        profiles.add(profile);
      }

      // Calculate compatibility scores
      final scored = profiles.map((profile) {
        return MapEntry(
          profile,
          _calculateCompatibility(currentUser, profile),
        );
      }).toList();

      // Sort by score
      scored.sort((a, b) => b.value.compareTo(a.value));

      return scored.take(limit).map((e) => e.key).toList();
    } catch (e) {
      if (kDebugMode) {
        print('❌ Error getting matches: $e');
      }
      return [];
    }
  }

  /// Calculate compatibility score (0-100)
  double _calculateCompatibility(UserModel user1, UserModel user2) {
    double score = 0;

    // Common interests (40%)
    final commonInterests = user1.interests
        .where((i) => user2.interests.contains(i))
        .length;
    if (user1.interests.isNotEmpty) {
      score += (commonInterests / user1.interests.length) * 40;
    }

    // Age compatibility (20%)
    if (user1.age != null && user2.age != null) {
      final ageDiff = (user1.age! - user2.age!).abs();
      if (ageDiff <= 5) {
        score += 20;
      } else if (ageDiff <= 10) {
        score += 10;
      }
    }

    // Profile completeness (20%)
    if (user2.photos.length >= 3) score += 10;
    if (user2.bio.isNotEmpty) score += 10;

    // Verification (20%)
    if (user2.isVerified) score += 20;

    return score;
  }

  /// Check if profile meets user filters
  bool _meetsFilters(UserModel profile, Map<String, dynamic> filters) {
    // Age filter
    if (filters['ageMin'] != null && profile.age != null) {
      if (profile.age! < filters['ageMin']) return false;
    }
    if (filters['ageMax'] != null && profile.age != null) {
      if (profile.age! > filters['ageMax']) return false;
    }

    // Gender filter
    if (filters['gender'] != null && 
        filters['gender'] != 'everyone' && 
        filters['gender'] != profile.gender) {
      return false;
    }

    return true;
  }
}
