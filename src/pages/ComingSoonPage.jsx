import { useNavigate } from 'react-router-dom';

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/applogo.png" 
            alt="99Cupid Logo" 
            className="h-24 w-24 sm:h-32 sm:w-32 object-contain drop-shadow-lg"
          />
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 border border-pink-100">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Coming Soon
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed">
            We're putting the final touches on something special. 
            <br className="hidden sm:block" />
            99Cupid is almost ready to help you find meaningful connections.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/landing')}
            className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="relative z-10">Join the Waitlist</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          {/* Subtext */}
          <p className="mt-6 text-sm text-gray-500">
            Be among the first 1,000 founding members
          </p>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-gray-600 text-sm">
          © 2024 99Cupid. All rights reserved.
        </p>
      </div>
    </div>
  );
}
