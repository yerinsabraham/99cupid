import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * VerificationService
 * Handles all verification-related operations including:
 * - Phone verification (SMS OTP)
 * - Photo verification (selfie + liveness)
 * - ID verification (government documents)
 */

class VerificationService {
  
  // Verification types
  static VERIFICATION_TYPES = {
    PHONE: 'phone',
    PHOTO: 'photo',
    ID: 'id'
  };

  // Verification statuses
  static VERIFICATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    EXPIRED: 'expired'
  };

  /**
   * Submit phone verification request
   * @param {string} userId - User ID
   * @param {string} phoneNumber - Phone number to verify
   * @param {string} otp - One-time password
   */
  static async submitPhoneVerification(userId, phoneNumber, otp) {
    try {
      const verificationRef = doc(collection(db, 'verifications'));
      const verificationData = {
        userId,
        verificationType: this.VERIFICATION_TYPES.PHONE,
        status: this.VERIFICATION_STATUS.PENDING,
        phoneNumber,
        otp, // In production, this should be hashed
        submittedAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)), // 6 months
        verifiedAt: null,
        rejectionReason: null
      };

      await setDoc(verificationRef, verificationData);

      // Update user profile with phone verification status
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'verification.phone': this.VERIFICATION_STATUS.PENDING,
        'verification.phoneNumber': phoneNumber,
        'verification.phoneVerifiedAt': null
      });

      return { success: true, verificationId: verificationRef.id };
    } catch (error) {
      console.error('Error submitting phone verification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify phone OTP
   * @param {string} userId - User ID
   * @param {string} phoneNumber - Phone number
   * @param {string} otp - OTP to verify
   */
  static async verifyPhoneOTP(userId, phoneNumber, otp) {
    try {
      // Find pending verification for this user and phone
      const verificationsRef = collection(db, 'verifications');
      const q = query(
        verificationsRef,
        where('userId', '==', userId),
        where('verificationType', '==', this.VERIFICATION_TYPES.PHONE),
        where('phoneNumber', '==', phoneNumber),
        where('status', '==', this.VERIFICATION_STATUS.PENDING),
        orderBy('submittedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return { success: false, error: 'No pending verification found' };
      }

      const verificationDoc = snapshot.docs[0];
      const verificationData = verificationDoc.data();

      // Check if OTP matches
      if (verificationData.otp !== otp) {
        return { success: false, error: 'Invalid OTP' };
      }

      // Check if OTP is expired (10 minutes)
      const submittedAt = verificationData.submittedAt.toDate();
      const now = new Date();
      const diffMinutes = (now - submittedAt) / (1000 * 60);
      
      if (diffMinutes > 10) {
        return { success: false, error: 'OTP expired' };
      }

      // Update verification status
      await updateDoc(doc(db, 'verifications', verificationDoc.id), {
        status: this.VERIFICATION_STATUS.APPROVED,
        verifiedAt: serverTimestamp()
      });

      // Update user profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'verification.phone': this.VERIFICATION_STATUS.APPROVED,
        'verification.phoneVerifiedAt': serverTimestamp(),
        isPhoneVerified: true
      });

      return { success: true };
    } catch (error) {
      console.error('Error verifying phone OTP:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit photo verification request
   * @param {string} userId - User ID
   * @param {string} selfieUrl - URL of selfie photo
   * @param {object} metadata - Additional metadata (pose, liveness score, etc.)
   */
  static async submitPhotoVerification(userId, selfieUrl, metadata = {}) {
    try {
      const verificationRef = doc(collection(db, 'verifications'));
      const verificationData = {
        userId,
        verificationType: this.VERIFICATION_TYPES.PHOTO,
        status: this.VERIFICATION_STATUS.PENDING,
        selfieUrl,
        metadata,
        submittedAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)), // 6 months
        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: null
      };

      await setDoc(verificationRef, verificationData);

      // Update user profile with photo verification status
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'verification.photo': this.VERIFICATION_STATUS.PENDING,
        'verification.photoSubmittedAt': serverTimestamp()
      });

      return { success: true, verificationId: verificationRef.id };
    } catch (error) {
      console.error('Error submitting photo verification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit ID verification request
   * @param {string} userId - User ID
   * @param {string} idType - Type of ID (passport, drivers_license, national_id)
   * @param {string} frontUrl - URL of front of ID
   * @param {string} backUrl - URL of back of ID (optional)
   * @param {object} extractedData - Data extracted from ID
   */
  static async submitIDVerification(userId, idType, frontUrl, backUrl = null, extractedData = {}) {
    try {
      const verificationRef = doc(collection(db, 'verifications'));
      const verificationData = {
        userId,
        verificationType: this.VERIFICATION_TYPES.ID,
        status: this.VERIFICATION_STATUS.PENDING,
        idType,
        frontUrl,
        backUrl,
        extractedData: {
          ...extractedData,
          // Add any OCR-extracted data here
        },
        submittedAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)), // 1 year
        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: null
      };

      await setDoc(verificationRef, verificationData);

      // Update user profile with ID verification status
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'verification.id': this.VERIFICATION_STATUS.PENDING,
        'verification.idSubmittedAt': serverTimestamp()
      });

      return { success: true, verificationId: verificationRef.id };
    } catch (error) {
      console.error('Error submitting ID verification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user verification status
   * @param {string} userId - User ID
   */
  static async getUserVerificationStatus(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return { success: false, error: 'User not found' };
      }

      const userData = userDoc.data();
      const verification = userData.verification || {};

      // Check if verifications are expired
      const now = new Date();
      const expiryMonths = { phone: 6, photo: 6, id: 12 };

      Object.keys(expiryMonths).forEach(type => {
        const verifiedAtField = `${type}VerifiedAt`;
        if (verification[verifiedAtField]) {
          const verifiedAt = verification[verifiedAtField].toDate();
          const monthsDiff = (now - verifiedAt) / (1000 * 60 * 60 * 24 * 30);
          
          if (monthsDiff > expiryMonths[type]) {
            verification[type] = this.VERIFICATION_STATUS.EXPIRED;
          }
        }
      });

      return {
        success: true,
        verification: {
          phone: verification.phone || 'not_started',
          photo: verification.photo || 'not_started',
          id: verification.id || 'not_started',
          isVerified: this.isUserVerified(verification),
          isPhoneVerified: userData.isPhoneVerified || false,
          isPhotoVerified: userData.isPhotoVerified || false,
          isIDVerified: userData.isIDVerified || false
        }
      };
    } catch (error) {
      console.error('Error getting verification status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user is fully verified
   * @param {object} verification - Verification object from user profile
   */
  static isUserVerified(verification) {
    return (
      verification.phone === this.VERIFICATION_STATUS.APPROVED &&
      verification.photo === this.VERIFICATION_STATUS.APPROVED
    );
  }

  /**
   * Get all verification submissions for a user
   * @param {string} userId - User ID
   * @param {string} verificationType - Optional: filter by type
   */
  static async getUserVerifications(userId, verificationType = null) {
    try {
      const verificationsRef = collection(db, 'verifications');
      let q = query(
        verificationsRef,
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );

      if (verificationType) {
        q = query(
          verificationsRef,
          where('userId', '==', userId),
          where('verificationType', '==', verificationType),
          orderBy('submittedAt', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const verifications = [];

      snapshot.forEach(doc => {
        verifications.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return { success: true, verifications };
    } catch (error) {
      console.error('Error getting user verifications:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Admin: Review and approve/reject verification
   * @param {string} verificationId - Verification ID
   * @param {string} adminId - Admin user ID
   * @param {boolean} approved - Approve or reject
   * @param {string} rejectionReason - Reason for rejection (if rejected)
   */
  static async reviewVerification(verificationId, adminId, approved, rejectionReason = null) {
    try {
      const verificationRef = doc(db, 'verifications', verificationId);
      const verificationDoc = await getDoc(verificationRef);

      if (!verificationDoc.exists()) {
        return { success: false, error: 'Verification not found' };
      }

      const verificationData = verificationDoc.data();
      const status = approved ? this.VERIFICATION_STATUS.APPROVED : this.VERIFICATION_STATUS.REJECTED;

      // Update verification document
      await updateDoc(verificationRef, {
        status,
        reviewedAt: serverTimestamp(),
        reviewedBy: adminId,
        rejectionReason: approved ? null : rejectionReason
      });

      // Update user profile
      const userRef = doc(db, 'users', verificationData.userId);
      const updateData = {
        [`verification.${verificationData.verificationType}`]: status
      };

      if (approved) {
        updateData[`verification.${verificationData.verificationType}VerifiedAt`] = serverTimestamp();
        updateData[`is${verificationData.verificationType.charAt(0).toUpperCase() + verificationData.verificationType.slice(1)}Verified`] = true;
      } else {
        updateData[`verification.${verificationData.verificationType}RejectionReason`] = rejectionReason;
      }

      await updateDoc(userRef, updateData);

      return { success: true };
    } catch (error) {
      console.error('Error reviewing verification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send OTP via SMS (mock implementation - integrate with SMS provider)
   * @param {string} phoneNumber - Phone number to send OTP to
   */
  static async sendOTP(phoneNumber) {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
      // For now, just return the OTP for testing
      console.log(`OTP for ${phoneNumber}: ${otp}`);

      return { success: true, otp }; // Remove this in production
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if verification badge should be displayed
   * @param {object} user - User object
   */
  static shouldShowVerificationBadge(user) {
    if (!user || !user.verification) return false;

    return (
      user.verification.photo === this.VERIFICATION_STATUS.APPROVED ||
      user.verification.id === this.VERIFICATION_STATUS.APPROVED
    );
  }

  /**
   * Get verification badge level
   * @param {object} user - User object
   * @returns {string} - 'basic', 'verified', 'premium'
   */
  static getVerificationLevel(user) {
    if (!user || !user.verification) return 'none';

    const { phone, photo, id } = user.verification;

    // Premium: All three verified
    if (
      phone === this.VERIFICATION_STATUS.APPROVED &&
      photo === this.VERIFICATION_STATUS.APPROVED &&
      id === this.VERIFICATION_STATUS.APPROVED
    ) {
      return 'premium';
    }

    // Verified: Phone + Photo
    if (
      phone === this.VERIFICATION_STATUS.APPROVED &&
      photo === this.VERIFICATION_STATUS.APPROVED
    ) {
      return 'verified';
    }

    // Basic: At least phone verified
    if (phone === this.VERIFICATION_STATUS.APPROVED) {
      return 'basic';
    }

    return 'none';
  }
}

export default VerificationService;
