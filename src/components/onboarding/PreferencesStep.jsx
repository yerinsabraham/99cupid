import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

export default function PreferencesStep({ data, onUpdate, onNext, onBack }) {
  const [formData, setFormData] = useState({
    lookingFor: data.lookingFor || '',
    bio: data.bio || ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.lookingFor) {
      newErrors.lookingFor = 'Please select what you\'re looking for';
    }

    if (!formData.bio || formData.bio.trim().length < 20) {
      newErrors.bio = 'Bio must be at least 20 characters';
    } else if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onUpdate(formData);
      onNext();
    }
  };

  const lookingForOptions = [
    { value: 'male', label: 'Men', icon: '👨' },
    { value: 'female', label: 'Women', icon: '👩' },
    { value: 'everyone', label: 'Everyone', icon: '💕' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Dating Preferences</h2>
          <p className="text-gray-600">Who would you like to meet?</p>
        </div>

        <div className="space-y-5">
          {/* Looking For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I'm interested in
            </label>
            <div className="grid grid-cols-3 gap-3">
              {lookingForOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleChange('lookingFor', option.value)}
                  className={`py-4 px-3 rounded-xl font-medium transition-all flex flex-col items-center space-y-2 ${
                    formData.lookingFor === option.value
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
            {errors.lookingFor && (
              <p className="mt-1 text-sm text-red-600">{errors.lookingFor}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Me
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell us about yourself... What are you passionate about? What makes you unique?"
                rows="5"
                maxLength="500"
                className={`w-full pl-11 pr-4 py-3 border ${errors.bio ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none`}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              {errors.bio ? (
                <p className="text-sm text-red-600">{errors.bio}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  {formData.bio.length}/500 characters
                </p>
              )}
            </div>
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
