import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadVerificationImage } from '../utils/storageUtils';
import { Shield, Upload, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import HeartLoader from '../components/common/HeartLoader';

export default function VerificationPage() {
  const { currentUser } = useAuth();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVerificationStatus();
  }, [currentUser]);

  const loadVerificationStatus = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, 'verifications'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setVerification(snapshot.docs[0].data());
      }
    } catch (error) {
      console.error('Error loading verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitVerification = async () => {
    if (!selectedFile) {
      setError('Please select a photo');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload selfie to Firebase Storage
      const selfieUrl = await uploadVerificationImage(currentUser.uid, selectedFile);

      // Create verification request in Firestore
      const verificationData = {
        userId: currentUser.uid,
        selfieUrl,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: '',
      };

      await setDoc(doc(collection(db, 'verifications')), verificationData);

      setVerification(verificationData);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Verification submission error:', err);
      setError(err.message || 'Failed to submit verification');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <HeartLoader text="Loading..." size="large" />
        </div>
      </AppLayout>
    );
  }

  const getStatusInfo = () => {
    if (!verification) {
      return {
        icon: Shield,
        color: 'gray',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        textColor: 'text-gray-700',
        title: 'Not Verified',
        message: 'Get verified to build trust and stand out',
      };
    }

    switch (verification.status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          title: 'Verification Pending',
          message: 'Your verification is under review. This usually takes 24-48 hours.',
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          title: 'Verified ✓',
          message: 'Your account is verified!',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          title: 'Verification Rejected',
          message: verification.rejectionReason || 'Please try again with a clear selfie.',
        };
      default:
        return {
          icon: Shield,
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700',
          title: 'Not Verified',
          message: 'Get verified to build trust',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const canSubmit = !verification || verification.status === 'rejected';

  return (
    <AppLayout>
      <div className="min-h-screen p-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Get Verified</h1>
          <p className="text-gray-600 mt-1">Verify your identity to build trust</p>
        </div>

        {/* Status Card */}
        <div className={`${statusInfo.bgColor} border-2 ${statusInfo.borderColor} rounded-3xl p-6 mb-6`}>
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
              <StatusIcon className={`w-6 h-6 ${statusInfo.textColor}`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${statusInfo.textColor}`}>{statusInfo.title}</h3>
              <p className={`text-sm ${statusInfo.textColor} mt-1`}>{statusInfo.message}</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {canSubmit && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Submit Verification</h2>
              <p className="text-gray-600 text-sm">
                Upload a clear selfie holding your ID or a sign with today's date
              </p>
            </div>

            {/* Preview or Upload Area */}
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <XCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-pink-500 transition-colors cursor-pointer bg-gray-50 hover:bg-pink-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-1">Upload Verification Photo</p>
                <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
              </label>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Verification Guidelines:</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Take a clear, well-lit selfie</li>
                <li>Hold your ID or a sign with today's date</li>
                <li>Make sure your face is clearly visible</li>
                <li>Ensure all text is readable</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitVerification}
              disabled={!selectedFile || uploading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <HeartLoader size="small" text="" />
                  <span className="ml-2">Submitting...</span>
                </span>
              ) : (
                'Submit Verification'
              )}
            </button>
          </div>
        )}

        {/* Verified Badge Display */}
        {verification?.status === 'approved' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 fill-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">You're Verified!</h2>
            <p className="text-gray-600">Your verified badge is now displayed on your profile</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
