import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import HeartLoader from '../components/common/HeartLoader';

export default function MatchesPageV2() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to matches where current user is either user1 or user2
    const matchesRef = collection(db, 'matches');
    
    // Simple query without orderBy to avoid index requirement
    const q = query(matchesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const matchesList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (match) =>
              match.user1Id === currentUser.uid || match.user2Id === currentUser.uid
          );

        // Sort manually by matchedAt
        matchesList.sort((a, b) => {
          const timeA = a.matchedAt ? new Date(a.matchedAt).getTime() : 0;
          const timeB = b.matchedAt ? new Date(b.matchedAt).getTime() : 0;
          return timeB - timeA;
        });

        setMatches(matchesList);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading matches:', error);
        setMatches([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const handleChatClick = (match) => {
    if (match.chatId) {
      navigate(`/chat/${match.chatId}`);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <HeartLoader text="Loading matches..." size="large" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen p-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
            <h1 className="text-2xl font-bold text-gray-800">Matches</h1>
          </div>
          <p className="text-gray-600 mt-1">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </p>
        </div>

        {/* Matches Grid */}
        {matches.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No matches yet</h2>
              <p className="text-gray-600 mb-6">
                Keep swiping to find people you like!
              </p>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Start Swiping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {matches.map((match) => {
              const isUser1 = match.user1Id === currentUser.uid;
              const otherUserName = isUser1 ? match.user2Name : match.user1Name;
              const otherUserPhoto = isUser1 ? match.user2Photo : match.user1Photo;

              const matchDate = new Date(match.matchedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={match.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  {/* Photo */}
                  <div className="relative aspect-square">
                    {otherUserPhoto ? (
                      <img
                        src={otherUserPhoto}
                        alt={otherUserName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {otherUserName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}

                    {/* Match Badge */}
                    <div className="absolute top-2 right-2">
                      <div className="bg-pink-600 rounded-full p-2">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                      {otherUserName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">Matched on {matchDate}</p>

                    {/* Chat Button */}
                    <button
                      onClick={() => handleChatClick(match)}
                      className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Message</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
