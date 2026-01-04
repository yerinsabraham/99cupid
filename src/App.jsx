import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import HeartLoader from './components/common/HeartLoader';

// Pages
import ComingSoonPage from './pages/ComingSoonPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePageV2';
import EditProfilePage from './pages/EditProfilePage';
import MatchesPage from './pages/MatchesPageV2';
import MessagesPage from './pages/MessagesPageV2';
import ChatPage from './pages/ChatPage';
import VerificationPage from './pages/VerificationPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import SafetyCenterPage from './pages/SafetyCenterPage';
import SafetyModerationPage from './pages/SafetyModerationPage';
import SettingsPage from './pages/SettingsPage';

/**
 * AuthGuard - Redirects authenticated users away from auth pages
 */
function AuthGuard({ children }) {
  const { currentUser, userProfile, loading, authInitialized } = useAuth();

  // Wait for auth to be fully initialized
  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <HeartLoader text="Loading..." size="large" />
      </div>
    );
  }

  if (currentUser) {
    // Debug log to see what we have
    console.log('🔍 AuthGuard Check:', {
      uid: currentUser.uid,
      email: currentUser.email,
      hasUserProfile: !!userProfile,
      profileSetupComplete: userProfile?.profileSetupComplete,
      isAdmin: userProfile?.isAdmin
    });
    
    // Wait for profile to load before deciding
    if (!userProfile) {
      console.log('⏳ AuthGuard - Waiting for profile to load');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
          <HeartLoader text="Loading profile..." size="large" />
        </div>
      );
    }
    
    // Check if profile setup is complete (explicit check for true/false)
    const isProfileComplete = userProfile?.profileSetupComplete === true;
    
    if (!isProfileComplete) {
      console.log('➡️ AuthGuard - Profile incomplete, redirecting to onboarding');
      return <Navigate to="/onboarding" replace />;
    }
    
    console.log('➡️ AuthGuard - Profile complete, redirecting to home');
    return <Navigate to="/home" replace />;
  }

  return children;
}

/**
 * AppRoutes - Main application router configuration
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Main App - Login as default entry point */}
      <Route path="/" element={<AuthGuard><LoginPage /></AuthGuard>} />
      <Route path="/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
      <Route path="/signup" element={<AuthGuard><SignUpPage /></AuthGuard>} />
      <Route path="/forgot-password" element={<AuthGuard><ForgotPasswordPage /></AuthGuard>} />
      
      {/* Landing Page - Hidden for now, accessible via direct URL */}
      <Route path="/landing" element={<LandingPage />} />
      
      {/* Legacy admin routes - redirect to main routes */}
      <Route path="/admin-login" element={<Navigate to="/login" replace />} />
      <Route path="/admin-signup" element={<Navigate to="/signup" replace />} />

      {/* Onboarding Route */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={false}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Require Profile Setup */}
      <Route
        path="/home"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <HomePage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <EditProfilePage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/matches"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <MatchesPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/messages"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/chat/:chatId"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/verification"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <VerificationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/subscription"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <SubscriptionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <AdminPanelPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <AnalyticsDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/safety"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <SafetyCenterPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/safety-moderation"
        element={
          <ProtectedRoute requireVerification={false} requireProfileSetup={true}>
            <SafetyModerationPage />
          </ProtectedRoute>
        }
      />

      {/* Profile Setup Placeholder (Milestone 2) */}
      {/* <Route
        path="/profile-setup"
        element={
          <ProtectedRoute requireVerification={true}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="text-center bg-white p-8 rounded-3xl shadow-2xl max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Setup</h1>
                <p className="text-gray-600 mb-6">Coming in Milestone 2</p>
                <div className="bg-pink-50 border-2 border-pink-200 p-4 rounded-xl">
                  <p className="text-sm text-pink-700">
                    Complete your profile, add photos, and share your interests!
                  </p>
                </div>
              </div>
            </div>
          </ProtectedRoute>
        }
      /> */}

      {/* Default Routes - Redirect all unknown paths to Coming Soon */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * App - Main application component with routing and authentication
 */
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
