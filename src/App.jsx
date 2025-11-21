import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import HeartLoader from './components/common/HeartLoader';

// Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePageV2';
import MatchesPage from './pages/MatchesPageV2';
import MessagesPage from './pages/MessagesPageV2';
import ChatPage from './pages/ChatPage';
import VerificationPage from './pages/VerificationPage';

/**
 * AuthGuard - Redirects authenticated users away from auth pages
 */
function AuthGuard({ children }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <HeartLoader text="Loading..." size="large" />
      </div>
    );
  }

  if (currentUser) {
    // Check if profile setup is complete
    if (!userProfile?.profileSetupComplete) {
      return <Navigate to="/onboarding" replace />;
    }
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
      {/* Public Routes - Auth Pages (redirect if authenticated) */}
      <Route path="/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
      <Route path="/signup" element={<AuthGuard><SignUpPage /></AuthGuard>} />
      <Route path="/forgot-password" element={<AuthGuard><ForgotPasswordPage /></AuthGuard>} />

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

      {/* Profile Setup Placeholder (Milestone 2) */}
      <Route
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
      />

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
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
