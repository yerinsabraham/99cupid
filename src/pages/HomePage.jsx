import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import SwipeCard from '../components/swipe/SwipeCard';
import MatchModal from '../components/modals/MatchModal';
import HeartLoader from '../components/common/HeartLoader';
import { getDemoUsers } from '../utils/demoUsers';
import SwipeService from '../services/SwipeService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Load demo users
        const demoUsers = getDemoUsers();
        
        // Filter out already swiped profiles
        if (currentUser) {
          const swipedProfiles = await SwipeService.getSwipedProfiles(currentUser.uid);
          const swipedIds = swipedProfiles.map((s) => s.targetUserId);
          const availableUsers = demoUsers.filter(
            (user) =>
              !swipedIds.includes(user.uid) && user.uid !== currentUser.uid
          );
          setUsers(availableUsers);
        } else {
          setUsers(demoUsers);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers(getDemoUsers());
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentUser]);

  const handleSwipe = async (direction) => {
    if (!currentUser || swiping) return;

    setSwiping(true);
    const currentUser_ = users[currentIndex];

    try {
      if (direction === 'right') {
        // User liked someone
        const result = await SwipeService.likeUser(
          currentUser.uid,
          currentUser_.uid,
          userProfile,
          currentUser_
        );

        if (result.success && result.isMatch) {
          // Show match modal
          setMatchData(result.match);
          setShowMatchModal(true);
        }
      } else {
        // User passed on someone
        await SwipeService.passOnUser(currentUser.uid, currentUser_.uid);
      }

      // Move to next card
      if (currentIndex < users.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Reset to beginning
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error handling swipe:', error);
    } finally {
      setSwiping(false);
    }
  };

  const handleStartChat = () => {
    if (matchData?.chatId) {
      navigate(`/chat/${matchData.chatId}`);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <HeartLoader text="Loading profiles..." size="large" />
        </div>
      </AppLayout>
    );
  }

  const currentUser_ = users[currentIndex];

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
              {currentUser_ && (
                <SwipeCard
                  key={currentUser_.uid}
                  user={currentUser_}
                  onSwipe={handleSwipe}
                  disabled={swiping}
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

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        onStartChat={handleStartChat}
        match={matchData}
      />
    </AppLayout>
  );
}
