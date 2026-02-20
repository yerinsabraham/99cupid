import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { accessibilityService } from '../../services/AccessibilityService';
import { 
  Settings, 
  Eye, 
  Type, 
  Contrast,
  Volume2,
  Hand,
  MessageSquare,
  ArrowLeft,
  Save,
  Check,
  Shield
} from 'lucide-react';

/**
 * AccessibilitySettingsPage - Full page for managing accessibility settings
 */
export default function AccessibilitySettingsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [currentUser]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await accessibilityService.getAccessibilitySettings(currentUser.uid);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await accessibilityService.saveAccessibilitySettings(currentUser.uid, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Accessibility Settings</h1>
              <p className="text-gray-600 mt-1">Customize your experience</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Display Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Display</h2>
            </div>

            {/* Font Size */}
            <div className="space-y-3 mb-6">
              <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <Type className="w-4 h-4" />
                <span>Font Size</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['normal', 'large', 'xlarge'].map(size => (
                  <button
                    key={size}
                    onClick={() => handleSettingChange('fontSize', size)}
                    className={`py-3 px-4 rounded-xl border-2 transition-all ${
                      settings.fontSize === size
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className={`font-medium ${
                      size === 'normal' ? 'text-sm' : size === 'large' ? 'text-base' : 'text-lg'
                    }`}>
                      {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'X-Large'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Contrast className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">High Contrast Mode</p>
                  <p className="text-sm text-gray-600">Increase text and button contrast</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.highContrast ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Reduce Motion</p>
                <p className="text-sm text-gray-600">Minimize animations and transitions</p>
              </div>
              <button
                onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.reducedMotion ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.reducedMotion ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Color Blind Mode */}
            <div className="pt-4 border-t border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Color Blind Mode
              </label>
              <select
                value={settings.colorBlindMode}
                onChange={(e) => handleSettingChange('colorBlindMode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="none">None</option>
                <option value="protanopia">Protanopia (Red-blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                <option value="tritanopia">Tritanopia (Blue-blind)</option>
              </select>
            </div>
          </div>

          {/* Interaction Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Hand className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Interaction</h2>
            </div>

            {/* Haptic Feedback */}
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-gray-800">Haptic Feedback</p>
                <p className="text-sm text-gray-600">Vibration for interactions</p>
              </div>
              <button
                onClick={() => handleSettingChange('hapticFeedback', !settings.hapticFeedback)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.hapticFeedback ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.hapticFeedback ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Larger Touch Targets */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Larger Touch Targets</p>
                <p className="text-sm text-gray-600">Bigger buttons and controls</p>
              </div>
              <button
                onClick={() => handleSettingChange('largerTouchTargets', !settings.largerTouchTargets)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.largerTouchTargets ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.largerTouchTargets ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Gesture Alternatives */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Use Taps Instead of Swipes</p>
                <p className="text-sm text-gray-600">Replace swipe gestures with tap buttons</p>
              </div>
              <button
                onClick={() => handleSettingChange('gestureAlternatives', !settings.gestureAlternatives)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.gestureAlternatives ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.gestureAlternatives ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Communication Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Communication</h2>
            </div>

            {/* Auto-enable Captions */}
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-gray-800">Auto-enable Captions</p>
                <p className="text-sm text-gray-600">For video calls</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoEnableCaptions', !settings.autoEnableCaptions)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.autoEnableCaptions ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.autoEnableCaptions ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Text-to-Speech */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Text-to-Speech</p>
                  <p className="text-sm text-gray-600">Read messages aloud</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('textToSpeechEnabled', !settings.textToSpeechEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.textToSpeechEnabled ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.textToSpeechEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Voice-to-Text */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-800">Voice-to-Text</p>
                <p className="text-sm text-gray-600">Dictate messages</p>
              </div>
              <button
                onClick={() => handleSettingChange('voiceToTextEnabled', !settings.voiceToTextEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.voiceToTextEnabled ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.voiceToTextEnabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Privacy & Visibility</h2>
            </div>

            {/* Show Badge on Profile */}
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-gray-800">Show Badge on Profile Cards</p>
                <p className="text-sm text-gray-600">Display your disability-confident or inclusive badge when others view your profile</p>
              </div>
              <button
                onClick={() => handleSettingChange('showBadgeOnProfile', !settings.showBadgeOnProfile)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.showBadgeOnProfile ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                  settings.showBadgeOnProfile ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-4">
              <p className="text-sm text-purple-800">
                <strong>Note:</strong> This controls whether your badge is visible on your profile cards during swiping. 
                You can always manage your disability information visibility in your full profile settings.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
