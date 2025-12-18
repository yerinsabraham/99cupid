import { useState, useEffect } from 'react';
import { X, Heart, XIcon, MapPin, Briefcase, GraduationCap, AlertCircle, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import VerificationBadge from '../verification/VerificationBadge';

export default function FullProfileView({ user, onClose, onLike, onPass, onReport }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const photos = user?.photos || [];

  // Swipe handlers for photo gallery
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextPhoto(),
    onSwipedRight: () => prevPhoto(),
    trackMouse: true,
    trackTouch: true,
  });

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return user?.age || '';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user?.displayName}'s Profile`,
        text: `Check out ${user?.displayName} on 99CUPID!`,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(true);
    }
  };

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!user) return null;

  const age = calculateAge(user.dateOfBirth);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 overflow-y-auto animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={onReport}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-32">
        {/* Photo Gallery */}
        <div className="relative" {...swipeHandlers}>
          <div className="relative aspect-[3/4] max-h-[70vh] bg-gray-900">
            <img
              src={photos[currentPhotoIndex]}
              alt={`${user.displayName} - Photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Photo Navigation Dots */}
            {photos.length > 1 && (
              <div className="absolute top-4 left-0 right-0 flex justify-center space-x-2">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all ${
                      index === currentPhotoIndex
                        ? 'w-8 bg-white'
                        : 'w-6 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Photo Navigation Arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Basic Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-3xl font-bold text-white">
                    {user.displayName}
                  </h1>
                  {user.isVerified && (
                    <VerificationBadge level={user.verificationLevel || 'verified'} />
                  )}
                </div>
                <p className="text-xl text-white/90">{age}</p>
              </div>
            </div>

            {user.location && (
              <div className="flex items-center space-x-2 mt-3 text-white/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{user.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-900 text-white px-6 py-6 space-y-6">
          {/* Compatibility Score */}
          {user.compatibilityScore && (
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Compatibility</h3>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  {user.compatibilityScore}%
                </span>
              </div>
              
              {/* Match Reasons */}
              {user.matchReasons && user.matchReasons.length > 0 && (
                <div className="space-y-1 mt-3">
                  {user.matchReasons.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                      <span className="text-pink-400">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="text-lg font-bold mb-2">About {user.displayName?.split(' ')[0]}</h3>
              <p className="text-gray-300 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Basic Details */}
          <div className="space-y-3">
            {user.occupation && (
              <div className="flex items-start space-x-3">
                <Briefcase className="w-5 h-5 text-pink-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Occupation</p>
                  <p className="text-white">{user.occupation}</p>
                </div>
              </div>
            )}

            {user.education && (
              <div className="flex items-start space-x-3">
                <GraduationCap className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">Education</p>
                  <p className="text-white">{user.education}</p>
                </div>
              </div>
            )}

            {user.height && (
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-blue-500 font-bold mt-0.5">↕</div>
                <div>
                  <p className="text-sm text-gray-400">Height</p>
                  <p className="text-white">{user.height}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full text-sm text-white"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Looking For */}
          {(user.lookingFor || user.relationshipGoals) && (
            <div>
              <h3 className="text-lg font-bold mb-3">What I'm Looking For</h3>
              <div className="space-y-2">
                {user.lookingFor && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Interested in</p>
                    <p className="text-white capitalize">{user.lookingFor}</p>
                  </div>
                )}
                {user.relationshipGoals && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Relationship goals</p>
                    <p className="text-white capitalize">{user.relationshipGoals.replace('-', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lifestyle */}
          {(user.smoking || user.drinking || user.exercise) && (
            <div>
              <h3 className="text-lg font-bold mb-3">Lifestyle</h3>
              <div className="grid grid-cols-3 gap-3">
                {user.smoking && (
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Smoking</p>
                    <p className="text-sm text-white">{user.smoking}</p>
                  </div>
                )}
                {user.drinking && (
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Drinking</p>
                    <p className="text-sm text-white">{user.drinking}</p>
                  </div>
                )}
                {user.exercise && (
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Exercise</p>
                    <p className="text-sm text-white">{user.exercise}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pb-8">
        <div className="max-w-md mx-auto flex items-center justify-center space-x-6">
          <button
            onClick={onPass}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all shadow-lg"
          >
            <XIcon className="w-8 h-8 text-red-500" />
          </button>

          <button
            onClick={onLike}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-all shadow-2xl"
          >
            <Heart className="w-10 h-10 text-white fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
