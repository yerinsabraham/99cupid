import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * PaymentService - Handles subscription and payment processing
 * Supports: GCash, PayMaya, Credit/Debit Cards, PayPal
 */
class PaymentService {
  // Subscription tiers with Philippine Peso pricing
  static SUBSCRIPTION_TIERS = {
    free: {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'PHP',
      features: [
        'Limited daily likes (20)',
        'Basic matching',
        'Standard support'
      ],
      limits: {
        dailyLikes: 20,
        superLikes: 0,
        rewinds: 0,
        boosts: 0
      }
    },
    plus: {
      id: 'plus',
      name: '99 Plus',
      price: 299,
      currency: 'PHP',
      period: 'month',
      features: [
        'Unlimited likes',
        'See who liked you',
        '5 Super Likes per day',
        '1 Boost per month',
        'Rewind unlimited',
        'Ad-free experience',
        'Priority support'
      ],
      limits: {
        dailyLikes: -1, // unlimited
        superLikes: 5,
        rewinds: -1,
        boosts: 1
      }
    },
    premium: {
      id: 'premium',
      name: '99 Premium',
      price: 599,
      currency: 'PHP',
      period: 'month',
      features: [
        'All Plus features',
        'Unlimited Super Likes',
        '5 Boosts per month',
        'Advanced filters',
        'Top profile visibility',
        'Read receipts',
        'Priority matching',
        'VIP support'
      ],
      limits: {
        dailyLikes: -1,
        superLikes: -1,
        rewinds: -1,
        boosts: 5
      }
    }
  };

  // Payment methods available in Philippines
  static PAYMENT_METHODS = {
    gcash: {
      id: 'gcash',
      name: 'GCash',
      icon: '💳',
      available: true,
      type: 'e-wallet'
    },
    paymaya: {
      id: 'paymaya',
      name: 'PayMaya',
      icon: '💳',
      available: true,
      type: 'e-wallet'
    },
    card: {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      available: true,
      type: 'card'
    },
    paypal: {
      id: 'paypal',
      name: 'PayPal',
      icon: '💰',
      available: true,
      type: 'paypal'
    }
  };

  /**
   * Get user's current subscription
   */
  static async getUserSubscription(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return this.SUBSCRIPTION_TIERS.free;

      const userData = userDoc.data();
      const subscriptionType = userData.subscriptionTier || 'free';
      const expiresAt = userData.subscriptionExpiresAt;

      // Check if subscription is still active
      if (expiresAt) {
        const expiryDate = expiresAt.toDate ? expiresAt.toDate() : new Date(expiresAt);
        if (expiryDate < new Date()) {
          // Subscription expired, downgrade to free
          await this.downgradeToFree(userId);
          return this.SUBSCRIPTION_TIERS.free;
        }
      }

      return {
        ...this.SUBSCRIPTION_TIERS[subscriptionType],
        expiresAt,
        autoRenew: userData.autoRenew || false
      };
    } catch (error) {
      console.error('Error getting subscription:', error);
      return this.SUBSCRIPTION_TIERS.free;
    }
  }

  /**
   * Create a subscription
   */
  static async createSubscription(userId, tierId, paymentMethod, paymentDetails = {}) {
    try {
      const tier = this.SUBSCRIPTION_TIERS[tierId];
      if (!tier || tierId === 'free') {
        throw new Error('Invalid subscription tier');
      }

      // Calculate expiry date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Create transaction record
      const transactionId = `txn_${Date.now()}_${userId.slice(0, 8)}`;
      const transaction = {
        id: transactionId,
        userId,
        type: 'subscription',
        tierId,
        amount: tier.price,
        currency: tier.currency,
        paymentMethod,
        status: 'pending',
        createdAt: serverTimestamp(),
        ...paymentDetails
      };

      // Save transaction
      await setDoc(doc(db, 'transactions', transactionId), transaction);

      // For demo/MVP: Auto-approve the subscription
      // In production, wait for payment gateway webhook
      await this.approveSubscription(userId, tierId, transactionId, expiresAt);

      return {
        success: true,
        transactionId,
        expiresAt,
        message: 'Subscription activated successfully!'
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        message: error.message || 'Failed to create subscription'
      };
    }
  }

  /**
   * Approve and activate subscription
   */
  static async approveSubscription(userId, tierId, transactionId, expiresAt) {
    try {
      // Update user subscription
      await updateDoc(doc(db, 'users', userId), {
        subscriptionTier: tierId,
        subscriptionExpiresAt: expiresAt,
        autoRenew: true,
        subscriptionStartedAt: serverTimestamp(),
        isSubscribed: true
      });

      // Update transaction status
      await updateDoc(doc(db, 'transactions', transactionId), {
        status: 'completed',
        completedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error approving subscription:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        autoRenew: false,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Subscription will not renew at the end of the current period'
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return {
        success: false,
        message: error.message || 'Failed to cancel subscription'
      };
    }
  }

  /**
   * Downgrade to free tier
   */
  static async downgradeToFree(userId) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        subscriptionTier: 'free',
        subscriptionExpiresAt: null,
        autoRenew: false,
        isSubscribed: false,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error downgrading to free:', error);
      return { success: false };
    }
  }

  /**
   * Get user's transaction history
   */
  static async getTransactionHistory(userId) {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      const transactions = [];

      snapshot.forEach(doc => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort by date (newest first)
      transactions.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });

      return transactions;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  /**
   * Check if user can perform an action based on subscription limits
   */
  static async canPerformAction(userId, action) {
    try {
      const subscription = await this.getUserSubscription(userId);
      const limits = subscription.limits || this.SUBSCRIPTION_TIERS.free.limits;

      // Get user's usage today
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      const usage = userData.dailyUsage || {};

      // Reset usage if it's a new day
      const lastReset = usage.lastReset ? new Date(usage.lastReset) : new Date(0);
      const today = new Date();
      if (lastReset.toDateString() !== today.toDateString()) {
        // Reset daily counters
        usage.likes = 0;
        usage.superLikes = 0;
        usage.lastReset = today.toISOString();
        
        await updateDoc(doc(db, 'users', userId), {
          'dailyUsage': usage
        });
      }

      // Check limits
      switch (action) {
        case 'like':
          if (limits.dailyLikes === -1) return true; // unlimited
          return (usage.likes || 0) < limits.dailyLikes;

        case 'superLike':
          if (limits.superLikes === -1) return true; // unlimited
          return (usage.superLikes || 0) < limits.superLikes;

        case 'rewind':
          return limits.rewinds === -1; // only premium has unlimited

        case 'boost':
          // Check monthly boost usage
          return (usage.boostsThisMonth || 0) < (limits.boosts || 0);

        default:
          return true;
      }
    } catch (error) {
      console.error('Error checking action limit:', error);
      return false;
    }
  }

  /**
   * Increment action usage
   */
  static async incrementUsage(userId, action) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      const usage = userData.dailyUsage || {};

      switch (action) {
        case 'like':
          usage.likes = (usage.likes || 0) + 1;
          break;
        case 'superLike':
          usage.superLikes = (usage.superLikes || 0) + 1;
          break;
        case 'boost':
          usage.boostsThisMonth = (usage.boostsThisMonth || 0) + 1;
          break;
      }

      await updateDoc(doc(db, 'users', userId), {
        'dailyUsage': usage
      });

      return { success: true };
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return { success: false };
    }
  }

  /**
   * Process payment (Demo/MVP version)
   * In production, integrate with actual payment gateways
   */
  static async processPayment(paymentData) {
    try {
      const { userId, amount, currency, method, tierId } = paymentData;

      // Simulate payment processing
      console.log('Processing payment:', paymentData);

      // For demo: automatically succeed
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create subscription
      const result = await this.createSubscription(userId, tierId, method, {
        amount,
        currency
      });

      return result;
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        message: 'Payment processing failed'
      };
    }
  }

  /**
   * Get payment gateway URL (for external payment processors)
   */
  static getPaymentUrl(transactionId, method) {
    // In production, return actual payment gateway URLs
    const baseUrl = window.location.origin;
    
    switch (method) {
      case 'gcash':
        return `${baseUrl}/payment/gcash?txn=${transactionId}`;
      case 'paymaya':
        return `${baseUrl}/payment/paymaya?txn=${transactionId}`;
      case 'paypal':
        return `${baseUrl}/payment/paypal?txn=${transactionId}`;
      default:
        return `${baseUrl}/payment/card?txn=${transactionId}`;
    }
  }
}

export default PaymentService;
