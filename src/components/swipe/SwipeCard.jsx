import { useState } from 'react';
import { Heart, X, MapPin, CheckCircle, ShieldAlert, MoreVertical } from 'lucide-react';
import { BlockService, ReportService } from '../../services/BlockReportService';

export default function SwipeCard({ user, onSwipe, onTapProfile, style, disabled = false, showCompatibility = false }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  const tapTimeThreshold = 200; // Max time for tap in ms

  const onTouchStart = (e) => {
    if (disabled) return;
    
    // Don't start dragging if user tapped on a button
    if (e.target.closest('button')) {
      return;
    }
    
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartTime(Date.now());
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    setDragOffset({ x: diff, y: 0 });
    setTouchEnd(currentTouch);
  };

  const onTouchEnd = () => {
    const touchDuration = Date.now() - touchStartTime;
    
    if (!touchStart || !touchEnd) {
      // Check if it's a tap (quick touch with no movement)
      if (touchDuration < tapTimeThreshold && onTapProfile) {
        onTapProfile(user);
      }
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipe('left');
    } else if (isRightSwipe) {
      onSwipe('right');
    } else if (touchDuration < tapTimeThreshold && onTapProfile) {
      // It was a tap, not a swipe
      onTapProfile(user);
    }

    // Reset
    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const cardStyle = {
    ...style,
    transform: isDragging ? `translateX(${dragOffset.x}px) rotate(${dragOffset.x * 0.1}deg)` : 'none',
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };

  // Handle mouse clicks (for desktop) to open profile view
  const handleCardClick = (e) => {
    // Don't open profile if user clicked on a button
    if (e.target.closest('button')) {
      return;
    }
    if (onTapProfile && !isDragging) {
      onTapProfile(user);
    }
  };

  return (
    <div
      className="absolute inset-0 cursor-pointer"
      style={cardStyle}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden select-none">
        {/* Profile Image */}
        <div className="relative h-2/3">
          <img
            src={user.photoURL || (user.photos && user.photos[0]) || '/default-avatar.png'}
            alt={user.displayName}
            className="w-full h-full object-cover"
            draggable="false"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Top Right Menu Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-white/80 hover:bg-white rounded-full p-2 transition-all shadow-lg"
            >
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>

            {/* Menu Dropdown */}
            {showMenu && (
              <div className="absolute top-12 right-0 bg-white rounded-2xl shadow-2xl overflow-hidden z-50">
                <button
                  onClick={async () => {
                    await ReportService.reportUser(user.uid, 'current-user', 'other', 'User reported');
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-6 py-3 hover:bg-red-50 text-red-600 font-medium flex items-center space-x-2 border-b"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Report</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-6 py-3 hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Verified Badge */}
          {user.isVerified && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold shadow-lg">
              <CheckCircle className="w-4 h-4" />
              <span>Verified</span>
            </div>
          )}

          {/* Compatibility Score Badge */}
          {showCompatibility && user.compatibilityScore && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 text-sm font-bold shadow-lg">
              <span className="text-lg">{user.compatibilityScore}%</span>
              <span className="text-xs font-normal">Match</span>
            </div>
          )}

          {/* User Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-1">
              {user.displayName}, {user.age}
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>
                {typeof user.location === 'string' 
                  ? user.location 
                  : user.location?.city && user.location?.country
                    ? `${user.location.city}, ${user.location.country}`
                    : 'Location not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="h-1/3 p-6 pb-24 overflow-y-auto">
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">{user.bio}</p>
          
          {/* Interests */}
          <div className="flex flex-wrap gap-2">
            {user.interests?.slice(0, 5).map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons - Positioned outside the scrollable area */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-6 px-6 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent tap from triggering profile view
              onSwipe('left');
            }}
            disabled={disabled}
            className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 hover:scale-110 transition-all duration-300 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-7 h-7 text-red-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent tap from triggering profile view
              onSwipe('right');
            }}
            disabled={disabled}
            className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full shadow-xl flex items-center justify-center hover:from-pink-600 hover:to-pink-700 hover:scale-110 transition-all duration-300 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart className="w-7 h-7 text-white fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
