import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import VerificationService from '../../services/VerificationService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

const IDVerificationFlow = ({ onVerificationComplete, onClose }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Instructions, 2: ID Type, 3: Upload Front, 4: Upload Back, 5: Review, 6: Uploading
  const [idType, setIdType] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const ID_TYPES = [
    { 
      value: 'national_id', 
      label: 'National ID',
      description: 'Philippine National ID (PhilSys)',
      icon: '🪪'
    },
    { 
      value: 'drivers_license', 
      label: "Driver's License",
      description: 'LTO Driver\'s License',
      icon: '🚗'
    },
    { 
      value: 'passport', 
      label: 'Passport',
      description: 'Philippine Passport',
      icon: '✈️'
    },
    { 
      value: 'umid', 
      label: 'UMID',
      description: 'Unified Multi-Purpose ID',
      icon: '📇'
    },
    { 
      value: 'postal_id', 
      label: 'Postal ID',
      description: 'Philippine Postal ID',
      icon: '📮'
    },
    { 
      value: 'voters_id', 
      label: "Voter's ID",
      description: 'COMELEC Voter\'s ID',
      icon: '🗳️'
    }
  ];

  const handleFileSelect = (side, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    const url = URL.createObjectURL(file);
    
    if (side === 'front') {
      setFrontImage({ blob: file, url });
      setError('');
      // Auto-advance to back image if not passport
      if (idType !== 'passport') {
        setStep(4);
      } else {
        setStep(5); // Passport only needs front
      }
    } else {
      setBackImage({ blob: file, url });
      setError('');
      setStep(5); // Move to review
    }
  };

  const uploadImages = async () => {
    if (!frontImage) return;

    setLoading(true);
    setError('');

    try {
      const timestamp = Date.now();
      
      // Upload front image
      const frontStorageRef = ref(storage, `verifications/${currentUser.uid}/id_front_${timestamp}.jpg`);
      await uploadBytes(frontStorageRef, frontImage.blob);
      const frontUrl = await getDownloadURL(frontStorageRef);

      // Upload back image if exists
      let backUrl = null;
      if (backImage) {
        const backStorageRef = ref(storage, `verifications/${currentUser.uid}/id_back_${timestamp}.jpg`);
        await uploadBytes(backStorageRef, backImage.blob);
        backUrl = await getDownloadURL(backStorageRef);
      }

      // Submit verification
      const result = await VerificationService.submitIDVerification(
        currentUser.uid,
        idType,
        frontUrl,
        backUrl,
        {
          submittedAt: new Date().toISOString(),
          deviceInfo: navigator.userAgent
        }
      );

      if (result.success) {
        setSuccess('ID submitted for verification! ✓');
        setStep(6);
        
        setTimeout(() => {
          if (onVerificationComplete) {
            onVerificationComplete('id');
          }
        }, 2000);
      } else {
        setError(result.error || 'Failed to submit verification');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInstructions = () => (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">ID Verification</h3>
        <p className="text-gray-600">Verify your identity with a government-issued ID</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Requirements:
        </h4>
        <ul className="space-y-2 text-sm text-blue-900">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Valid government-issued ID (not expired)</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Clear photo showing all details</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>All corners of the ID visible</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Good lighting, no glare or shadows</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Must be 18 years or older</span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900">Privacy & Security</p>
            <p className="text-sm text-yellow-800 mt-1">
              Your ID is encrypted and used only for age and identity verification. It will not be shared with other users.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        Continue
      </button>
    </div>
  );

  const renderIDTypeSelection = () => (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Select Your ID Type</h3>
      
      <div className="space-y-3 mb-6">
        {ID_TYPES.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setIdType(type.value);
              setStep(3);
            }}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:border-blue-500 hover:bg-blue-50 ${
              idType === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">{type.icon}</span>
              <div>
                <p className="font-semibold text-gray-800">{type.label}</p>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep(1)}
        className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
      >
        Back
      </button>
    </div>
  );

  const renderUploadFront = () => (
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Front of ID</h3>
      <p className="text-gray-600 mb-6">Take a clear photo of the front side</p>

      <div 
        onClick={() => frontInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
      >
        {frontImage ? (
          <img src={frontImage.url} alt="ID Front" className="max-h-64 mx-auto rounded" />
        ) : (
          <div>
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 font-medium">Click to upload front of ID</p>
            <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <input
        ref={frontInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileSelect('front', e)}
        className="hidden"
      />

      <div className="flex gap-3">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          Back
        </button>
        {frontImage && idType === 'passport' && (
          <button
            onClick={() => setStep(5)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );

  const renderUploadBack = () => (
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Back of ID</h3>
      <p className="text-gray-600 mb-6">Take a clear photo of the back side</p>

      <div 
        onClick={() => backInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
      >
        {backImage ? (
          <img src={backImage.url} alt="ID Back" className="max-h-64 mx-auto rounded" />
        ) : (
          <div>
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 font-medium">Click to upload back of ID</p>
            <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <input
        ref={backInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleFileSelect('back', e)}
        className="hidden"
      />

      <div className="flex gap-3">
        <button
          onClick={() => setStep(3)}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          Back
        </button>
        <button
          onClick={() => setStep(5)}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          Skip Back Image
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Review Your ID</h3>
      
      <div className="space-y-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-2 text-left">ID Type</p>
          <div className="bg-gray-50 p-3 rounded-lg text-left">
            <p className="font-semibold">
              {ID_TYPES.find(t => t.value === idType)?.label}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2 text-left">Front of ID</p>
          <img src={frontImage?.url} alt="ID Front" className="w-full rounded-lg border" />
        </div>

        {backImage && (
          <div>
            <p className="text-sm text-gray-600 mb-2 text-left">Back of ID</p>
            <img src={backImage?.url} alt="ID Back" className="w-full rounded-lg border" />
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
        <p className="text-sm text-yellow-800">
          <strong>Check that:</strong>
        </p>
        <ul className="text-sm text-yellow-800 mt-2 space-y-1">
          <li>✓ All text is clear and readable</li>
          <li>✓ All corners are visible</li>
          <li>✓ No glare or shadows</li>
          <li>✓ ID is not expired</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => {
            setFrontImage(null);
            setBackImage(null);
            setStep(3);
          }}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
        >
          Retake
        </button>
        <button
          onClick={uploadImages}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
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
      
      <h3 className="text-2xl font-bold text-gray-800 mb-2">ID Submitted!</h3>
      <p className="text-gray-600 mb-6">
        Your ID is being reviewed. This typically takes 1-2 business days.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <p className="text-sm text-blue-900">
          <strong>What happens next?</strong>
        </p>
        <p className="text-sm text-blue-800 mt-2">
          Our verification team will review your ID to confirm your identity and age. You'll receive a notification once your verification is complete.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ID Verification</h2>
        {onClose && step !== 6 && (
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
      {step < 6 && (
        <div className="flex items-center mb-6">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
          <div className={`flex-1 h-1 ${step >= 5 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 5 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
            4
          </div>
        </div>
      )}

      {step === 1 && renderInstructions()}
      {step === 2 && renderIDTypeSelection()}
      {step === 3 && renderUploadFront()}
      {step === 4 && renderUploadBack()}
      {step === 5 && renderReview()}
      {step === 6 && renderSuccess()}

      {/* Privacy notice */}
      {step < 6 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-600">
                Your ID is encrypted and stored securely. It will only be used for identity verification and will not be visible to other users.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDVerificationFlow;
