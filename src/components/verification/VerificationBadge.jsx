import React from 'react';

/**
 * VerificationBadge Component
 * Displays verification status badges for users
 * Supports multiple verification levels: basic, verified, premium
 */

const VerificationBadge = ({ 
  user, 
  size = 'md', 
  showText = false,
  className = '' 
}) => {
  if (!user || !user.verification) return null;

  const { verification } = user;
  
  // Determine verification level
  const getVerificationLevel = () => {
    const { phone, photo, id } = verification;

    // Premium: All three verified
    if (phone === 'approved' && photo === 'approved' && id === 'approved') {
      return 'premium';
    }

    // Verified: Phone + Photo
    if (phone === 'approved' && photo === 'approved') {
      return 'verified';
    }

    // Basic: At least phone verified
    if (phone === 'approved') {
      return 'basic';
    }

    return 'none';
  };

  const level = getVerificationLevel();

  // Don't show badge if not verified
  if (level === 'none') return null;

  // Size configurations
  const sizes = {
    sm: {
      badge: 'w-4 h-4',
      text: 'text-xs',
      icon: 'w-3 h-3'
    },
    md: {
      badge: 'w-5 h-5',
      text: 'text-sm',
      icon: 'w-4 h-4'
    },
    lg: {
      badge: 'w-6 h-6',
      text: 'text-base',
      icon: 'w-5 h-5'
    },
    xl: {
      badge: 'w-8 h-8',
      text: 'text-lg',
      icon: 'w-6 h-6'
    }
  };

  const sizeConfig = sizes[size] || sizes.md;

  // Badge configurations by level
  const badges = {
    basic: {
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      label: 'Phone Verified',
      tooltip: 'Phone number verified'
    },
    verified: {
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      label: 'Verified',
      tooltip: 'Phone & Photo verified'
    },
    premium: {
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-600',
      label: 'Premium Verified',
      tooltip: 'Phone, Photo & ID verified'
    }
  };

  const badge = badges[level];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} title={badge.tooltip}>
      {/* Badge Icon */}
      <div className={`${sizeConfig.badge} ${badge.color} rounded-full flex items-center justify-center flex-shrink-0`}>
        <svg 
          className={`${sizeConfig.icon} text-white`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>

      {/* Optional Text Label */}
      {showText && (
        <span className={`${sizeConfig.text} font-semibold ${badge.textColor}`}>
          {badge.label}
        </span>
      )}
    </div>
  );
};

/**
 * VerificationStatusCard Component
 * Detailed verification status display for profile pages
 */
export const VerificationStatusCard = ({ user, onStartVerification }) => {
  if (!user) return null;

  const verification = user.verification || {};

  const verificationTypes = [
    {
      type: 'phone',
      icon: '📱',
      title: 'Phone Verification',
      description: 'Verify your phone number',
      status: verification.phone || 'not_started'
    },
    {
      type: 'photo',
      icon: '📸',
      title: 'Photo Verification',
      description: 'Verify with a selfie',
      status: verification.photo || 'not_started'
    },
    {
      type: 'id',
      icon: '🪪',
      title: 'ID Verification',
      description: 'Verify with government ID',
      status: verification.id || 'not_started',
      optional: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'expired':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Verified ✓';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      case 'expired':
        return 'Expired';
      default:
        return 'Not Started';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verification Status
        </h3>
        <VerificationBadge user={user} size="md" showText />
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Get verified to build trust and increase your match rate by up to 3x
      </p>

      <div className="space-y-3">
        {verificationTypes.map((item) => (
          <div 
            key={item.type}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
          >
            <div className="flex items-center flex-1">
              <span className="text-2xl mr-3">{item.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  {item.optional && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
            
            <div className="ml-4">
              {item.status === 'not_started' ? (
                <button
                  onClick={() => onStartVerification?.(item.type)}
                  className="px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Start
                </button>
              ) : (
                <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">Why verify?</p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Stand out with a verification badge</li>
              <li>• Build trust with potential matches</li>
              <li>• Increase profile visibility</li>
              <li>• Access premium features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationBadge;
