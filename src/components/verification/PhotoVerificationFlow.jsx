import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import VerificationService from '../../services/VerificationService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

const PhotoVerificationFlow = ({ onVerificationComplete, onClose }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Instructions, 2: Capture, 3: Review, 4: Uploading
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setUseCamera(true);
        setError('');
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please allow camera permissions or upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setCapturedPhoto({ blob, url });
      setStep(3);
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const url = URL.createObjectURL(file);
    setCapturedPhoto({ blob: file, url });
    setStep(3);
    setError('');
  };

  const uploadPhoto = async () => {
    if (!capturedPhoto) return;

    setLoading(true);
    setError('');

    try {
      // Upload photo to Firebase Storage
      const timestamp = Date.now();
      const storageRef = ref(storage, `verifications/${currentUser.uid}/selfie_${timestamp}.jpg`);
      
      await uploadBytes(storageRef, capturedPhoto.blob);
      const photoUrl = await getDownloadURL(storageRef);

      // Submit verification
      const result = await VerificationService.submitPhotoVerification(
        currentUser.uid,
        photoUrl,
        {
          capturedAt: new Date().toISOString(),
          method: useCamera ? 'camera' : 'upload'
        }
      );

      if (result.success) {
        setSuccess('Photo submitted for verification! ✓');
        setStep(4);
        
        setTimeout(() => {
          if (onVerificationComplete) {
            onVerificationComplete('photo');
          }
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit verification');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const retakePhoto = () => {
    if (capturedPhoto?.url) {
      URL.revokeObjectURL(capturedPhoto.url);
    }
    setCapturedPhoto(null);
    setStep(2);
    setError('');
  };

  const renderInstructions = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Photo Verification</h3>
        <p className="text-gray-600">Let's verify it's really you!</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Follow these guidelines:
        </h4>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex items-start">
            <span className="text-pink-500 mr-2">✓</span>
            <span>Take a clear selfie showing your face</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2">✓</span>
            <span>Make sure you're in good lighting</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2">✓</span>
            <span>Face the camera directly</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2">✓</span>
            <span>Don't wear sunglasses or hats</span>
          </li>
          <li className="flex items-start">
            <span className="text-pink-500 mr-2">✓</span>
            <span>No filters or heavy editing</span>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            setStep(2);
            startCamera();
          }}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          Take a Selfie
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-pink-500 hover:text-pink-500 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Upload a Photo
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );

  const renderCapture = () => (
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Position Your Face</h3>
      
      <div className="relative mb-4 bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-auto"
        />
        
        {/* Face guide overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-80 border-4 border-pink-500 border-dashed rounded-full opacity-50"></div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => {
            stopCamera();
            setStep(1);
          }}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={capturePhoto}
          disabled={!useCamera}
          className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50"
        >
          Capture Photo
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const renderReview = () => (
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Review Your Photo</h3>
      
      <div className="mb-4 rounded-lg overflow-hidden">
        <img
          src={capturedPhoto?.url}
          alt="Verification selfie"
          className="w-full h-auto"
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
        <p className="text-sm text-yellow-800">
          <strong>Review checklist:</strong>
        </p>
        <ul className="text-sm text-yellow-800 mt-2 space-y-1">
          <li>✓ Your face is clearly visible</li>
          <li>✓ Photo is well-lit</li>
          <li>✓ No filters or heavy editing</li>
          <li>✓ You're facing the camera</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={retakePhoto}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
        >
          Retake
        </button>
        <button
          onClick={uploadPhoto}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Photo Submitted!</h3>
      <p className="text-gray-600 mb-6">
        Your photo is being reviewed. This usually takes a few minutes.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <p className="text-sm text-blue-900">
          <strong>What happens next?</strong>
        </p>
        <p className="text-sm text-blue-800 mt-2">
          Our team will verify that your selfie matches your profile photos. You'll receive a notification once your verification is complete.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Photo Verification
        </h2>
        {onClose && step !== 4 && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress indicator */}
      {step < 4 && (
        <div className="flex items-center mb-6">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`flex-1 h-1 ${step >= 2 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <div className={`flex-1 h-1 ${step >= 3 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
        </div>
      )}

      {step === 1 && renderInstructions()}
      {step === 2 && renderCapture()}
      {step === 3 && renderReview()}
      {step === 4 && renderSuccess()}

      {/* Privacy notice */}
      {step < 4 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-600">
                Your verification photo is used only to confirm your identity and will not be shown to other users.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoVerificationFlow;
