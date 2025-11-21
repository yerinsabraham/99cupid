import { CheckCircle, Image, Award } from 'lucide-react';

export default function AuthenticProfileScreen({ onNext, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">Be Your Authentic Self</h2>
          <p className="text-lg text-gray-600">
            Create a profile that shows the real you. Honesty is attractive!
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Upload Real Photos</h3>
              <p className="text-gray-600 text-sm">Show your genuine smile. No filters needed.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Get Verified</h3>
              <p className="text-gray-600 text-sm">Optional verification badge to stand out.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Founding Member</h3>
              <p className="text-gray-600 text-sm">Join early and get exclusive founding member badge.</p>
            </div>
          </div>
        </div>

        <div className="bg-pink-50 border-2 border-pink-200 p-4 rounded-2xl">
          <p className="text-center text-gray-700 text-sm">
            💝 <span className="font-semibold">Special Offer:</span> First month at just <span className="text-pink-600 font-bold">$0.99</span>
          </p>
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
            Create Profile
          </button>
        </div>
      </div>
    </div>
  );
}
