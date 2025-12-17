import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import VerificationService from '../../services/VerificationService';

const PhoneVerification = ({ onVerificationComplete, onClose }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(''); // For testing only
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as: +63 XXX XXX XXXX (Philippine format)
    if (digits.startsWith('63')) {
      const formatted = digits.slice(0, 12);
      if (formatted.length <= 2) return `+${formatted}`;
      if (formatted.length <= 5) return `+${formatted.slice(0, 2)} ${formatted.slice(2)}`;
      if (formatted.length <= 8) return `+${formatted.slice(0, 2)} ${formatted.slice(2, 5)} ${formatted.slice(5)}`;
      return `+${formatted.slice(0, 2)} ${formatted.slice(2, 5)} ${formatted.slice(5, 8)} ${formatted.slice(8)}`;
    }
    
    // Default format
    return `+${digits.slice(0, 15)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const validatePhoneNumber = (phone) => {
    // Remove formatting
    const digits = phone.replace(/\D/g, '');
    
    // Philippine format: +63XXXXXXXXXX (10 digits after country code)
    if (digits.startsWith('63')) {
      return digits.length === 12;
    }
    
    // General validation: at least 10 digits
    return digits.length >= 10;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send OTP
      const result = await VerificationService.sendOTP(phoneNumber);
      
      if (result.success) {
        // For testing: store the OTP (remove in production)
        setGeneratedOtp(result.otp);
        
        // Submit verification request
        const submitResult = await VerificationService.submitPhoneVerification(
          currentUser.uid,
          phoneNumber,
          result.otp
        );

        if (submitResult.success) {
          setSuccess('OTP sent successfully! Check your messages.');
          setStep(2);
          setCountdown(60); // 60 seconds before resend
        } else {
          setError(submitResult.error || 'Failed to submit verification');
        }
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await VerificationService.verifyPhoneOTP(
        currentUser.uid,
        phoneNumber,
        otp
      );

      if (result.success) {
        setSuccess('Phone verified successfully! ✓');
        setTimeout(() => {
          if (onVerificationComplete) {
            onVerificationComplete('phone');
          }
        }, 1500);
      } else {
        setError(result.error || 'Invalid code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await VerificationService.sendOTP(phoneNumber);
      
      if (result.success) {
        setGeneratedOtp(result.otp); // For testing
        setSuccess('OTP resent successfully!');
        setCountdown(60);
      } else {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 ? 'Verify Your Phone' : 'Enter Verification Code'}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <p className="text-gray-600">
          {step === 1 
            ? 'Get verified to build trust with other users'
            : `We sent a 6-digit code to ${phoneNumber}`
          }
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
          1
        </div>
        <div className={`flex-1 h-1 ${step >= 2 ? 'bg-pink-500' : 'bg-gray-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
          2
        </div>
      </div>

      {/* Step 1: Enter phone number */}
      {step === 1 && (
        <form onSubmit={handleSendOTP}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="+63 XXX XXX XXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              We'll send you a verification code via SMS
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>

          {/* Testing helper - remove in production */}
          {generatedOtp && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Testing Mode:</strong> OTP is {generatedOtp}
              </p>
            </div>
          )}
        </form>
      )}

      {/* Step 2: Enter OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={countdown > 0 || loading}
              className="text-pink-500 hover:text-pink-600 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {countdown > 0 
                ? `Resend code in ${countdown}s` 
                : 'Resend code'
              }
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setError('');
                setSuccess('');
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Change phone number
            </button>
          </div>

          {/* Testing helper - remove in production */}
          {generatedOtp && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Testing Mode:</strong> OTP is {generatedOtp}
              </p>
            </div>
          )}
        </form>
      )}

      {/* Security notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-gray-600">
              Your phone number is kept private and secure. We use it only for verification purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
