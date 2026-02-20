import { useState } from 'react';
import { Heart, Eye, EyeOff, Users, Lock } from 'lucide-react';

const DISABILITY_TYPES = [
  { value: 'physical', label: '🦽 Physical Mobility', description: 'Wheelchair user, walker, crutches' },
  { value: 'visual', label: '👓 Visual', description: 'Blind, low vision, color blind' },
  { value: 'hearing', label: '👂 Hearing', description: 'Deaf, hard of hearing' },
  { value: 'chronic_illness', label: '💊 Chronic Illness', description: 'Diabetes, arthritis, autoimmune' },
  { value: 'mental_health', label: '🧠 Mental Health', description: 'Anxiety, depression, PTSD' },
  { value: 'neurodivergent', label: '🌈 Neurodivergent', description: 'Autism, ADHD, dyslexia' },
  { value: 'other', label: '✨ Other', description: 'Not listed above' },
  { value: 'prefer_not_to_specify', label: '🤐 Prefer not to specify', description: 'I\'d rather not say' }
];

const VISIBILITY_OPTIONS = [
  { value: 'public', icon: Eye, label: 'Public', description: 'Anyone can see' },
  { value: 'matches', icon: Users, label: 'Matches Only', description: 'Only people I match with' },
  { value: 'private', icon: Lock, label: 'Private', description: 'Hidden from everyone' }
];

const PREFERENCE_OPTIONS = [
  { value: 'no_preference', label: 'No Preference', description: 'Open to anyone' },
  { value: 'open', label: 'Disability Confident', description: 'Open to dating people with disabilities' },
  { value: 'prefer', label: 'Prefer', description: 'Prefer partners with disabilities' },
  { value: 'only', label: 'Only', description: 'Only interested in partners with disabilities' }
];

export default function DisabilityStep({ data, onUpdate, onNext, onBack }) {
  const [hasDisability, setHasDisability] = useState(data.hasDisability || false);
  const [disabilityTypes, setDisabilityTypes] = useState(data.disabilityTypes || []);
  const [disabilityDescription, setDisabilityDescription] = useState(data.disabilityDescription || '');
  const [disabilityVisibility, setDisabilityVisibility] = useState(data.disabilityVisibility || 'private');
  const [disabilityPreference, setDisabilityPreference] = useState(data.disabilityPreference || 'no_preference');

  const toggleDisabilityType = (type) => {
    if (disabilityTypes.includes(type)) {
      setDisabilityTypes(disabilityTypes.filter(t => t !== type));
    } else {
      setDisabilityTypes([...disabilityTypes, type]);
    }
  };

  const handleNext = () => {
    onUpdate({
      hasDisability,
      disabilityTypes,
      disabilityDescription,
      disabilityVisibility,
      disabilityPreference
    });
    onNext();
  };

  const handleSkip = () => {
    // Set default values for skipping
    onUpdate({
      hasDisability: false,
      disabilityTypes: [],
      disabilityDescription: '',
      disabilityVisibility: 'private',
      disabilityPreference: 'no_preference'
    });
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6 my-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Inclusive Dating</h2>
          <p className="text-gray-600">Help us create a more inclusive community</p>
          <p className="text-sm text-purple-600 italic">This step is optional and can be changed anytime</p>
        </div>

        {/* Information Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-800">
            <strong>Why we ask:</strong> We believe everyone deserves love. This helps us create a safe, inclusive space 
            and match you with understanding partners. Your privacy is our priority.
          </p>
        </div>

        {/* Do you have a disability? */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Do you identify as a person with a disability?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHasDisability(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                hasDisability
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                setHasDisability(false);
                setDisabilityTypes([]);
                setDisabilityDescription('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                !hasDisability
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* Disability Types (if yes) */}
        {hasDisability && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Select all that apply (optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2">
              {DISABILITY_TYPES.map((type) => {
                const isSelected = disabilityTypes.includes(type.value);
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleDisabilityType(type.value)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-purple-100' : 'text-gray-500'}`}>
                      {type.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Description (if yes) */}
        {hasDisability && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Share more about your needs (optional)
            </label>
            <textarea
              value={disabilityDescription}
              onChange={(e) => setDisabilityDescription(e.target.value)}
              rows="3"
              maxLength="500"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Any accessibility needs or preferences potential partners should know..."
            />
            <p className="text-xs text-gray-500 text-right">{disabilityDescription.length}/500</p>
          </div>
        )}

        {/* Visibility Settings */}
        {hasDisability && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Who can see this information?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {VISIBILITY_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = disabilityVisibility === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDisabilityVisibility(option.value)}
                    className={`p-4 rounded-xl flex items-start gap-3 text-left transition-all ${
                      isSelected
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className={`text-xs mt-1 ${isSelected ? 'text-purple-100' : 'text-gray-500'}`}>
                        {option.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Partner Preference */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Dating preference
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PREFERENCE_OPTIONS.map((option) => {
              const isSelected = disabilityPreference === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDisabilityPreference(option.value)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-purple-100' : 'text-gray-500'}`}>
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 py-3 px-4 border-2 border-purple-300 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
