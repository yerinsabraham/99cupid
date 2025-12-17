import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import { VerificationStatusCard } from '../components/verification/VerificationBadge';
import PhoneVerification from '../components/verification/PhoneVerification';
import PhotoVerificationFlow from '../components/verification/PhotoVerificationFlow';
import IDVerificationFlow from '../components/verification/IDVerificationFlow';
import VerificationService from '../services/VerificationService';
import { ArrowLeft } from 'lucide-react';

export default function VerificationPage() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [activeFlow, setActiveFlow] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerificationStatus();
  }, [currentUser]);

  const loadVerificationStatus = async () => {
    if (!currentUser) return;

    try {
      const result = await VerificationService.getUserVerificationStatus(currentUser.uid);
      if (result.success) {
        setVerificationStatus(result.verification);
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartVerification = (type) => {
    setActiveFlow(type);
  };

  const handleVerificationComplete = async (type) => {
    // Reload verification status
    await loadVerificationStatus();
    
    // Close the flow
    setActiveFlow(null);

    // Show success message (optional)
    console.log(`${type} verification completed!`);
  };

  const handleCloseFlow = () => {
    setActiveFlow(null);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading verification status...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Get Verified</h1>
              <p className="text-gray-600">Build trust and increase your visibility</p>
            </div>
          </div>
        </div>

        {/* Show active flow or status card */}
        {!activeFlow ? (
          <VerificationStatusCard 
            user={{ ...userProfile, verification: verificationStatus }}
            onStartVerification={handleStartVerification}
          />
        ) : (
          <div className="max-w-2xl mx-auto">
            {activeFlow === 'phone' && (
              <PhoneVerification
                onVerificationComplete={handleVerificationComplete}
                onClose={handleCloseFlow}
              />
            )}
            {activeFlow === 'photo' && (
              <PhotoVerificationFlow
                onVerificationComplete={handleVerificationComplete}
                onClose={handleCloseFlow}
              />
            )}
            {activeFlow === 'id' && (
              <IDVerificationFlow
                onVerificationComplete={handleVerificationComplete}
                onClose={handleCloseFlow}
              />
            )}
          </div>
        )}

        {/* Benefits Section */}
        {!activeFlow && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Verification Benefits</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Build Trust</p>
                  <p className="text-sm text-gray-600">Show others you're a real person</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">3x More Matches</p>
                  <p className="text-sm text-gray-600">Verified profiles get more attention</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Higher Visibility</p>
                  <p className="text-sm text-gray-600">Appear first in search results</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Premium Features</p>
                  <p className="text-sm text-gray-600">Unlock exclusive features</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
