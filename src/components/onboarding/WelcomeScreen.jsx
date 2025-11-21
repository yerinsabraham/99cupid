import { Heart } from 'lucide-react';

export default function WelcomeScreen({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-800">
            Welcome to <span className="text-pink-600">99cupid</span>
          </h1>
          <p className="text-xl text-gray-600">
            Where real connections begin at just $0.99/month
          </p>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
