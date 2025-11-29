import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * SubscriptionService - Handles subscription status and access control
 */
export const SubscriptionService = {
  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return false;

      const userData = userDoc.data();
      if (userData.subscriptionStatus !== 'active') return false;

      // Check expiration date if it exists
      if (userData.subscriptionEndDate) {
        const endDate = new Date(userData.subscriptionEndDate);
        return endDate > new Date();
      }

      return true;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  },

  /**
   * Check if user can message (has subscription)
   */
  async canUserMessage(userId) {
    return await this.hasActiveSubscription(userId);
  },

  /**
   * Update subscription status
   */
  async updateSubscriptionStatus(userId, status, subscriptionData = {}) {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData = {
        subscriptionStatus: status,
        hasActiveSubscription: status === 'active',
        ...subscriptionData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Create or update Stripe subscription
   */
  async createStripeSubscription(userId, stripeData) {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData = {
        stripeCustomerId: stripeData.customerId,
        subscriptionId: stripeData.subscriptionId,
        subscriptionStatus: 'active',
        hasActiveSubscription: true,
        subscriptionStartDate: new Date().toISOString(),
        subscriptionEndDate: stripeData.renewalDate || null,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);
      return { success: true };
    } catch (error) {
      console.error('Error creating stripe subscription:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        subscriptionStatus: 'cancelled',
        hasActiveSubscription: false,
        subscriptionEndDate: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get subscription info for a user
   */
  async getSubscriptionInfo(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return null;

      const data = userDoc.data();
      return {
        status: data.subscriptionStatus || 'inactive',
        isActive: data.hasActiveSubscription || false,
        startDate: data.subscriptionStartDate,
        endDate: data.subscriptionEndDate,
        stripeCustomerId: data.stripeCustomerId,
        subscriptionId: data.subscriptionId,
      };
    } catch (error) {
      console.error('Error getting subscription info:', error);
      return null;
    }
  },
};

export default SubscriptionService;
