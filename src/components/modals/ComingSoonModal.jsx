import { X, Clock } from 'lucide-react';

export default function ComingSoonModal({ isOpen, onClose, feature }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-pink-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">
              Coming Soon!
            </h2>
            <p className="text-gray-600">
              {feature || 'This feature'} will be available in Milestone 2
            </p>
          </div>

          <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4">
            <p className="text-sm text-pink-700 leading-relaxed">
              We're working hard to bring you the best dating experience. 
              Stay tuned for exciting updates! 💕
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
