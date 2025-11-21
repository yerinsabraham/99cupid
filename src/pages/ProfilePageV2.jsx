import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LogOut, Edit2, Camera, MapPin, Heart, CheckCircle, Shield } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import HeartLoader from '../components/common/HeartLoader';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <HeartLoader text="Loading profile..." size="large" />
        </div>
      </AppLayout>
    );
  }

  const photos = profile?.photos || [];
  const mainPhoto = photos[0] || null;

  return (
    <AppLayout>
      <div className="min-h-screen p-6 pb-24">
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
          {/* Photo Section */}
          <div className="relative">
            {mainPhoto ? (
              <div className="relative h-96">
                <img
                  src={mainPhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-3xl font-bold">
                      {profile?.displayName || 'User'}
                      {profile?.age && `, ${profile.age}`}
                    </h2>
                    {profile?.isVerified && (
                      <CheckCircle className="w-6 h-6 text-blue-400 fill-blue-400" />
                    )}
                  </div>
                  {profile?.location && (
                    <div className="flex items-center space-x-1 mt-2">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm">{profile.location}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No profile photo</p>
                </div>
              </div>
            )}

            {/* Edit Button */}
            <button className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
              <Edit2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Additional Photos Grid */}
          {photos.length > 1 && (
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">More Photos</h3>
              <div className="grid grid-cols-3 gap-3">
                {photos.slice(1).map((photo, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={photo}
                      alt={`Photo ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio Section */}
          {profile?.bio && (
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-2">About Me</h3>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          )}

          {/* Interests */}
          {profile?.interests && profile.interests.length > 0 && (
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-800 mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="px-6 py-4 border-b">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-pink-50 rounded-2xl p-4 text-center">
                <Heart className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-pink-600">0</p>
                <p className="text-xs text-gray-600 mt-1">Likes</p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <CheckCircle className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-600">0</p>
                <p className="text-xs text-gray-600 mt-1">Matches</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-600">
                  {profile?.verificationStatus === 'approved' ? '✓' : '-'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {profile?.verificationStatus === 'approved' ? 'Verified' : 'Not Verified'}
                </p>
                {profile?.verificationStatus !== 'approved' && (
                  <button
                    onClick={() => navigate('/verification')}
                    className="mt-2 text-xs text-blue-600 font-medium hover:underline"
                  >
                    Get Verified
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-4">
            <h3 className="font-semibold text-gray-800 mb-3">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium text-gray-800 capitalize">
                  {profile?.gender || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Looking for</span>
                <span className="font-medium text-gray-800 capitalize">
                  {profile?.lookingFor || 'Everyone'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-800">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Member since</span>
                <span className="font-medium text-gray-800">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Recently'}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="px-6 pb-6">
            <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
