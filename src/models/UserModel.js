/**
 * UserModel - Represents a user in Firestore
 * Provides serialization/deserialization methods
 */
export class UserModel {
  constructor(data = {}) {
    this.uid = data.uid || '';
    this.email = data.email || '';
    this.displayName = data.displayName || '';
    this.photoURL = data.photoURL || null;
    this.photos = data.photos || []; // Array of photo URLs
    this.bio = data.bio || '';
    this.age = data.age || null;
    this.gender = data.gender || '';
    this.location = data.location || '';
    this.interests = data.interests || [];
    
    // Verification and account status
    this.isVerifiedAccount = data.isVerifiedAccount || false;
    this.isVerified = data.isVerified || false; // Selfie verified
    this.profileSetupComplete = data.profileSetupComplete || false;
    
    // Subscription info
    this.hasActiveSubscription = data.hasActiveSubscription || false;
    this.subscriptionStatus = data.subscriptionStatus || 'inactive'; // 'active', 'inactive', 'cancelled', 'expired'
    this.subscriptionStartDate = data.subscriptionStartDate || null;
    this.subscriptionEndDate = data.subscriptionEndDate || null;
    this.stripeCustomerId = data.stripeCustomerId || null;
    this.subscriptionId = data.subscriptionId || null;
    
    // Block and report
    this.blockedUsers = data.blockedUsers || [];
    this.blockedByUsers = data.blockedByUsers || [];
    this.reportedBy = data.reportedBy || [];
    
    // Admin fields
    this.isAdmin = data.isAdmin || false;
    this.accountStatus = data.accountStatus || 'active'; // 'active', 'suspended', 'deleted'
    
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.lastActiveAt = data.lastActiveAt || new Date().toISOString();
  }

  /**
   * Convert to Firestore format
   */
  toFirestore() {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      photos: this.photos,
      bio: this.bio,
      age: this.age,
      gender: this.gender,
      location: this.location,
      interests: this.interests,
      isVerifiedAccount: this.isVerifiedAccount,
      isVerified: this.isVerified,
      profileSetupComplete: this.profileSetupComplete,
      hasActiveSubscription: this.hasActiveSubscription,
      subscriptionStatus: this.subscriptionStatus,
      subscriptionStartDate: this.subscriptionStartDate,
      subscriptionEndDate: this.subscriptionEndDate,
      stripeCustomerId: this.stripeCustomerId,
      subscriptionId: this.subscriptionId,
      blockedUsers: this.blockedUsers,
      blockedByUsers: this.blockedByUsers,
      reportedBy: this.reportedBy,
      isAdmin: this.isAdmin,
      accountStatus: this.accountStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastActiveAt: this.lastActiveAt,
    };
  }

  /**
   * Create UserModel from Firestore document
   */
  static fromFirestore(doc) {
    if (!doc.exists) return null;
    return new UserModel(doc.data());
  }

  /**
   * Create UserModel from Firebase Auth user
   */
  static fromAuthUser(user, displayName = '') {
    return new UserModel({
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL,
      isVerifiedAccount: user.emailVerified,
      profileSetupComplete: false,
    });
  }

  /**
   * Get public profile (for sharing with other users)
   */
  getPublicProfile() {
    return {
      uid: this.uid,
      displayName: this.displayName,
      photoURL: this.photoURL,
      photos: this.photos,
      bio: this.bio,
      age: this.age,
      gender: this.gender,
      location: this.location,
      interests: this.interests,
      isVerified: this.isVerified,
    };
  }

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription() {
    if (!this.subscriptionStatus === 'active') return false;
    if (this.subscriptionEndDate) {
      return new Date(this.subscriptionEndDate) > new Date();
    }
    return true;
  }

  /**
   * Check if user is blocked
   */
  isBlockedBy(userId) {
    return this.blockedByUsers.includes(userId);
  }

  /**
   * Check if user has blocked someone
   */
  hasBlocked(userId) {
    return this.blockedUsers.includes(userId);
  }

  /**
   * Update user information
   */
  update(data) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
    return this;
  }
}
