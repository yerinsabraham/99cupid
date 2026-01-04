import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HeartLoader from './common/HeartLoader';

export default function ProtectedRoute({
  children,
  requireVerification = true,
  requireProfileSetup = false
}) {
  const { currentUser, userProfile, loading, authInitialized } = useAuth();

  // Wait for auth to be fully initialized
  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <HeartLoader text="Loading..." size="large" />
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    console.log('🚫 ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Wait for profile to load
  if (!userProfile) {
    console.log('⏳ ProtectedRoute - Waiting for profile to load');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <HeartLoader text="Loading profile..." size="large" />
      </div>
    );
  }

  // Require profile setup
  if (requireProfileSetup) {
    console.log('🔍 ProtectedRoute Check:', {
      uid: currentUser.uid,
      hasProfile: !!userProfile,
      profileSetupComplete: userProfile?.profileSetupComplete,
      requiresSetup: requireProfileSetup
    });
    
    if (!userProfile?.profileSetupComplete) {
      console.log('➡️ ProtectedRoute - Profile not complete, redirecting to onboarding');
      return <Navigate to="/onboarding" replace />;
    }
  }

  console.log('✅ ProtectedRoute - Access granted');
  return children;
}
