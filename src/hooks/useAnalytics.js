import AnalyticsService from '../services/AnalyticsService';

/**
 * Analytics Hook - Provides easy-to-use analytics tracking methods
 * Import this in components to track user actions
 */

// Track page view
export const trackPageView = (pageName) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackPageView(pageName, currentUser.uid);
  }
};

// Track swipe action
export const trackSwipe = (targetUserId, direction, compatibilityScore = null) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackSwipe(currentUser.uid, targetUserId, direction, compatibilityScore);
  }
};

// Track match
export const trackMatch = (matchedUserId, compatibilityScore = null) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackMatch(currentUser.uid, matchedUserId, compatibilityScore);
  }
};

// Track message sent
export const trackMessage = (recipientId, messageLength) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackMessage(currentUser.uid, recipientId, messageLength);
  }
};

// Track profile view
export const trackProfileView = (viewedUserId, fullProfile = false) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    const eventType = fullProfile 
      ? AnalyticsService.EVENT_TYPES.FULL_PROFILE_OPENED 
      : AnalyticsService.EVENT_TYPES.PROFILE_VIEWED;
    AnalyticsService.trackEvent(eventType, currentUser.uid, { viewedUserId });
  }
};

// Track subscription actions
export const trackSubscriptionPageView = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackEvent(AnalyticsService.EVENT_TYPES.SUBSCRIPTION_PAGE_VIEWED, currentUser.uid);
  }
};

export const trackSubscriptionComplete = (tier, amount, method) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackSubscription(currentUser.uid, tier, amount, method);
  }
};

// Track verification
export const trackVerificationStart = (type) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackEvent(AnalyticsService.EVENT_TYPES.VERIFICATION_STARTED, currentUser.uid, { type });
  }
};

export const trackVerificationComplete = (type) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackEvent(AnalyticsService.EVENT_TYPES.VERIFICATION_COMPLETED, currentUser.uid, { type });
  }
};

// Track errors
export const trackError = (errorMessage, context = {}) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  AnalyticsService.trackError(errorMessage, '', currentUser?.uid, context);
};

// Track session
export const trackSessionStart = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackSessionStart(currentUser.uid);
  }
};

export const trackSessionEnd = (duration) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackSessionEnd(currentUser.uid, duration);
  }
};

// Track user signup/login
export const trackSignup = (method = 'email') => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackSignup(currentUser.uid, method);
  }
};

export const trackLogin = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackEvent(AnalyticsService.EVENT_TYPES.USER_LOGIN, currentUser.uid);
  }
};

export const trackProfileComplete = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    AnalyticsService.trackEvent(AnalyticsService.EVENT_TYPES.PROFILE_COMPLETED, currentUser.uid);
  }
};
