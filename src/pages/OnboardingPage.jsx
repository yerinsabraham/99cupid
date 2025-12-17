import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import WelcomeScreen from '../components/onboarding/WelcomeScreen';
import BasicInfoStep from '../components/onboarding/BasicInfoStep';
import PreferencesStep from '../components/onboarding/PreferencesStep';
import InterestsStep from '../components/onboarding/InterestsStep';
import PhotoUploadStepV2 from '../components/onboarding/PhotoUploadStepV2';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    dateOfBirth: '',
    gender: '',
    lookingFor: '',
    location: '',
    bio: '',
    interests: [],
    photos: []
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();

  const updateOnboardingData = (data) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Calculate age from date of birth
      const birthDate = new Date(onboardingData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      const profileData = {
        ...onboardingData,
        age,
        profileSetupComplete: true,
        updatedAt: new Date().toISOString()
      };

      console.log('Saving onboarding data with profileSetupComplete:', profileData);
      await setDoc(doc(db, 'users', currentUser.uid), profileData, { merge: true });

      // Verify it was saved
      const verifyDoc = await getDoc(doc(db, 'users', currentUser.uid));
      console.log('Verified profile after save:', verifyDoc.data());

      // Update the context to reflect the completed profile
      await updateUserProfile({ profileSetupComplete: true });

      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    <WelcomeScreen 
      key="welcome" 
      onNext={() => setCurrentStep(1)} 
    />,
    <BasicInfoStep
      key="basic"
      data={onboardingData}
      onUpdate={updateOnboardingData}
      onNext={() => setCurrentStep(2)}
      onBack={() => setCurrentStep(0)}
    />,
    <PreferencesStep
      key="preferences"
      data={onboardingData}
      onUpdate={updateOnboardingData}
      onNext={() => setCurrentStep(3)}
      onBack={() => setCurrentStep(1)}
    />,
    <InterestsStep
      key="interests"
      data={onboardingData}
      onUpdate={updateOnboardingData}
      onNext={() => setCurrentStep(4)}
      onBack={() => setCurrentStep(2)}
    />,
    <PhotoUploadStepV2
      key="photos"
      data={onboardingData}
      onUpdate={updateOnboardingData}
      onNext={saveProfile}
      onBack={() => setCurrentStep(3)}
      loading={loading}
    />
  ];

  return (
    <div className="min-h-screen">
      {steps[currentStep]}

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-50">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-8 bg-pink-600'
                : index < currentStep
                ? 'w-2 bg-pink-400'
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
