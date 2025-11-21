import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ComingSoonModal from '../components/modals/ComingSoonModal';

export default function MatchesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AppLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
            <span>My Matches</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            People who liked you back
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-12 h-12 text-pink-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                No Matches Yet
              </h2>
              <p className="text-gray-600">
                Start swiping to find your perfect match!
              </p>
            </div>

            <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5 text-pink-600" />
                <p className="font-semibold text-pink-700">How matching works</p>
              </div>
              
              <div className="text-left space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <p>Swipe right on profiles you like</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <p>When they swipe right on you too, it's a match!</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <p>Start chatting and get to know each other</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
            >
              Start Swiping
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature="Real-time Matching"
      />
    </AppLayout>
  );
}
