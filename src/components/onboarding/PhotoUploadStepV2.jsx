import { useState } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadProfileImage, compressImage } from '../../utils/storageUtils';
import { useAuth } from '../../hooks/useAuth';
import HeartLoader from '../common/HeartLoader';

export default function PhotoUploadStepV2({ data, onUpdate, onNext, onBack, loading }) {
  const { currentUser } = useAuth();
  const [photos, setPhotos] = useState(data.photos || []);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (photos.length + files.length > 4) {
      setError('You can only upload up to 4 photos');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`);

        // Compress image before upload
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
        });

        // Upload to Firebase Storage
        const imageNumber = photos.length + i + 1;
        const downloadURL = await uploadProfileImage(
          currentUser.uid,
          compressedFile,
          imageNumber
        );

        uploadedUrls.push(downloadURL);
      }

      const newPhotos = [...photos, ...uploadedUrls];
      setPhotos(newPhotos);
      onUpdate({ photos: newPhotos });
      setUploadProgress('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onUpdate({ photos: newPhotos });
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      setError('Please upload at least 1 photo to continue');
      return;
    }

    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Add Photos</h2>
          <p className="text-gray-600">Upload 1-4 photos to complete your profile</p>
          <p className="text-sm text-pink-600 font-medium">At least 1 photo is required</p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
              <img
                src={photo}
                alt={`Profile ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Main Photo
                </div>
              )}
            </div>
          ))}

          {/* Upload Slots */}
          {photos.length < 4 && (
            <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-2xl hover:border-pink-500 transition-colors cursor-pointer flex items-center justify-center bg-gray-50 hover:bg-pink-50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-600 font-medium">Add Photo</p>
              </div>
            </label>
          )}
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
            <HeartLoader size="small" text={uploadProgress} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 space-y-1">
              <p className="font-medium">Photo Tips:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Use recent, clear photos</li>
                <li>Show your face clearly in the first photo</li>
                <li>Include variety (close-ups, full body, activities)</li>
                <li>Maximum 4 photos, 5MB each</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            disabled={loading || uploading}
            className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={loading || uploading || photos.length === 0}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <HeartLoader size="small" text="" />
              </span>
            ) : (
              'Complete Setup'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
