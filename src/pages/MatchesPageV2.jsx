import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Heart, MessageCircle, Sparkles, CheckCircle, Clock } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import HeartLoader from '../components/common/HeartLoader';

export default function MatchesPageV2() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' or 'likes'

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

  // Load likes (people you've liked but haven't matched yet)
  useEffect(() => {
    if (!currentUser) return;

    const loadLikes = async () => {
      try {
        const likesRef = collection(db, 'likes');
        const q = query(likesRef, where('fromUserId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        
        const likesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter out likes that already have matches
        const matchedUserIds = matches.flatMap(m => [m.user1Id, m.user2Id]);
        const unmatchedLikes = likesList.filter(like => 
          !matchedUserIds.includes(like.toUserId)
        );

        // Fetch user profiles for liked users
        const likesWithProfiles = await Promise.all(
          unmatchedLikes.map(async (like) => {
            try {
              const userDoc = await getDocs(query(
                collection(db, 'users'), 
                where('__name__', '==', like.toUserId)
              ));
              
              if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                return {
                  ...like,
                  userName: userData.name || userData.displayName || 'User',
                  userPhoto: userData.photos?.[0] || userData.photoURL || null,
                  userAge: userData.age || null,
                };
              }
              return null;
            } catch (error) {
              console.error('Error fetching user profile:', error);
              return null;
            }
          })
        );

        setLikes(likesWithProfiles.filter(Boolean));
      } catch (error) {
        console.error('Error loading likes:', error);
        setLikes([]);
      }
    };

    loadLikes();
  }, [currentUser, matches]);

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
          
          {/* Tabs */}
          <div className="flex space-x-2 mt-4 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'matches'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Matches ({matches.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'likes'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Likes ({likes.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <>
            {matches.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">No matches yet</h2>
                  <p className="text-gray-600 mb-6">
                    When someone likes you back, you'll see them here!
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
              <div className="grid grid-cols-2 gap-4">{matches.map((match) => {
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
                      <div className="bg-pink-600 rounded-full p-2 shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Verified Badge */}
                    {match.user1IsVerified || match.user2IsVerified ? (
                      <div className="absolute top-2 left-2">
                        <div className="bg-blue-500 rounded-full p-1.5 shadow-lg flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ) : null}
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
          </>
        )}

        {/* Likes Tab */}
        {activeTab === 'likes' && (
          <>
            {likes.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">No likes yet</h2>
                  <p className="text-gray-600 mb-6">
                    People you like will appear here
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
                {likes.map((like) => {
                  const likeDate = new Date(like.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <div
                      key={like.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                    >
                      {/* Photo */}
                      <div className="relative aspect-square">
                        {like.userPhoto ? (
                          <img
                            src={like.userPhoto}
                            alt={like.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                              {like.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}

                        {/* Pending Badge */}
                        <div className="absolute top-2 right-2">
                          <div className="bg-yellow-500 rounded-full p-2 shadow-lg">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
                          {like.userName}
                          {like.userAge && <span className="text-gray-600 font-normal">, {like.userAge}</span>}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">Liked on {likeDate}</p>

                        {/* Status */}
                        <div className="w-full py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-center text-sm font-medium">
                          Waiting for response...
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
