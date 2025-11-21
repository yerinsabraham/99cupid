import { useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ComingSoonModal from '../components/modals/ComingSoonModal';

export default function MessagesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <AppLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-pink-600" />
            <span>Messages</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Chat with your matches
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none transition-colors"
            onClick={() => setShowModal(true)}
            readOnly
          />
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-12 h-12 text-purple-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                No Messages Yet
              </h2>
              <p className="text-gray-600">
                Match with someone to start a conversation
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
              <p className="text-sm text-purple-700 leading-relaxed">
                💬 Once you match with someone, you'll be able to send messages and get to know each other better. 
                Start swiping to find your matches!
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
            >
              Find Matches
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature="Messaging"
      />
    </AppLayout>
  );
}
