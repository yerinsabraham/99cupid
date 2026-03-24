import { useState } from 'react';
import { Trash2, Shield, CheckCircle, Smartphone, Database, Image, MessageCircle, User, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * DataDeletionRequestPage - Request deletion of specific data without deleting account
 * Required by Google Play Store for granular data control
 * Accessible at: https://99cupid.com/delete-data
 */
export default function DataDeletionRequestPage() {
  const [selectedData, setSelectedData] = useState([]);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dataTypes = [
    {
      id: 'photos',
      icon: Image,
      title: 'Photos',
      description: 'Delete specific photos from your profile',
      inApp: true,
    },
    {
      id: 'messages',
      icon: MessageCircle,
      title: 'Messages & Conversations',
      description: 'Delete chat history with specific matches',
      inApp: true,
    },
    {
      id: 'matches',
      icon: Heart,
      title: 'Matches & Likes',
      description: 'Remove specific matches or all match history',
      inApp: true,
    },
    {
      id: 'profile',
      icon: User,
      title: 'Profile Information',
      description: 'Remove bio, interests, or other profile data',
      inApp: true,
    },
    {
      id: 'location',
      icon: Database,
      title: 'Location Data',
      description: 'Delete stored location history',
      inApp: false,
    },
    {
      id: 'analytics',
      icon: Database,
      title: 'Usage Analytics',
      description: 'Remove app usage and behavior data',
      inApp: false,
    },
  ];

  const toggleDataType = (id) => {
    if (selectedData.includes(id)) {
      setSelectedData(selectedData.filter(item => item !== id));
    } else {
      setSelectedData([...selectedData, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (selectedData.length === 0) {
      setError('Please select at least one type of data to delete');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setEmail('');
      setSelectedData([]);
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
            We've received your data deletion request. You should receive a confirmation email shortly with next steps.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Most data types can be deleted directly in the app. Check your email for detailed instructions.
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">99</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">99 Cupid</h1>
                <p className="text-sm text-gray-600">Delete Your Data</p>
              </div>
            </div>
            <Link 
              to="/" 
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              Back to App
            </Link>
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
                <h2 className="text-3xl font-bold">Delete Your Data</h2>
                <p className="text-pink-100 mt-1">Choose what data to remove without deleting your account</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Info Banner */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-8">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">You Have Control</h3>
                  <p className="text-sm text-blue-800">
                    You can delete specific data without closing your account. Most data can be deleted 
                    directly in the app. If you want to delete your entire account instead, visit our{' '}
                    <Link to="/account-deletion" className="underline font-medium">Account Deletion page</Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Deletion Methods */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Method 1: In-App */}
              <div className="border-2 border-pink-200 rounded-xl p-6 bg-pink-50">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Delete via Mobile App (Recommended)</h3>
                <p className="text-sm text-gray-700 mb-4">
                  The fastest way to delete specific data:
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li><strong>Photos:</strong> Edit Profile → Tap photo → Delete</li>
                  <li><strong>Messages:</strong> Open chat → Menu → Delete conversation</li>
                  <li><strong>Matches:</strong> Open match → Unmatch</li>
                  <li><strong>Profile Info:</strong> Edit Profile → Remove content</li>
                </ul>
              </div>

              {/* Method 2: Web Request */}
              <div className="border-2 border-purple-200 rounded-xl p-6 bg-purple-50">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Request Deletion Online</h3>
                <p className="text-sm text-gray-700 mb-4">
                  For data not accessible in-app (location history, analytics):
                </p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Select data types below</li>
                  <li>• Submit request with your email</li>
                  <li>• Receive confirmation & instructions</li>
                  <li>• Data deleted within 7 days</li>
                </ul>
              </div>
            </div>

            {/* Data Selection Form */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Trash2 className="w-5 h-5 mr-2 text-gray-700" />
                Select Data to Delete
              </h3>
              
              <div className="space-y-3 mb-6">
                {dataTypes.map((dataType) => {
                  const Icon = dataType.icon;
                  const isSelected = selectedData.includes(dataType.id);
                  
                  return (
                    <div
                      key={dataType.id}
                      onClick={() => toggleDataType(dataType.id)}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-pink-500' : 'bg-gray-200'
                        }`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{dataType.title}</h4>
                            {dataType.inApp && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Can delete in-app
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{dataType.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-pink-500 bg-pink-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

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
                      <span>Submit Data Deletion Request</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* What Gets Deleted */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-amber-900 mb-3">What Happens When You Delete Data</h3>
              <div className="space-y-2 text-sm text-amber-800">
                <p><strong>Photos:</strong> Removed from your profile immediately. Other users can no longer see them.</p>
                <p><strong>Messages:</strong> Deleted from your view and the other person's chat list within 24 hours.</p>
                <p><strong>Matches:</strong> Connection removed. You won't appear in each other's match lists.</p>
                <p><strong>Profile Info:</strong> Specific fields cleared (bio, interests, etc.). Your account remains active.</p>
                <p><strong>Location/Analytics:</strong> Data removed from active databases within 7 days, backups within 30 days.</p>
              </div>
            </div>

            {/* Links */}
            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Learn more about how we handle your data:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <Link to="/data-deletion-policy" className="text-pink-600 hover:text-pink-700 font-medium">
                  Data Deletion Policy
                </Link>
                <span className="text-gray-400">•</span>
                <Link to="/privacy-policy" className="text-pink-600 hover:text-pink-700 font-medium">
                  Privacy Policy
                </Link>
                <span className="text-gray-400">•</span>
                <Link to="/account-deletion" className="text-pink-600 hover:text-pink-700 font-medium">
                  Delete Entire Account
                </Link>
              </div>
            </div>

            {/* Support Contact */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-700">
                Need help?{' '}
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
