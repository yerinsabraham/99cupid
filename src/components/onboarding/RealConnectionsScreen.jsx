import { Users, MessageCircle, Shield } from 'lucide-react';

export default function RealConnectionsScreen({ onNext, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">Real Connections</h2>
          <p className="text-lg text-gray-600">
            No fake profiles. No endless scrolling. Just authentic people looking for genuine connections.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Real People</h3>
              <p className="text-gray-600 text-sm">Verified members only. No bots, no catfish.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Meaningful Chats</h3>
              <p className="text-gray-600 text-sm">Quality conversations with people who actually reply.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">Your privacy matters. Report and block features available.</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="w-1/3 border-2 border-pink-500 text-pink-600 py-4 rounded-2xl font-semibold hover:bg-pink-50 transition-all duration-300"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="w-2/3 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
