import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AccessibilitySettings } from '../models/AccessibilitySettings';

/**
 * AccessibilityService - Manages accessibility settings and disability profiles
 */
class AccessibilityService {
  constructor() {
    this.settingsCache = new Map();
  }

  /**
   * Update user's disability profile
   */
  async updateDisabilityProfile(userId, disabilityData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...disabilityData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating disability profile:', error);
      throw error;
    }
  }

  /**
   * Get user's disability profile
   */
  async getDisabilityProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        hasDisability: data.hasDisability || false,
        disabilityTypes: data.disabilityTypes || [],
        disabilityDescription: data.disabilityDescription || '',
        disabilityVisibility: data.disabilityVisibility || 'private',
        disabilityPreference: data.disabilityPreference || 'no_preference',
        accessibilityNeeds: data.accessibilityNeeds || {}
      };
    } catch (error) {
      console.error('Error getting disability profile:', error);
      throw error;
    }
  }

  /**
   * Update disability visibility setting
   */
  async updateDisabilityVisibility(userId, visibility) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        disabilityVisibility: visibility,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating disability visibility:', error);
      throw error;
    }
  }

  /**
   * Save or update accessibility settings
   */
  async saveAccessibilitySettings(userId, settings) {
    try {
      const settingsRef = doc(db, 'accessibility_settings', userId);
      const settingsObj = new AccessibilitySettings({ userId, ...settings });
      
      await setDoc(settingsRef, settingsObj.toFirestore(), { merge: true });
      
      // Update cache
      this.settingsCache.set(userId, settingsObj);
      
      // Apply settings to DOM immediately
      this.applyAccessibilitySettings(settingsObj);
      
      return { success: true, settings: settingsObj };
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
      throw error;
    }
  }

  /**
   * Get accessibility settings
   */
  async getAccessibilitySettings(userId) {
    try {
      // Check cache first
      if (this.settingsCache.has(userId)) {
        return this.settingsCache.get(userId);
      }

      const settingsRef = doc(db, 'accessibility_settings', userId);
      const settingsDoc = await getDoc(settingsRef);
      
      let settings;
      if (settingsDoc.exists()) {
        settings = AccessibilitySettings.fromFirestore(settingsDoc);
      } else {
        // Create default settings
        settings = AccessibilitySettings.getDefaults(userId);
        await setDoc(settingsRef, settings.toFirestore());
      }
      
      // Cache the settings
      this.settingsCache.set(userId, settings);
      
      return settings;
    } catch (error) {
      console.error('Error getting accessibility settings:', error);
      throw error;
    }
  }

  /**
   * Apply accessibility settings to the DOM
   */
  applyAccessibilitySettings(settings) {
    const root = document.documentElement;
    
    // Font size
    if (settings.fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (settings.fontSize === 'xlarge') {
      root.style.fontSize = '22px';
    } else {
      root.style.fontSize = '16px';
    }
    
    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Color blind mode
    root.setAttribute('data-colorblind-mode', settings.colorBlindMode);
    
    // Larger touch targets
    if (settings.largerTouchTargets) {
      root.classList.add('larger-touch-targets');
    } else {
      root.classList.remove('larger-touch-targets');
    }
  }

  /**
   * Get disability-confident users (for matching)
   */
  async getDisabilityConfidentUsers(filters = {}) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('disabilityPreference', 'in', ['open', 'prefer', 'only']),
        where('accountStatus', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        
        // Apply additional filters
        if (filters.age && (userData.age < filters.age.min || userData.age > filters.age.max)) {
          return;
        }
        if (filters.gender && userData.gender !== filters.gender) {
          return;
        }
        
        users.push({ id: doc.id, ...userData });
      });
      
      return users;
    } catch (error) {
      console.error('Error getting disability-confident users:', error);
      throw error;
    }
  }

  /**
   * Check disability compatibility between two users
   */
  async checkDisabilityCompatibility(userId, targetUserId) {
    try {
      const [userProfile, targetProfile] = await Promise.all([
        this.getDisabilityProfile(userId),
        this.getDisabilityProfile(targetUserId)
      ]);
      
      // If user has disability and target is not open, low compatibility
      if (userProfile.hasDisability && targetProfile.disabilityPreference === 'no_preference') {
        return { compatible: false, score: 0, reason: 'Target user has no disability preference set' };
      }
      
      // If user has disability and target is open/prefer/only, high compatibility
      if (userProfile.hasDisability && ['open', 'prefer', 'only'].includes(targetProfile.disabilityPreference)) {
        return { compatible: true, score: 15, reason: 'Target user is disability-confident' };
      }
      
      // If both have disabilities, very high compatibility
      if (userProfile.hasDisability && targetProfile.hasDisability) {
        return { compatible: true, score: 20, reason: 'Both users understand disability experience' };
      }
      
      // Default neutral
      return { compatible: true, score: 5, reason: 'Neutral compatibility' };
    } catch (error) {
      console.error('Error checking disability compatibility:', error);
      return { compatible: true, score: 5, reason: 'Error checking compatibility' };
    }
  }

  /**
   * Get inclusive dating resources
   */
  getInclusiveResources() {
    return {
      guidelines: [
        {
          title: 'Be Respectful',
          description: 'Treat everyone with dignity and respect, regardless of disability status.',
          icon: '🤝'
        },
        {
          title: 'Ask, Don\'t Assume',
          description: 'If curious about someone\'s disability, ask politely rather than making assumptions.',
          icon: '💬'
        },
        {
          title: 'Focus on the Person',
          description: 'Get to know the person, not just their disability. Everyone has unique interests and personality.',
          icon: '✨'
        },
        {
          title: 'Accessible Communication',
          description: 'Use clear language, be patient, and adapt your communication style to their preferences.',
          icon: '📱'
        },
        {
          title: 'Plan Accessible Dates',
          description: 'Consider accessibility when planning dates - check venue accessibility beforehand.',
          icon: '🗓️'
        },
        {
          title: 'It\'s Okay to Ask for Help',
          description: 'If you\'re unsure about something, it\'s fine to ask respectfully how you can help or accommodate.',
          icon: '🙋'
        }
      ],
      resources: [
        {
          title: 'Disability Etiquette Guide',
          description: 'Learn proper etiquette for interacting with people with disabilities',
          link: 'https://www.ada.gov/resources/disability-etiquette/'
        },
        {
          title: 'Accessible Date Ideas',
          description: 'Find accessible venues and activity ideas for dates',
          link: '#accessible-dates'
        },
        {
          title: 'Support Communities',
          description: 'Connect with disability advocacy and support groups',
          link: '#support'
        }
      ],
      commonMistakes: [
        'Talking to a companion instead of the person with a disability',
        'Using outdated or offensive terminology',
        'Making assumptions about what someone can or cannot do',
        'Treating adults like children',
        'Focusing only on the disability in conversation',
        'Being afraid to use common expressions like "see you later" or "let\'s walk"'
      ]
    };
  }

  /**
   * Track accessibility feature usage (for analytics)
   */
  async trackAccessibilityFeature(userId, feature) {
    try {
      // This would integrate with your analytics service
      console.log(`Accessibility feature used: ${feature} by user ${userId}`);
    } catch (error) {
      console.error('Error tracking accessibility feature:', error);
    }
  }
}

// Export singleton instance
export const accessibilityService = new AccessibilityService();
export default accessibilityService;
