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
      {/* PRE-LAUNCH: Landing Page as Main Entry Point */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      
      {/* Coming Soon Page (not used currently) */}
      {/* <Route path="/coming-soon" element={<ComingSoonPage />} /> */}
      
      {/* PUBLIC LOGIN ROUTES - Available for all users */}
      <Route path="/admin-login" element={<AuthGuard><LoginPage /></AuthGuard>} />
      <Route path="/admin-signup" element={<AuthGuard><SignUpPage /></AuthGuard>} />
      <Route path="/forgot-password" element={<AuthGuard><ForgotPasswordPage /></AuthGuard>} />
      
      {/* ALL OTHER ROUTES DISABLED FOR PRE-LAUNCH */}
      {/* WHEN READY TO LAUNCH: Uncomment these routes and change "/" to redirect to /login */}
      {/* Public Routes - Auth Pages (redirect if authenticated) */}
      {/* <Route path="/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
      <Route path="/signup" element={<AuthGuard><SignUpPage /></AuthGuard>} /> */}

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
