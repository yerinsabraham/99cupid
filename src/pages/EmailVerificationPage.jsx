import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function EmailVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { currentUser, resendVerification, logout } = useAuth();
  const navigate = useNavigate();

  const handleResend = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await resendVerification();

    setLoading(false);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCheckVerification = async () => {
    await currentUser.reload();
    if (currentUser.emailVerified) {
      window.location.reload();
    } else {
      setMessage({
        type: 'error',
        text: 'Email not verified yet. Please check your inbox and click the verification link.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center animate-bounce-slow">
              <Mail className="w-10 h-10 text-pink-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>

          <p className="text-gray-600">
            We've sent a verification email to:
          </p>
          <p className="text-pink-600 font-semibold break-all">{currentUser?.email}</p>

          <p className="text-sm text-gray-500">
            Please check your inbox and click the verification link to continue.
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCheckVerification}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            I've Verified My Email
          </button>

          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full border-2 border-pink-500 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Sending...' : 'Resend Email'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> Check your spam folder if you don't see the email within a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
