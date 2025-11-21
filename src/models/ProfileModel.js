/**
 * Profile Model
 * Detailed user profile information
 */
export class ProfileModel {
  constructor(data = {}) {
    this.userId = data.userId || '';
    this.displayName = data.displayName || '';
    this.age = data.age || null;
    this.gender = data.gender || '';
    this.lookingFor = data.lookingFor || 'everyone'; // 'male', 'female', 'everyone'
    this.location = data.location || '';
    this.bio = data.bio || '';
    this.interests = data.interests || [];
    this.photos = data.photos || []; // Array of Firebase Storage URLs
    this.dateOfBirth = data.dateOfBirth || '';
    this.height = data.height || null;
    this.education = data.education || '';
    this.occupation = data.occupation || '';
    this.isVerified = data.isVerified || false;
    this.verificationStatus = data.verificationStatus || 'none'; // 'none', 'pending', 'approved', 'rejected'
    this.profileSetupComplete = data.profileSetupComplete || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Convert to Firestore document format
   */
  toFirestore() {
    return {
      userId: this.userId,
      displayName: this.displayName,
      age: this.age,
      gender: this.gender,
      lookingFor: this.lookingFor,
      location: this.location,
      bio: this.bio,
      interests: this.interests,
      photos: this.photos,
      dateOfBirth: this.dateOfBirth,
      height: this.height,
      education: this.education,
      occupation: this.occupation,
      isVerified: this.isVerified,
      verificationStatus: this.verificationStatus,
      profileSetupComplete: this.profileSetupComplete,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Create from Firestore document
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new ProfileModel({
      ...data,
      userId: doc.id,
    });
  }
}
