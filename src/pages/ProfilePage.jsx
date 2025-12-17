import { useAuth } from '../hooks/useAuth';
import { LogOut, Settings, Camera, MapPin, Calendar, Mail, CheckCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

export default function ProfilePage() {
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Cover/Avatar Section */}
          <div className="relative h-48 bg-gradient-to-br from-pink-500 to-purple-600">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-28 h-28 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-6 pb-6 space-y-6">
            {/* Name and Verification */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  {userProfile?.displayName || 'User'}
                </h2>
                {currentUser?.emailVerified && (
                  <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500" />
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-pink-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-pink-600">0</p>
                <p className="text-xs text-gray-600 mt-1">Likes</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-xs text-gray-600 mt-1">Matches</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-xs text-gray-600 mt-1">Visits</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 text-lg">Account Details</h3>
              
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <p className="font-medium text-green-600">
                      {currentUser?.emailVerified ? 'Verified ✓' : 'Not Verified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-800">
                      {userProfile?.createdAt 
                        ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })
                        : 'Recently'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Profile Completion</h3>
                <span className="text-2xl font-bold text-pink-600">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" style={{ width: '25%' }} />
              </div>
              <p className="text-sm text-gray-600">
                Complete your profile to increase your chances of finding matches! Add photos, bio, and interests.
              </p>
            </div>

            {/* Settings Button */}
            <button className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Settings & Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
