import { collection, addDoc, query, where, getDocs, orderBy, limit, serverTimestamp, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * AnalyticsService - Tracks user behavior, app performance, and business metrics
 * Provides insights for product decisions and growth tracking
 */
class AnalyticsService {
  // Event types
  static EVENT_TYPES = {
    // User Actions
    USER_SIGNUP: 'user_signup',
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    PROFILE_COMPLETED: 'profile_completed',
    PROFILE_UPDATED: 'profile_updated',
    
    // Swipe Actions
    SWIPE_RIGHT: 'swipe_right',
    SWIPE_LEFT: 'swipe_left',
    SUPER_LIKE: 'super_like',
    
    // Match Events
    MATCH_CREATED: 'match_created',
    MATCH_VIEWED: 'match_viewed',
    
    // Messaging
    MESSAGE_SENT: 'message_sent',
    MESSAGE_RECEIVED: 'message_received',
    CHAT_OPENED: 'chat_opened',
    
    // Verification
    VERIFICATION_STARTED: 'verification_started',
    VERIFICATION_COMPLETED: 'verification_completed',
    VERIFICATION_APPROVED: 'verification_approved',
    
    // Subscriptions
    SUBSCRIPTION_PAGE_VIEWED: 'subscription_page_viewed',
    SUBSCRIPTION_STARTED: 'subscription_started',
    SUBSCRIPTION_COMPLETED: 'subscription_completed',
    SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
    
    // Profile Views
    PROFILE_VIEWED: 'profile_viewed',
    FULL_PROFILE_OPENED: 'full_profile_opened',
    
    // Features
    BOOST_USED: 'boost_used',
    REWIND_USED: 'rewind_used',
    FILTER_APPLIED: 'filter_applied',
    
    // Errors
    ERROR_OCCURRED: 'error_occurred',
    PAGE_LOAD_ERROR: 'page_load_error',
    
    // Engagement
    SESSION_START: 'session_start',
    SESSION_END: 'session_end',
    PAGE_VIEW: 'page_view',
  };

  /**
   * Track an event
   * @param {string} eventType - Type of event from EVENT_TYPES
   * @param {string} userId - User ID (optional for anonymous events)
   * @param {object} metadata - Additional event data
   */
  static async trackEvent(eventType, userId = null, metadata = {}) {
    try {
      const event = {
        eventType,
        userId: userId || 'anonymous',
        metadata,
        timestamp: serverTimestamp(),
        sessionId: this.getSessionId(),
        platform: this.getPlatform(),
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      };

      // Save to Firestore
      await addDoc(collection(db, 'analytics_events'), event);

      // Update daily aggregates
      await this.updateDailyAggregates(eventType, userId);

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', eventType, metadata);
      }

      return { success: true };
    } catch (error) {
      console.error('Error tracking event:', error);
      return { success: false, error };
    }
  }

  /**
   * Update daily aggregated metrics
   */
  static async updateDailyAggregates(eventType, userId) {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const aggregateDocId = `daily_${today}`;
      const aggregateRef = doc(db, 'analytics_aggregates', aggregateDocId);

      // Increment event counter
      const updates = {
        date: today,
        [`events.${eventType}`]: increment(1),
        lastUpdated: serverTimestamp()
      };

      // Track unique users
      if (userId && userId !== 'anonymous') {
        updates[`uniqueUsers.${userId}`] = true;
      }

      await setDoc(aggregateRef, updates, { merge: true });
    } catch (error) {
      console.error('Error updating aggregates:', error);
    }
  }

  /**
   * Track page view
   */
  static trackPageView(pageName, userId = null) {
    return this.trackEvent(this.EVENT_TYPES.PAGE_VIEW, userId, { 
      pageName,
      url: window.location.href,
      referrer: document.referrer
    });
  }

  /**
   * Track user signup
   */
  static trackSignup(userId, method = 'email') {
    return this.trackEvent(this.EVENT_TYPES.USER_SIGNUP, userId, { method });
  }

  /**
   * Track swipe action
   */
  static trackSwipe(userId, targetUserId, direction, compatibilityScore = null) {
    const eventType = direction === 'right' ? this.EVENT_TYPES.SWIPE_RIGHT : this.EVENT_TYPES.SWIPE_LEFT;
    return this.trackEvent(eventType, userId, { 
      targetUserId, 
      direction,
      compatibilityScore
    });
  }

  /**
   * Track match creation
   */
  static trackMatch(userId, matchedUserId, compatibilityScore = null) {
    return this.trackEvent(this.EVENT_TYPES.MATCH_CREATED, userId, { 
      matchedUserId,
      compatibilityScore
    });
  }

  /**
   * Track message sent
   */
  static trackMessage(userId, recipientId, messageLength) {
    return this.trackEvent(this.EVENT_TYPES.MESSAGE_SENT, userId, { 
      recipientId,
      messageLength
    });
  }

  /**
   * Track subscription conversion
   */
  static trackSubscription(userId, tier, amount, method) {
    return this.trackEvent(this.EVENT_TYPES.SUBSCRIPTION_COMPLETED, userId, { 
      tier,
      amount,
      method,
      currency: 'PHP'
    });
  }

  /**
   * Track errors
   */
  static trackError(errorMessage, errorStack, userId = null, context = {}) {
    return this.trackEvent(this.EVENT_TYPES.ERROR_OCCURRED, userId, {
      errorMessage,
      errorStack,
      ...context
    });
  }

  /**
   * Get analytics dashboard data
   */
  static async getDashboardData(startDate = null, endDate = null) {
    try {
      const end = endDate || new Date();
      const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

      // Get daily aggregates
      const aggregatesQuery = query(
        collection(db, 'analytics_aggregates'),
        where('date', '>=', start.toISOString().split('T')[0]),
        where('date', '<=', end.toISOString().split('T')[0]),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(aggregatesQuery);
      const dailyData = [];

      snapshot.forEach(doc => {
        dailyData.push({
          date: doc.id.replace('daily_', ''),
          ...doc.data()
        });
      });

      // Calculate totals
      const totals = this.calculateTotals(dailyData);

      return {
        dailyData,
        totals,
        dateRange: {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        }
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return null;
    }
  }

  /**
   * Calculate total metrics from daily data
   */
  static calculateTotals(dailyData) {
    const totals = {
      totalUsers: 0,
      totalSignups: 0,
      totalSwipes: 0,
      totalMatches: 0,
      totalMessages: 0,
      totalSubscriptions: 0,
      conversionRate: 0,
      engagementRate: 0
    };

    const uniqueUsers = new Set();

    dailyData.forEach(day => {
      const events = day.events || {};
      
      totals.totalSignups += events[this.EVENT_TYPES.USER_SIGNUP] || 0;
      totals.totalSwipes += (events[this.EVENT_TYPES.SWIPE_RIGHT] || 0) + (events[this.EVENT_TYPES.SWIPE_LEFT] || 0);
      totals.totalMatches += events[this.EVENT_TYPES.MATCH_CREATED] || 0;
      totals.totalMessages += events[this.EVENT_TYPES.MESSAGE_SENT] || 0;
      totals.totalSubscriptions += events[this.EVENT_TYPES.SUBSCRIPTION_COMPLETED] || 0;

      // Count unique users
      const dayUsers = day.uniqueUsers || {};
      Object.keys(dayUsers).forEach(userId => uniqueUsers.add(userId));
    });

    totals.totalUsers = uniqueUsers.size;

    // Calculate conversion rate (subscriptions / signups)
    if (totals.totalSignups > 0) {
      totals.conversionRate = ((totals.totalSubscriptions / totals.totalSignups) * 100).toFixed(2);
    }

    // Calculate engagement rate (users with activity / total users)
    if (totals.totalUsers > 0) {
      totals.engagementRate = ((totals.totalSwipes > 0 ? uniqueUsers.size : 0) / totals.totalUsers * 100).toFixed(2);
    }

    return totals;
  }

  /**
   * Get user journey analytics
   */
  static async getUserJourney(userId) {
    try {
      const q = query(
        collection(db, 'analytics_events'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      const events = [];

      snapshot.forEach(doc => {
        events.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return events;
    } catch (error) {
      console.error('Error getting user journey:', error);
      return [];
    }
  }

  /**
   * Get funnel metrics (signup -> profile -> swipe -> match -> message)
   */
  static async getFunnelMetrics(startDate, endDate) {
    try {
      const dashboardData = await this.getDashboardData(startDate, endDate);
      if (!dashboardData) return null;

      const { dailyData } = dashboardData;
      
      let signups = 0;
      let profilesCompleted = 0;
      let usersWhoSwiped = 0;
      let usersWhoMatched = 0;
      let usersWhoMessaged = 0;

      dailyData.forEach(day => {
        const events = day.events || {};
        signups += events[this.EVENT_TYPES.USER_SIGNUP] || 0;
        profilesCompleted += events[this.EVENT_TYPES.PROFILE_COMPLETED] || 0;
        usersWhoSwiped += Math.min(
          events[this.EVENT_TYPES.SWIPE_RIGHT] || 0,
          events[this.EVENT_TYPES.SWIPE_LEFT] || 0
        );
        usersWhoMatched += events[this.EVENT_TYPES.MATCH_CREATED] || 0;
        usersWhoMessaged += events[this.EVENT_TYPES.MESSAGE_SENT] || 0;
      });

      return {
        signups,
        profilesCompleted,
        usersWhoSwiped,
        usersWhoMatched,
        usersWhoMessaged,
        dropoff: {
          signupToProfile: signups > 0 ? ((1 - profilesCompleted / signups) * 100).toFixed(2) : 0,
          profileToSwipe: profilesCompleted > 0 ? ((1 - usersWhoSwiped / profilesCompleted) * 100).toFixed(2) : 0,
          swipeToMatch: usersWhoSwiped > 0 ? ((1 - usersWhoMatched / usersWhoSwiped) * 100).toFixed(2) : 0,
          matchToMessage: usersWhoMatched > 0 ? ((1 - usersWhoMessaged / usersWhoMatched) * 100).toFixed(2) : 0,
        }
      };
    } catch (error) {
      console.error('Error getting funnel metrics:', error);
      return null;
    }
  }

  /**
   * Get session ID (persists for browser session)
   */
  static getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    
    return sessionId;
  }

  /**
   * Get platform info
   */
  static getPlatform() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'mobile';
    if (/tablet/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  /**
   * Track session start
   */
  static trackSessionStart(userId) {
    this.trackEvent(this.EVENT_TYPES.SESSION_START, userId, {
      startTime: new Date().toISOString()
    });
  }

  /**
   * Track session end
   */
  static trackSessionEnd(userId, duration) {
    this.trackEvent(this.EVENT_TYPES.SESSION_END, userId, {
      endTime: new Date().toISOString(),
      duration: Math.round(duration / 1000) // seconds
    });
  }

  /**
   * Get real-time metrics (last 24 hours)
   */
  static async getRealTimeMetrics() {
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const today = new Date().toISOString().split('T')[0];
      
      const aggregateDoc = await getDoc(doc(db, 'analytics_aggregates', `daily_${today}`));
      
      if (!aggregateDoc.exists()) {
        return {
          activeUsers: 0,
          totalSwipes: 0,
          totalMatches: 0,
          totalMessages: 0
        };
      }

      const data = aggregateDoc.data();
      const events = data.events || {};
      const uniqueUsers = Object.keys(data.uniqueUsers || {}).length;

      return {
        activeUsers: uniqueUsers,
        totalSwipes: (events[this.EVENT_TYPES.SWIPE_RIGHT] || 0) + (events[this.EVENT_TYPES.SWIPE_LEFT] || 0),
        totalMatches: events[this.EVENT_TYPES.MATCH_CREATED] || 0,
        totalMessages: events[this.EVENT_TYPES.MESSAGE_SENT] || 0,
        newSignups: events[this.EVENT_TYPES.USER_SIGNUP] || 0
      };
    } catch (error) {
      console.error('Error getting real-time metrics:', error);
      return null;
    }
  }
}

export default AnalyticsService;
