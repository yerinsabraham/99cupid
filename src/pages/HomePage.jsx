import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import SwipeCard from '../components/swipe/SwipeCard';
import ComingSoonModal from '../components/modals/ComingSoonModal';
import { getDemoUsers } from '../utils/demoUsers';

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalFeature, setModalFeature] = useState('');

  useEffect(() => {
    // Load demo users
    setUsers(getDemoUsers());
  }, []);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      // Show "coming soon" modal for matching
      setModalFeature('Matching');
      setShowModal(true);
    }

    // Move to next card
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to beginning
      setCurrentIndex(0);
    }
  };

  const currentUser = users[currentIndex];

  return (
    <AppLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
            <h1 className="text-2xl font-bold text-gray-800">Discover</h1>
          </div>
        </div>

        {/* Swipe Card Area */}
        <div className="relative h-[600px] max-h-[70vh]">
          {users.length > 0 ? (
            <>
              {/* Show next card in background for depth effect */}
              {currentIndex < users.length - 1 && (
                <div className="absolute inset-0 transform scale-95 opacity-50">
                  <div className="w-full h-full bg-white rounded-3xl shadow-lg" />
                </div>
              )}

              {/* Current card */}
              {currentUser && (
                <SwipeCard
                  key={currentUser.id}
                  user={currentUser}
                  onSwipe={handleSwipe}
                />
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-white rounded-3xl shadow-2xl">
              <div className="text-center p-8">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  No more profiles
                </h2>
                <p className="text-gray-600">
                  Check back later for new matches!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Swipe right to like, swipe left to pass
          </p>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature={modalFeature}
      />
    </AppLayout>
  );
}
