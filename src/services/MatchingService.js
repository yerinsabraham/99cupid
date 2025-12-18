import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * MatchingService - Handles intelligent profile matching and recommendations
 * Uses multi-factor scoring: location, interests, preferences, verification, activity
 */
class MatchingService {
  // Scoring weights (total = 1.0)
  static WEIGHTS = {
    location: 0.25,      // 25% - Geographic proximity
    interests: 0.20,     // 20% - Common interests
    preferences: 0.20,   // 20% - Gender, age, relationship goals
    verification: 0.15,  // 15% - Verification status
    activity: 0.10,      // 10% - User engagement level
    compatibility: 0.10  // 10% - Lifestyle compatibility
  };

  /**
   * Get personalized matches for a user
   * @param {string} userId - Current user's ID
   * @param {number} limitCount - Number of profiles to return
   * @returns {Promise<Array>} - Sorted array of matched profiles with scores
   */
  static async getMatches(userId, limitCount = 50) {
    try {
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) return [];

      // Get potential matches based on basic filters
      const potentialMatches = await this.getPotentialMatches(userProfile);

      // Score each profile
      const scoredMatches = potentialMatches.map(profile => ({
        ...profile,
        compatibilityScore: this.calculateCompatibilityScore(userProfile, profile),
        scoreBreakdown: this.getScoreBreakdown(userProfile, profile)
      }));

      // Sort by compatibility score (highest first)
      scoredMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      // Return top matches
      return scoredMatches.slice(0, limitCount);
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  }

  /**
   * Get user profile from Firestore
   */
  static async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Get potential matches based on basic preferences
   */
  static async getPotentialMatches(userProfile) {
    try {
      const usersRef = collection(db, 'users');
      let q = query(
        usersRef,
        where('profileSetupComplete', '==', true)
      );

      const snapshot = await getDocs(q);
      const profiles = [];

      snapshot.forEach(doc => {
        const profile = { id: doc.id, ...doc.data() };
        
        // Exclude self and already swiped profiles
        if (profile.id !== userProfile.id) {
          // Apply basic filters
          if (this.meetsBasicPreferences(userProfile, profile)) {
            profiles.push(profile);
          }
        }
      });

      return profiles;
    } catch (error) {
      console.error('Error getting potential matches:', error);
      return [];
    }
  }

  /**
   * Check if profile meets basic preferences
   */
  static meetsBasicPreferences(userProfile, candidateProfile) {
    // Gender preference
    if (userProfile.lookingFor && userProfile.lookingFor !== 'everyone') {
      if (userProfile.lookingFor === 'men' && candidateProfile.gender !== 'male') return false;
      if (userProfile.lookingFor === 'women' && candidateProfile.gender !== 'female') return false;
    }

    // Age preference
    const candidateAge = candidateProfile.age || this.calculateAge(candidateProfile.dateOfBirth);
    const minAge = userProfile.agePreferenceMin || 18;
    const maxAge = userProfile.agePreferenceMax || 99;
    
    if (candidateAge < minAge || candidateAge > maxAge) return false;

    return true;
  }

  /**
   * Calculate overall compatibility score (0-100)
   */
  static calculateCompatibilityScore(userProfile, candidateProfile) {
    const locationScore = this.calculateLocationScore(userProfile, candidateProfile);
    const interestsScore = this.calculateInterestsScore(userProfile, candidateProfile);
    const preferencesScore = this.calculatePreferencesScore(userProfile, candidateProfile);
    const verificationScore = this.calculateVerificationScore(candidateProfile);
    const activityScore = this.calculateActivityScore(candidateProfile);
    const compatibilityScore = this.calculateLifestyleCompatibility(userProfile, candidateProfile);

    const totalScore = 
      (locationScore * this.WEIGHTS.location) +
      (interestsScore * this.WEIGHTS.interests) +
      (preferencesScore * this.WEIGHTS.preferences) +
      (verificationScore * this.WEIGHTS.verification) +
      (activityScore * this.WEIGHTS.activity) +
      (compatibilityScore * this.WEIGHTS.compatibility);

    return Math.round(totalScore);
  }

  /**
   * Get detailed score breakdown
   */
  static getScoreBreakdown(userProfile, candidateProfile) {
    return {
      location: this.calculateLocationScore(userProfile, candidateProfile),
      interests: this.calculateInterestsScore(userProfile, candidateProfile),
      preferences: this.calculatePreferencesScore(userProfile, candidateProfile),
      verification: this.calculateVerificationScore(candidateProfile),
      activity: this.calculateActivityScore(candidateProfile),
      compatibility: this.calculateLifestyleCompatibility(userProfile, candidateProfile)
    };
  }

  /**
   * Calculate location-based score (0-100)
   */
  static calculateLocationScore(userProfile, candidateProfile) {
    // If no location data, return neutral score
    if (!userProfile.location || !candidateProfile.location) return 50;

    // Simple city/province matching for now
    const userLocation = userProfile.location.toLowerCase();
    const candidateLocation = candidateProfile.location.toLowerCase();

    // Exact match
    if (userLocation === candidateLocation) return 100;

    // Same city or province
    const userParts = userLocation.split(',').map(s => s.trim());
    const candidateParts = candidateLocation.split(',').map(s => s.trim());

    for (const userPart of userParts) {
      for (const candidatePart of candidateParts) {
        if (userPart === candidatePart) return 75;
      }
    }

    // Different location but within Philippines
    return 30;
  }

  /**
   * Calculate interests compatibility score (0-100)
   */
  static calculateInterestsScore(userProfile, candidateProfile) {
    const userInterests = userProfile.interests || [];
    const candidateInterests = candidateProfile.interests || [];

    if (userInterests.length === 0 || candidateInterests.length === 0) return 50;

    // Count common interests
    const commonInterests = userInterests.filter(interest => 
      candidateInterests.includes(interest)
    );

    // Calculate percentage of common interests
    const totalUniqueInterests = new Set([...userInterests, ...candidateInterests]).size;
    const score = (commonInterests.length / totalUniqueInterests) * 100;

    // Bonus for having many common interests
    const bonus = Math.min(commonInterests.length * 5, 20);

    return Math.min(Math.round(score + bonus), 100);
  }

  /**
   * Calculate preferences match score (0-100)
   */
  static calculatePreferencesScore(userProfile, candidateProfile) {
    let score = 50; // Base score

    // Relationship goals match
    if (userProfile.relationshipGoals && candidateProfile.relationshipGoals) {
      if (userProfile.relationshipGoals === candidateProfile.relationshipGoals) {
        score += 30;
      } else {
        // Partial match for compatible goals
        const compatiblePairs = [
          ['long-term', 'short-term'],
          ['short-term', 'figuring-out'],
          ['new-friends', 'figuring-out']
        ];
        
        const isCompatible = compatiblePairs.some(pair => 
          (pair[0] === userProfile.relationshipGoals && pair[1] === candidateProfile.relationshipGoals) ||
          (pair[1] === userProfile.relationshipGoals && pair[0] === candidateProfile.relationshipGoals)
        );
        
        if (isCompatible) score += 15;
      }
    }

    // Education level compatibility
    if (userProfile.education && candidateProfile.education) {
      const educationLevels = ['high school', 'college', 'bachelor', 'master', 'phd'];
      const userLevel = educationLevels.findIndex(level => 
        userProfile.education.toLowerCase().includes(level)
      );
      const candidateLevel = educationLevels.findIndex(level => 
        candidateProfile.education.toLowerCase().includes(level)
      );
      
      if (userLevel >= 0 && candidateLevel >= 0) {
        const difference = Math.abs(userLevel - candidateLevel);
        if (difference === 0) score += 10;
        else if (difference === 1) score += 5;
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Calculate verification score (0-100)
   */
  static calculateVerificationScore(candidateProfile) {
    let score = 30; // Base score for unverified

    if (candidateProfile.isVerified) {
      score = 70; // Verified users get high score

      // Bonus for verification level
      const level = candidateProfile.verificationLevel;
      if (level === 'premium') score = 100;
      else if (level === 'verified') score = 85;
    }

    return score;
  }

  /**
   * Calculate activity score based on user engagement (0-100)
   */
  static calculateActivityScore(candidateProfile) {
    // Check if user has been active recently
    const lastActive = candidateProfile.lastActive || candidateProfile.updatedAt;
    
    if (!lastActive) return 50;

    const lastActiveDate = lastActive.toDate ? lastActive.toDate() : new Date(lastActive);
    const daysSinceActive = (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);

    // Score based on recency
    if (daysSinceActive < 1) return 100;      // Active today
    if (daysSinceActive < 3) return 85;       // Active in last 3 days
    if (daysSinceActive < 7) return 70;       // Active in last week
    if (daysSinceActive < 14) return 50;      // Active in last 2 weeks
    if (daysSinceActive < 30) return 30;      // Active in last month
    
    return 10; // Inactive
  }

  /**
   * Calculate lifestyle compatibility (0-100)
   */
  static calculateLifestyleCompatibility(userProfile, candidateProfile) {
    let score = 50;
    let factors = 0;

    // Smoking compatibility
    if (userProfile.smoking && candidateProfile.smoking) {
      factors++;
      if (userProfile.smoking === candidateProfile.smoking) score += 15;
      else if (
        (userProfile.smoking === 'never' && candidateProfile.smoking === 'sometimes') ||
        (userProfile.smoking === 'sometimes' && candidateProfile.smoking === 'never')
      ) score += 5;
    }

    // Drinking compatibility
    if (userProfile.drinking && candidateProfile.drinking) {
      factors++;
      if (userProfile.drinking === candidateProfile.drinking) score += 15;
      else if (
        (userProfile.drinking === 'socially' && candidateProfile.drinking === 'sometimes') ||
        (userProfile.drinking === 'sometimes' && candidateProfile.drinking === 'socially')
      ) score += 8;
    }

    // Exercise compatibility
    if (userProfile.exercise && candidateProfile.exercise) {
      factors++;
      if (userProfile.exercise === candidateProfile.exercise) score += 15;
      else score += 5;
    }

    // If no lifestyle data, return neutral
    if (factors === 0) return 50;

    return Math.min(score, 100);
  }

  /**
   * Calculate age from date of birth
   */
  static calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Get "Top Picks" - highest compatibility matches
   */
  static async getTopPicks(userId, count = 10) {
    const matches = await this.getMatches(userId, 100);
    
    // Filter for high compatibility (>70%)
    const topMatches = matches.filter(match => match.compatibilityScore >= 70);
    
    return topMatches.slice(0, count);
  }

  /**
   * Get explanation for why two users match
   */
  static getMatchReasons(userProfile, candidateProfile, scoreBreakdown) {
    const reasons = [];

    // Location
    if (scoreBreakdown.location >= 75) {
      reasons.push(`You're both from ${candidateProfile.location || 'the same area'}`);
    }

    // Interests
    const commonInterests = (userProfile.interests || []).filter(interest =>
      (candidateProfile.interests || []).includes(interest)
    );
    if (commonInterests.length > 0) {
      reasons.push(`You both love ${commonInterests.slice(0, 3).join(', ')}`);
    }

    // Relationship goals
    if (userProfile.relationshipGoals === candidateProfile.relationshipGoals) {
      reasons.push('You have the same relationship goals');
    }

    // Verification
    if (candidateProfile.isVerified) {
      reasons.push('Verified profile');
    }

    // Education
    if (userProfile.education && candidateProfile.education) {
      reasons.push('Similar education background');
    }

    return reasons;
  }
}

export default MatchingService;
