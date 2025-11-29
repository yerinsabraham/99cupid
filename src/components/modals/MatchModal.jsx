import { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

export default function MatchModal({ isOpen, onClose, onStartChat, match }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleStartChat = () => {
    onStartChat();
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
        isAnimating ? 'bg-black/50' : 'bg-black/0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transition-all duration-500 transform ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background gradient */}
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 h-40 flex items-center justify-center relative overflow-hidden">
          {/* Animated hearts background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            {[...Array(8)].map((_, i) => (
              <Heart
                key={i}
                className="w-8 h-8 text-white fill-white animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Main hearts with bounce animation */}
          <div className="flex items-center justify-center space-x-4 relative z-10">
            <div className="relative animate-bounce-slow" style={{ animationDelay: '-0.2s' }}>
              {match?.user1Photo ? (
                <img
                  src={match.user1Photo}
                  alt={match.user1Name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg animate-fade-in"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center border-4 border-white">
                  <span className="text-2xl font-bold text-pink-600">
                    {match?.user1Name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <Heart className="absolute -bottom-2 -right-2 w-6 h-6 text-pink-400 fill-pink-400 animate-heart-beat" />
            </div>

            <Heart className="w-10 h-10 text-white fill-white animate-bounce-slow" />

            <div className="relative animate-bounce-slow" style={{ animationDelay: '-0.4s' }}>
              {match?.user2Photo ? (
                <img
                  src={match.user2Photo}
                  alt={match.user2Name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg animate-fade-in"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/80 flex items-center justify-center border-4 border-white">
                  <span className="text-2xl font-bold text-pink-600">
                    {match?.user2Name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <Heart className="absolute -bottom-2 -left-2 w-6 h-6 text-pink-400 fill-pink-400 animate-heart-beat" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-4 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-bounce-slow">
              It's a Match!
            </h1>
            <p className="text-gray-600">
              You and <span className="font-semibold text-gray-800">{match?.user2Name}</span> like each
              other!
            </p>
          </div>

          <p className="text-gray-500 text-sm mb-6">
            Start a conversation and get to know each other better.
          </p>

          {/* Buttons */}
          <div className="flex flex-col space-y-3 stagger-children">
            <button
              onClick={handleStartChat}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center space-x-2 group animate-slide-in-left"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Send a Message</span>
            </button>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all animate-slide-in-right"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
