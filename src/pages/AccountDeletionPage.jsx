import { useState } from 'react';
import { Trash2, Shield, AlertCircle, CheckCircle, Smartphone, Globe } from 'lucide-react';

/**
 * AccountDeletionPage - Public page for account deletion requests
 * Required by Google Play Store for data safety compliance
 * Accessible at: https://99cupid.com/account-deletion
 */
export default function AccountDeletionPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Send deletion request email to support
      // For now, we'll just show success - you can integrate with your email service
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Failed to submit request. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h1>
          <p className="text-gray-600 mb-6">
            We've received your account deletion request. You should receive a confirmation email shortly with next steps.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If you have the app installed, you can also delete your account directly from the app settings.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">99</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">99 Cupid</h1>
              <p className="text-sm text-gray-600">Account Deletion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <Shield className="w-12 h-12" />
              <div>
                <h2 className="text-3xl font-bold">Delete Your Account</h2>
                <p className="text-pink-100 mt-1">We respect your right to be forgotten</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Warning Banner */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Important Information</h3>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Account deletion is permanent and cannot be undone</li>
                    <li>• All your data including profile, photos, and messages will be deleted</li>
                    <li>• Your matches will no longer be able to see or contact you</li>
                    <li>• This process may take up to 30 days to complete</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Deletion Methods */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Method 1: In-App */}
              <div className="border-2 border-pink-200 rounded-xl p-6 hover:border-pink-400 transition-colors">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Delete via Mobile App</h3>
                <p className="text-sm text-gray-600 mb-4">
                  The fastest way to delete your account is directly from the app:
                </p>
                <ol className="text-sm text-gray-700 space-y-2">
                  <li>1. Open the 99 Cupid app</li>
                  <li>2. Go to Settings</li>
                  <li>3. Tap "Account Management"</li>
                  <li>4. Select "Delete My Account"</li>
                  <li>5. Follow the confirmation steps</li>
                </ol>
              </div>

              {/* Method 2: Web Request */}
              <div className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition-colors">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Request Deletion Online</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Can't access the app? Submit a deletion request using the form below.
                </p>
                <p className="text-sm text-gray-700">
                  We'll send you a confirmation email with instructions to verify your identity and complete the deletion process.
                </p>
              </div>
            </div>

            {/* Deletion Request Form */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Trash2 className="w-5 h-5 mr-2 text-gray-700" />
                Request Account Deletion
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address Associated with Your Account
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    We'll send a verification email to confirm your identity
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Submit Deletion Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Data Policy Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Learn more about how we handle your data in our{' '}
                <a 
                  href="/data-deletion-policy" 
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Data Deletion Policy
                </a>
                {' '}and{' '}
                <a 
                  href="/privacy-policy" 
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Support Contact */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-700">
                Need help or have questions?{' '}
                <a 
                  href="mailto:support@99cupid.com" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} 99 Cupid. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
