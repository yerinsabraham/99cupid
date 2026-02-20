import React, { useState } from 'react';
import { User, Heart, Info, Eye, EyeOff } from 'lucide-react';

/**
 * DisabilityProfileSection - Component for setting up disability information
 * Used in profile setup/edit pages
 */
export default function DisabilityProfileSection({ value = {}, onUpdate }) {
  const [hasDisability, setHasDisability] = useState(value.hasDisability || false);
  const [disabilityTypes, setDisabilityTypes] = useState(value.disabilityTypes || []);
  const [disabilityDescription, setDisabilityDescription] = useState(value.disabilityDescription || '');
  const [disabilityVisibility, setDisabilityVisibility] = useState(value.disabilityVisibility || 'private');
  const [disabilityPreference, setDisabilityPreference] = useState(value.disabilityPreference || 'no_preference');
  const [showSection, setShowSection] = useState(true); // Default to expanded so users can see it

  const disabilityOptions = [
    { value: 'physical', label: 'Physical disability' },
    { value: 'mobility', label: 'Mobility impairment' },
    { value: 'visual', label: 'Visual impairment' },
    { value: 'hearing', label: 'Hearing impairment' },
    { value: 'chronic_illness', label: 'Chronic illness' },
    { value: 'mental_health', label: 'Mental health condition' },
    { value: 'neurodivergent', label: 'Neurodivergent (ADHD, Autism, etc.)' },
    { value: 'prefer_not_specify', label: 'Prefer not to specify' }
  ];

  const handleTypeToggle = (type) => {
    setDisabilityTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSave = () => {
    const data = {
      hasDisability,
      disabilityTypes,
      disabilityDescription,
      disabilityVisibility,
      disabilityPreference
    };
    onUpdate(data);
  };

  React.useEffect(() => {
    handleSave();
  }, [hasDisability, disabilityTypes, disabilityDescription, disabilityVisibility, disabilityPreference]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Inclusive Dating</h3>
            <p className="text-sm text-gray-600">Optional - Share only if comfortable</p>
          </div>
        </div>
        <button
          onClick={() => setShowSection(!showSection)}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          {showSection ? 'Hide' : 'Show'} Section
        </button>
      </div>

      {showSection && (
        <>
          {/* Info Banner */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start space-x-3">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-purple-900">
              <p className="font-medium mb-1">Your privacy matters</p>
              <p className="text-purple-700">
                All information here is completely optional. You control who sees it and when.
              </p>
            </div>
          </div>

          {/* Do you have a disability? */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Do you have a disability? (Optional)
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setHasDisability(true)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  hasDisability
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">Yes</span>
              </button>
              <button
                onClick={() => setHasDisability(false)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  !hasDisability
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="font-medium">No</span>
              </button>
            </div>
          </div>

          {/* If yes, show disability types */}
          {hasDisability && (
            <>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Select all that apply:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {disabilityOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleTypeToggle(option.value)}
                      className={`py-3 px-4 rounded-xl border-2 text-left transition-all ${
                        disabilityTypes.includes(option.value)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{option.label}</span>
                        {disabilityTypes.includes(option.value) && (
                          <span className="text-purple-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Tell us more (Optional - 500 characters max)
                </label>
                <textarea
                  value={disabilityDescription}
                  onChange={(e) => setDisabilityDescription(e.target.value.slice(0, 500))}
                  placeholder="Share anything you'd like others to know..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900"
                  rows="4"
                />
                <p className="text-xs text-gray-500 text-right">
                  {disabilityDescription.length}/500 characters
                </p>
              </div>

              {/* Visibility */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Who can see this information?</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'public', label: 'Everyone on my profile', icon: Eye },
                    { value: 'matches', label: 'Only after we match', icon: User },
                    { value: 'private', label: 'Keep it private', icon: EyeOff }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setDisabilityVisibility(option.value)}
                      className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all flex items-center space-x-3 ${
                        disabilityVisibility === option.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{option.label}</span>
                      {disabilityVisibility === option.value && (
                        <span className="ml-auto text-purple-600">●</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Matching Preferences */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Who would you like to meet?
            </label>
            <div className="space-y-2">
              {[
                { value: 'no_preference', label: 'No preference' },
                { value: 'open', label: 'Open to dating someone with a disability' },
                { value: 'prefer', label: 'Prefer to date within disability community' },
                { value: 'only', label: 'Only looking for disability-confident matches' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setDisabilityPreference(option.value)}
                  className={`w-full py-3 px-4 rounded-xl border-2 text-left transition-all ${
                    disabilityPreference === option.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{option.label}</span>
                    {disabilityPreference === option.value && (
                      <span className="text-purple-600">●</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
