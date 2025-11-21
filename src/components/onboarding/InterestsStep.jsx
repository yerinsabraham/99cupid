import { useState } from 'react';
import { Sparkles } from 'lucide-react';

const INTEREST_OPTIONS = [
  '🎵 Music', '🎬 Movies', '📚 Reading', '✈️ Travel',
  '🍳 Cooking', '💪 Fitness', '🎨 Art', '⚽ Sports',
  '🎮 Gaming', '📸 Photography', '🌿 Nature', '☕ Coffee',
  '🍷 Wine', '🐕 Pets', '🧘 Yoga', '🎭 Theater',
  '🏃 Running', '🏊 Swimming', '🚴 Cycling', '🎸 Music Production',
  '💃 Dancing', '🍕 Food', '🌍 Adventure', '📱 Technology'
];

export default function InterestsStep({ data, onUpdate, onNext, onBack }) {
  const [selectedInterests, setSelectedInterests] = useState(data.interests || []);
  const [error, setError] = useState('');

  const toggleInterest = (interest) => {
    setError('');
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 10) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        setError('You can select up to 10 interests');
      }
    }
  };

  const handleNext = () => {
    if (selectedInterests.length < 3) {
      setError('Please select at least 3 interests');
      return;
    }
    onUpdate({ interests: selectedInterests });
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Your Interests</h2>
          <p className="text-gray-600">Select at least 3 things you love</p>
          <p className="text-sm text-pink-600 font-medium">
            {selectedInterests.length}/10 selected
          </p>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`py-3 px-4 rounded-xl font-medium transition-all text-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Selected Interests Display */}
        {selectedInterests.length > 0 && (
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
            <p className="text-sm font-medium text-pink-700 mb-2">Selected Interests:</p>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-white text-pink-700 rounded-full text-sm font-medium shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
