import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import SwipeCard from '../components/swipe/SwipeCard';
import MatchModal from '../components/modals/MatchModal';
import FilterModal from '../components/modals/FilterModal';
import FullProfileView from '../components/profile/FullProfileView';
import HeartLoader from '../components/common/HeartLoader';
import { getDemoUsers } from '../utils/demoUsers';
import SwipeService from '../services/SwipeService';
import MatchingService from '../services/MatchingService';
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
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [useMatchingAlgorithm, setUseMatchingAlgorithm] = useState(true);
  const [showCompatibilityScore, setShowCompatibilityScore] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    maxDistance: 'any',
    ageMin: 18,
    ageMax: 50,
    gender: 'everyone'
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        let profiles = [];

        if (currentUser && useMatchingAlgorithm) {
          // Use intelligent matching algorithm with filters
          console.log('Using matching algorithm for user:', currentUser.uid);
          console.log('Applied filters:', filters);
          profiles = await MatchingService.getMatches(currentUser.uid, 50, filters);
          console.log(`Loaded ${profiles.length} matched profiles`);
        } else {
          // Fallback to demo users
          profiles = getDemoUsers();
        }
        
        // Filter out already swiped profiles
        if (currentUser) {
          const swipedProfiles = await SwipeService.getSwipedProfiles(currentUser.uid);
          const swipedIds = swipedProfiles.map((s) => s.targetUserId);
          const availableUsers = profiles.filter(
            (user) =>
              !swipedIds.includes(user.id) && user.id !== currentUser.uid
          );
          setUsers(availableUsers);
        } else {
          setUsers(profiles);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        // Fallback to demo users
        setUsers(getDemoUsers());
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentUser, useMatchingAlgorithm, filters]);

  const handleSwipe = async (direction) => {
    if (!currentUser || swiping) return;

    setSwiping(true);
    const currentUser_ = users[currentIndex];

    try {
      if (direction === 'right') {
        // User liked someone - record both the like AND the swipe
        console.log('Swiping right (like) on user:', currentUser_.uid);
        
        // Record the swipe first
        await SwipeService.recordSwipe(currentUser.uid, currentUser_.uid, 'right');
        
        // Then handle the like logic (which checks for matches)
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
        // User passed on someone - record the swipe
        console.log('Swiping left (pass) on user:', currentUser_.uid);
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

  const handleTapProfile = (user) => {
    // Add match reasons if available
    if (user.scoreBreakdown && currentUser) {
      const reasons = MatchingService.getMatchReasons(userProfile, user, user.scoreBreakdown);
      user.matchReasons = reasons;
    }
    setSelectedProfile(user);
    setShowFullProfile(true);
  };

  const handleLikeFromProfile = async () => {
    setShowFullProfile(false);
    await handleSwipe('right');
  };

  const handlePassFromProfile = () => {
    setShowFullProfile(false);
    handleSwipe('left');
  };

  const handleReportFromProfile = () => {
    alert('Report functionality coming soon!');
  };

  const handleApplyFilters = (newFilters) => {
    console.log('Applying new filters:', newFilters);
    setFilters(newFilters);
    setLoading(true);
    setCurrentIndex(0); // Reset to first card
  };

  const hasActiveFilters = () => {
    return filters.location !== '' || 
           filters.maxDistance !== 'any' || 
           filters.ageMin !== 18 || 
           filters.ageMax !== 50 || 
           filters.gender !== 'everyone';
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
      <div className="min-h-screen p-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
              <h1 className="text-2xl font-bold text-gray-800">Discover</h1>
            </div>

            <div className="flex items-center space-x-2">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1 ${
                  hasActiveFilters()
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {hasActiveFilters() && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px]">
                    !
                  </span>
                )}
              </button>

              {/* Toggle Compatibility Score */}
              <button
                onClick={() => setShowCompatibilityScore(!showCompatibilityScore)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  showCompatibilityScore
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{showCompatibilityScore ? 'Score: ON' : 'Score: OFF'}</span>
                  <span className="sm:hidden">%</span>
                </div>
              </button>
            </div>
          </div>

          {/* Algorithm Info */}
          {currentUser && useMatchingAlgorithm && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Smart matches based on your preferences</span>
              </div>
              {hasActiveFilters() && (
                <button
                  onClick={() => setFilters({ location: '', maxDistance: 'any', ageMin: 18, ageMax: 50, gender: 'everyone' })}
                  className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
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
                  key={currentUser_.id || currentUser_.uid}
                  user={currentUser_}
                  onSwipe={handleSwipe}
                  onTapProfile={handleTapProfile}
                  showCompatibility={showCompatibilityScore}
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />

      {/* Full Profile View */}
      {showFullProfile && selectedProfile && (
        <FullProfileView
          user={selectedProfile}
          onClose={() => setShowFullProfile(false)}
          onLike={handleLikeFromProfile}
          onPass={handlePassFromProfile}
          onReport={handleReportFromProfile}
        />
      )}
    </AppLayout>
  );
}
