import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MessageCircle, Search } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import HeartLoader from '../components/common/HeartLoader';

export default function MessagesPageV2() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, 'chats');
    
    // Simple query without orderBy to avoid index requirement
    const q = query(
      chatsRef,
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort manually by lastMessageAt
        chatsList.sort((a, b) => {
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return timeB - timeA;
        });
        
        setChats(chatsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading chats:', error);
        setChats([]);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const filteredChats = chats.filter((chat) => {
    const otherUserName =
      chat.user1Id === currentUser.uid ? chat.user2Name : chat.user1Name;
    return otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <HeartLoader text="Loading messages..." size="large" />
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
            <MessageCircle className="w-6 h-6 text-pink-600 fill-pink-600" />
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          </div>
          <p className="text-gray-600 mt-1">Chat with your matches</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>

        {/* Chats List */}
        {filteredChats.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No messages yet</h2>
              <p className="text-gray-600">
                Start swiping to find matches and begin conversations!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChats.map((chat) => {
              const otherUserId =
                chat.user1Id === currentUser.uid ? chat.user2Id : chat.user1Id;
              const otherUserName =
                chat.user1Id === currentUser.uid ? chat.user2Name : chat.user1Name;
              const otherUserPhoto =
                chat.user1Id === currentUser.uid ? chat.user2Photo : chat.user1Photo;

              const lastMessageTime = chat.lastMessageAt
                ? new Date(chat.lastMessageAt).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                : '';

              return (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className="bg-white rounded-2xl p-4 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer border border-gray-100"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                      {otherUserPhoto ? (
                        <img
                          src={otherUserPhoto}
                          alt={otherUserName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {otherUserName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {chat.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {otherUserName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {lastMessageTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage || 'No messages yet'}
                    </p>
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
