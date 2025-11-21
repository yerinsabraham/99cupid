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
  if (requireProfileSetup && !userProfile?.profileSetupComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
