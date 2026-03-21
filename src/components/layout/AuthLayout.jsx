import { Heart } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex flex-col justify-start px-6 pt-8 pb-4">
      <div className="w-full max-w-md mx-auto">
        {/* Logo and Welcome Text */}
        <div className="text-center mb-4">
          <div className="flex justify-center -mb-3">
            <img 
              src="/icon_logo4.png" 
              alt="99Cupid" 
              className="w-32 h-32 object-contain"
            />
          </div>
          
          {/* Title and Subtitle */}
          {title && (
            <div className="space-y-0">
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 text-sm">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-3">
          Free during launch · $0.99/month after
        </p>
      </div>
    </div>
  );
}
