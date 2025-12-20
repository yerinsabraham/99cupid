import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HeartLoader from './common/HeartLoader';

export default function ProtectedRoute({
  children,
  requireVerification = true,
  requireProfileSetup = false
}) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <HeartLoader text="Loading..." size="large" />
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Require profile setup
  if (requireProfileSetup) {
    console.log('ProtectedRoute - userProfile:', userProfile);
    console.log('ProtectedRoute - profileSetupComplete:', userProfile?.profileSetupComplete);
    
    if (!userProfile?.profileSetupComplete) {
      console.log('ProtectedRoute - Redirecting to onboarding');
      return <Navigate to="/onboarding" replace />;
    }
  }

  return children;
}
