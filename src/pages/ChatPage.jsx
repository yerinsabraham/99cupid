import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Send, ArrowLeft, MoreVertical, Image as ImageIcon, Lock, CheckCircle } from 'lucide-react';
import HeartLoader from '../components/common/HeartLoader';
import MessagingService from '../services/MessagingService';
import SubscriptionService from '../services/SubscriptionService';

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesUnsubscribeRef = useRef(null);
  const typingUnsubscribeRef = useRef(null);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    loadChatData();
    checkSubscription();
    subscribeToMessages();
  }, [chatId, currentUser]);

  // Cleanup subscriptions
  useEffect(() => {
    return () => {
      if (messagesUnsubscribeRef.current) {
        messagesUnsubscribeRef.current();
      }
      if (typingUnsubscribeRef.current) {
        typingUnsubscribeRef.current();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const loadChatData = async () => {
    try {
      // Load chat metadata to get other user info
      const chatDoc = await getDoc(doc(db, 'chats', chatId));
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const otherUserId =
          chatData.user1Id === currentUser.uid ? chatData.user2Id : chatData.user1Id;

        // Load other user's profile
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setOtherUser({
            id: otherUserId,
            displayName: userData.displayName,
            photoURL: userData.photoURL || userData.photos?.[0],
            isVerified: userData.isVerified,
            ...userData,
          });
        }
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const hasSubscription = await SubscriptionService.hasActiveSubscription(currentUser.uid);
      setHasSubscription(hasSubscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasSubscription(false);
    }
  };

  const subscribeToMessages = () => {
    messagesUnsubscribeRef.current = MessagingService.subscribeToMessages(
      chatId,
      (result) => {
        if (result.success) {
          setMessages(result.messages);
          scrollToBottom();
        }
      }
    );

    typingUnsubscribeRef.current = MessagingService.subscribeToTypingIndicators(
      chatId,
      (result) => {
        if (result.success) {
          setTypingUsers(result.typingUsers.filter((uid) => uid !== currentUser.uid));
        }
      }
    );
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTyping = async (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      await MessagingService.sendTypingIndicator(chatId, currentUser.uid, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(async () => {
      setIsTyping(false);
      await MessagingService.sendTypingIndicator(chatId, currentUser.uid, false);
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !hasSubscription) return;

    setSending(true);
    try {
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        await MessagingService.sendTypingIndicator(chatId, currentUser.uid, false);
      }

      const result = await MessagingService.sendMessage(
        chatId,
        currentUser.uid,
        userProfile?.displayName || 'User',
        otherUser?.id || '',
        newMessage
      );

      if (result.success) {
        setNewMessage('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <HeartLoader text="Loading chat..." size="large" />
      </div>
    );
  }

  // Check if user doesn't have subscription
  if (!hasSubscription) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center space-x-4">
          <button
            onClick={() => navigate('/messages')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          {otherUser && (
            <>
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                {otherUser.photoURL ? (
                  <img
                    src={otherUser.photoURL}
                    alt={otherUser.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {otherUser.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">{otherUser.displayName || 'User'}</h2>
              </div>
            </>
          )}
        </div>

        {/* Subscription Paywall */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Unlock Messaging</h2>
            <p className="text-gray-600 mb-6">
              Subscribe to start chatting with your matches and build genuine connections.
            </p>

            <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4 mb-6">
              <div className="text-3xl font-bold text-pink-600 mb-2">$0.99</div>
              <p className="text-gray-600 text-sm">per month</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <span>Unlimited messaging</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <span>Chat with all matches</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <span>See read receipts</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/subscription')}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg mb-3"
            >
              Subscribe Now
            </button>

            <button
              onClick={() => navigate('/messages')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b shadow-sm px-4 py-3 flex items-center space-x-4">
        <button
          onClick={() => navigate('/messages')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {otherUser && (
          <>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
              {otherUser.photos?.[0] ? (
                <img
                  src={otherUser.photos[0]}
                  alt={otherUser.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {otherUser.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-gray-800">{otherUser.displayName || 'User'}</h2>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </>
        )}

        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-pink-600" />
              </div>
              <p className="text-gray-600 font-medium">No messages yet</p>
              <p className="text-sm text-gray-500 mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwn = message.senderId === currentUser.uid;
              const timestamp = message.timestamp?.toDate
                ? message.timestamp.toDate()
                : new Date(message.timestamp);

              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 flex items-center space-x-1 ${
                        isOwn ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>
                        {timestamp.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                      {isOwn && message.read && (
                        <span className="text-blue-500 font-bold">✓✓</span>
                      )}
                      {isOwn && !message.read && (
                        <span>✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3 safe-area-bottom">
        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              disabled={sending}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
