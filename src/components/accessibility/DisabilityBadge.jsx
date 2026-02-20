import React from 'react';
import { Heart, Users, Check } from 'lucide-react';

/**
 * DisabilityBadge - Small badge indicator for profiles
 * Shows on profile cards and full profile views
 */
export default function DisabilityBadge({ 
  hasDisability, 
  disabilityPreference, 
  size = 'small',
  showLabel = true,
  showBadgeOnProfile = true // Privacy control - user can hide their badge
}) {
  // Respect user's privacy preference
  if (!showBadgeOnProfile) {
    return null;
  }

  if (!hasDisability && disabilityPreference === 'no_preference') {
    return null;
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'large':
        return 'px-4 py-2 text-sm';
      case 'medium':
        return 'px-3 py-1.5 text-xs';
      case 'small':
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  // User has disability
  if (hasDisability) {
    return (
      <div className={`inline-flex items-center space-x-1.5 bg-purple-100 text-purple-700 rounded-full font-medium ${getSizeClasses()}`}>
        <Heart className="w-3.5 h-3.5 fill-current" />
        {showLabel && <span>Disability Confident</span>}
      </div>
    );
  }

  // User is disability-confident
  if (['open', 'prefer', 'only'].includes(disabilityPreference)) {
    return (
      <div className={`inline-flex items-center space-x-1.5 bg-green-100 text-green-700 rounded-full font-medium ${getSizeClasses()}`}>
        <Users className="w-3.5 h-3.5" />
        {showLabel && <span>Inclusive</span>}
      </div>
    );
  }

  return null;
}

/**
 * VerificationBadge - Shows verification status with accessibility indicator
 */
export function VerificationWithAccessibilityBadge({ 
  isVerified, 
  hasDisability,
  disabilityPreference 
}) {
  return (
    <div className="flex items-center space-x-2">
      {isVerified && (
        <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-medium">
          <Check className="w-3 h-3" />
          <span>Verified</span>
        </div>
      )}
      <DisabilityBadge 
        hasDisability={hasDisability} 
        disabilityPreference={disabilityPreference}
        size="small"
      />
    </div>
  );
}
