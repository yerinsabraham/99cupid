import { useState } from 'react';
import { Camera, Upload, CheckCircle } from 'lucide-react';

export default function PhotoUploadStep({ data, onUpdate, onNext, onBack, loading }) {
  const [photos, setPhotos] = useState(data.photos || []);

  const handleSkip = () => {
    onUpdate({ photos: [] });
    onNext();
  };

  const handleContinue = () => {
    onUpdate({ photos });
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
          <p className="text-gray-600">Show your best self</p>
        </div>

        {/* Photo Upload Area */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-pink-500 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">Upload Photos</p>
            <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 space-y-1">
                <p className="font-medium">Photo Tips:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Use recent, clear photos</li>
                  <li>Show your face clearly</li>
                  <li>Include variety (close-ups, full body, activities)</li>
                  <li>Avoid group photos as your main picture</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-sm text-purple-700">
              📸 Photo upload will be available in Milestone 2. For now, you can complete your profile and add photos later!
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleSkip}
            disabled={loading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
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
