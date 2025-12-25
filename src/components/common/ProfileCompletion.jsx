import { CheckCircle, AlertCircle } from 'lucide-react';
import { calculateProfileCompletion, getMissingFields, getCompletionColor } from '../../utils/profileCompletion';

/**
 * ProfileCompletion - Shows profile completion percentage and missing fields
 */
export default function ProfileCompletion({ profile, showAlways = false }) {
  const completionPercentage = calculateProfileCompletion(profile);
  const missingFields = getMissingFields(profile);
  const color = getCompletionColor(completionPercentage);

  // Only show if less than 100% OR if showAlways is true
  if (completionPercentage >= 100 && !showAlways) {
    return null;
  }

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      bar: 'bg-green-500',
      icon: 'text-green-600'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      bar: 'bg-blue-500',
      icon: 'text-blue-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      bar: 'bg-yellow-500',
      icon: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      bar: 'bg-red-500',
      icon: 'text-red-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-2xl p-4`}>
      {/* Header with Percentage */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {completionPercentage >= 100 ? (
            <CheckCircle className={`w-5 h-5 ${colors.icon}`} />
          ) : (
            <AlertCircle className={`w-5 h-5 ${colors.icon}`} />
          )}
          <h3 className={`font-semibold ${colors.text}`}>
            {completionPercentage >= 100 ? 'Profile Complete!' : 'Complete Your Profile'}
          </h3>
        </div>
        <span className={`text-2xl font-bold ${colors.text}`}>
          {completionPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
        <div
          className={`${colors.bar} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      {/* Message */}
      {completionPercentage >= 100 ? (
        <p className={`text-sm ${colors.text}`}>
          🎉 Your profile is complete! You're all set to find matches.
        </p>
      ) : (
        <>
          <p className={`text-sm ${colors.text} mb-2`}>
            {completionPercentage >= 75 
              ? 'Almost there! Just a few more details.'
              : completionPercentage >= 50
              ? 'You\'re halfway there! Keep going.'
              : 'Complete your profile to get better matches.'}
          </p>
          
          {/* Missing Fields (show first 3) */}
          {missingFields.length > 0 && (
            <div className={`text-xs ${colors.text} mt-2`}>
              <p className="font-medium mb-1">Missing:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {missingFields.slice(0, 3).map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
                {missingFields.length > 3 && (
                  <li>and {missingFields.length - 3} more...</li>
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
