/**
 * AccessibilitySettings - User's accessibility preferences
 * Stored separately for privacy and quick access
 */
export class AccessibilitySettings {
  constructor(data = {}) {
    this.userId = data.userId || '';
    
    // Display Settings
    this.fontSize = data.fontSize || 'normal'; // 'normal' | 'large' | 'xlarge'
    this.highContrast = data.highContrast || false;
    this.reducedMotion = data.reducedMotion || false;
    this.colorBlindMode = data.colorBlindMode || 'none'; // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
    
    // Interaction Settings
    this.hapticFeedback = data.hapticFeedback !== undefined ? data.hapticFeedback : true;
    this.voiceCommands = data.voiceCommands || false;
    this.largerTouchTargets = data.largerTouchTargets || false;
    this.gestureAlternatives = data.gestureAlternatives || false; // Use taps instead of swipes
    
    // Communication Settings
    this.autoEnableCaptions = data.autoEnableCaptions || false;
    this.textToSpeechEnabled = data.textToSpeechEnabled || false;
    this.voiceToTextEnabled = data.voiceToTextEnabled || false;
    
    // Privacy Settings
    this.showBadgeOnProfile = data.showBadgeOnProfile !== undefined ? data.showBadgeOnProfile : true; // Show disability badge on profile cards
    
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Convert to Firestore format
   */
  toFirestore() {
    return {
      userId: this.userId,
      fontSize: this.fontSize,
      highContrast: this.highContrast,
      reducedMotion: this.reducedMotion,
      colorBlindMode: this.colorBlindMode,
      hapticFeedback: this.hapticFeedback,
      voiceCommands: this.voiceCommands,
      largerTouchTargets: this.largerTouchTargets,
      gestureAlternatives: this.gestureAlternatives,
      autoEnableCaptions: this.autoEnableCaptions,
      textToSpeechEnabled: this.textToSpeechEnabled,
      voiceToTextEnabled: this.voiceToTextEnabled,
      showBadgeOnProfile: this.showBadgeOnProfile,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Create from Firestore document
   */
  static fromFirestore(doc) {
    if (!doc.exists) return null;
    return new AccessibilitySettings(doc.data());
  }

  /**
   * Update settings
   */
  update(data) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Get default settings
   */
  static getDefaults(userId) {
    return new AccessibilitySettings({ userId });
  }
}
