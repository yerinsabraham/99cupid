import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import ProfileCompletion from '../components/common/ProfileCompletion';
import { ArrowLeft, Camera, X, Plus, Save, Loader } from 'lucide-react';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    gender: '',
    location: '',
    occupation: '',
    education: '',
    interests: [],
    lookingFor: '',
    relationshipGoals: '',
  });

  const [photos, setPhotos] = useState([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) {
      console.log('No user found');
      setLoading(false);
      navigate('/login');
      return;
    }
    
    try {
      console.log('Loading profile for user:', currentUser.uid);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('Profile data loaded:', data);
        setProfile(data);
        
        setFormData({
          name: data.name || data.displayName || '',
          bio: data.bio || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          location: data.location || '',
          occupation: data.occupation || '',
          education: data.education || '',
          interests: data.interests || [],
          lookingFor: data.lookingFor || '',
          relationshipGoals: data.relationshipGoals || '',
        });
        
        setPhotos(data.photos || []);
      } else {
        console.warn('User document does not exist');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + newPhotoFiles.length + files.length > 6) {
      alert('Maximum 6 photos allowed');
      return;
    }
    setNewPhotoFiles(prev => [...prev, ...files]);
  };

  const removeExistingPhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewPhoto = (index) => {
    setNewPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upload new photos
      const uploadedPhotoUrls = [];
      for (const file of newPhotoFiles) {
        const photoRef = ref(storage, `users/${currentUser.uid}/photos/${Date.now()}_${file.name}`);
        await uploadBytes(photoRef, file);
        const url = await getDownloadURL(photoRef);
        uploadedPhotoUrls.push(url);
      }

      // Combine existing and new photos
      const allPhotos = [...photos, ...uploadedPhotoUrls];

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: formData.name,
        displayName: formData.name, // Keep for compatibility
        bio: formData.bio,
        age: parseInt(formData.age) || null,
        gender: formData.gender,
        location: formData.location,
        occupation: formData.occupation,
        education: formData.education,
        interests: formData.interests,
        lookingFor: formData.lookingFor,
        relationshipGoals: formData.relationshipGoals,
        photos: allPhotos,
        updatedAt: new Date(),
      });

      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const availableInterests = [
    'Travel', 'Music', 'Movies', 'Sports', 'Reading', 'Cooking',
    'Photography', 'Art', 'Gaming', 'Fitness', 'Dancing', 'Hiking',
    'Yoga', 'Food', 'Coffee', 'Wine', 'Pets', 'Fashion'
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 text-pink-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </AppLayout>
    );
  }

  if (!currentUser) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600 mb-4">Please log in to edit your profile</p>
          <button
            onClick={() => navigate('/admin-login')}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Go to Login
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-800">Edit Profile</h1>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 font-semibold disabled:opacity-50"
            >
              {saving ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* Profile Completion - Always show */}
          <ProfileCompletion profile={profile} showAlways={true} />

          {/* Photos Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Photos</h2>
            <p className="text-sm text-gray-600 mb-4">Add up to 6 photos</p>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Existing Photos */}
              {photos.map((photo, index) => (
                <div key={`existing-${index}`} className="relative aspect-square">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeExistingPhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* New Photos */}
              {newPhotoFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeNewPhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add Photo Button */}
              {photos.length + newPhotoFiles.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Info</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows="4"
                maxLength="500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                placeholder="Tell people about yourself..."
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Work & Education */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Work & Education</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Your job title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Your school or degree"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Interests</h2>
            <p className="text-sm text-gray-600 mb-4">Select your interests (up to 10)</p>
            
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  disabled={!formData.interests.includes(interest) && formData.interests.length >= 10}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Relationship Goals */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">What I'm Looking For</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Looking For</label>
              <select
                value={formData.lookingFor}
                onChange={(e) => handleInputChange('lookingFor', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="male">Men</option>
                <option value="female">Women</option>
                <option value="everyone">Everyone</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship Goals</label>
              <select
                value={formData.relationshipGoals}
                onChange={(e) => handleInputChange('relationshipGoals', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="long-term">Long-term relationship</option>
                <option value="short-term">Short-term, open to long</option>
                <option value="new-friends">New friends</option>
                <option value="figuring-out">Still figuring it out</option>
              </select>
            </div>
          </div>

          {/* Save Button (Mobile) */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {saving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
