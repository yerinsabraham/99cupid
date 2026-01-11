import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../presentation/screens/auth/splash_screen.dart';
import '../presentation/screens/auth/login_screen.dart';
import '../presentation/screens/auth/signup_screen.dart';
import '../presentation/screens/onboarding/profile_setup_screen.dart';
import '../presentation/screens/onboarding/photo_upload_screen.dart';
import '../presentation/screens/onboarding/interests_screen.dart';
import '../presentation/screens/main/main_screen.dart';
import '../presentation/screens/chat/chat_screen.dart';
import '../presentation/screens/settings/settings_screen.dart';
import '../presentation/screens/settings/edit_profile_screen.dart';
import '../presentation/screens/settings/blocked_users_screen.dart';
import '../presentation/screens/verification/verification_screen.dart';
import '../presentation/screens/admin/admin_dashboard_screen.dart';
import '../presentation/screens/profile/user_profile_screen.dart';
import '../presentation/providers/auth_provider.dart';

/// GoRouter configuration with authentication guards
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(firebaseUserProvider);
  final userProfile = ref.watch(userProfileProvider);
  
  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      // Don't redirect if on splash screen - let it handle navigation
      if (state.matchedLocation == '/splash') {
        return null;
      }
      
      final isLoading = authState.isLoading || userProfile.isLoading;
      final user = authState.value;
      final profile = userProfile.value;
      
      // If still loading and not on splash, wait
      if (isLoading) {
        return null;
      }
      
      final isAuthenticated = user != null;
      final isOnAuthPage = state.matchedLocation.startsWith('/login') ||
          state.matchedLocation.startsWith('/signup');
      final isOnOnboarding = state.matchedLocation.startsWith('/onboarding');
      final profileComplete = profile?.profileSetupComplete ?? false;
      
      // If not authenticated and trying to access protected route
      if (!isAuthenticated && !isOnAuthPage) {
        return '/login';
      }
      
      // If authenticated but profile incomplete, redirect to onboarding
      if (isAuthenticated && !profileComplete && !isOnOnboarding && !isOnAuthPage) {
        return '/onboarding/setup';
      }
      
      // If authenticated with complete profile and on auth/onboarding page, go to home
      if (isAuthenticated && profileComplete && (isOnAuthPage || isOnOnboarding)) {
        return '/home';
      }
      
      // No redirect needed
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignUpScreen(),
      ),
      GoRoute(
        path: '/onboarding/setup',
        builder: (context, state) => const ProfileSetupScreen(),
      ),
      GoRoute(
        path: '/onboarding/photos',
        builder: (context, state) => const PhotoUploadScreen(),
      ),
      GoRoute(
        path: '/onboarding/interests',
        builder: (context, state) => const InterestsScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const MainScreen(),
      ),
      GoRoute(
        path: '/chat/:chatId',
        builder: (context, state) {
          final chatId = state.pathParameters['chatId'] ?? '';
          return ChatScreen(chatId: chatId);
        },
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/edit-profile',
        builder: (context, state) => const EditProfileScreen(),
      ),
      GoRoute(
        path: '/blocked-users',
        builder: (context, state) => const BlockedUsersScreen(),
      ),
      GoRoute(
        path: '/verification',
        builder: (context, state) => const VerificationScreen(),
      ),
      GoRoute(
        path: '/admin',
        builder: (context, state) => const AdminDashboardScreen(),
      ),
      GoRoute(
        path: '/user/:userId',
        builder: (context, state) {
          final userId = state.pathParameters['userId'] ?? '';
          return UserProfileScreen(userId: userId);
        },
      ),
    ],
  );
});
