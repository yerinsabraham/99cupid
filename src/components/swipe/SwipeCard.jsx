import { useState } from 'react';
import { Heart, X, MapPin, CheckCircle } from 'lucide-react';

export default function SwipeCard({ user, onSwipe, style }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
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
    if (!touchStart || !touchEnd) {
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

  return (
    <div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={cardStyle}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden select-none">
        {/* Profile Image */}
        <div className="relative h-2/3">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-full h-full object-cover"
            draggable="false"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Verified Badge */}
          {user.isVerifiedAccount && (
            <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>Verified</span>
            </div>
          )}

          {/* User Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-1">
              {user.displayName}, {user.age}
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="h-1/3 p-6 pb-24 overflow-y-auto">
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">{user.bio}</p>
          
          {/* Interests */}
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
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
            onClick={() => onSwipe('left')}
            className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 hover:scale-110 transition-all duration-300 pointer-events-auto"
          >
            <X className="w-7 h-7 text-red-500" />
          </button>
          <button
            onClick={() => onSwipe('right')}
            className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full shadow-xl flex items-center justify-center hover:from-pink-600 hover:to-pink-700 hover:scale-110 transition-all duration-300 pointer-events-auto"
          >
            <Heart className="w-7 h-7 text-white fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
