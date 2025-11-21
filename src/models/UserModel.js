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
    this.bio = data.bio || '';
    this.isVerifiedAccount = data.isVerifiedAccount || false;
    this.profileSetupComplete = data.profileSetupComplete || false;
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
      bio: this.bio,
      isVerifiedAccount: this.isVerifiedAccount,
      profileSetupComplete: this.profileSetupComplete,
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
      bio: this.bio,
      isVerifiedAccount: this.isVerifiedAccount,
    };
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
