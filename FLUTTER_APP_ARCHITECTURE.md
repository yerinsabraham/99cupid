# 99cupid Flutter Mobile App - Architecture Document

## 📱 Overview

This document outlines the complete architecture for building the 99cupid dating app as a native mobile application for iOS and Android using Flutter. The mobile app will maintain feature parity with the existing web application while adopting a modern mobile UI design inspired by the sample screenshots.

---

## 🎯 Key Principles

### Same Backend, New Frontend
- **Firebase Integration**: Use the same Firebase project (Auth, Firestore, Storage)
- **Data Models**: Maintain identical data structures and schemas
- **Business Logic**: Port existing services to Dart while keeping logic consistent
- **Real-time Features**: Preserve real-time chat, matches, and notifications

### Design Philosophy
- **UI Reference**: Modern mobile design inspired by sample screenshots (chat.jpg, chat2.jpg, favourite.jpg, profile.jpg)
- **Brand Consistency**: Use existing color theme (cupid-pink: #FF5FA8, deep-plum: #3D1A4D, warm-blush: #FCE8F1, soft-ivory: #FFF8FA)
- **Assets**: Reuse existing logo and brand assets
- **Mobile-First**: Native iOS/Android patterns and gestures

### Implementation Reference
**IMPORTANT**: When implementing any feature and you're unsure about the exact approach, logic, or data structure:
1. **Check the web version** (`/Users/apple/99cupid/src`) to see how it's implemented
2. **Replicate the same approach** in Flutter/Dart syntax
3. **Maintain identical Firebase endpoints** and data structures
4. **Use the same business logic** - just translate JavaScript to Dart
5. **Example**: If implementing swipe logic, check `/src/services/SwipeService.js` and convert it to Dart

This ensures consistency between web and mobile versions, allowing users to seamlessly switch between platforms with the same account.

---

## 🏗️ Project Structure

```
99cupid_mobile/
├── lib/
│   ├── main.dart                          # App entry point
│   ├── app.dart                           # Root app widget with routing
│   │
│   ├── core/                              # Core utilities & constants
│   │   ├── constants/
│   │   │   ├── app_colors.dart           # Color theme
│   │   │   ├── app_strings.dart          # Text constants
│   │   │   ├── app_assets.dart           # Asset paths
│   │   │   └── firebase_collections.dart # Firestore collection names
│   │   ├── config/
│   │   │   └── firebase_config.dart      # Firebase initialization
│   │   ├── errors/
│   │   │   └── exceptions.dart           # Custom exceptions
│   │   └── utils/
│   │       ├── validators.dart           # Form validation
│   │       ├── date_formatter.dart       # Date utilities
│   │       └── image_helper.dart         # Image processing
│   │
│   ├── data/                              # Data layer
│   │   ├── models/                        # Data models (identical to web)
│   │   │   ├── user_model.dart
│   │   │   ├── profile_model.dart
│   │   │   ├── swipe_model.dart
│   │   │   ├── match_model.dart
│   │   │   ├── message_model.dart
│   │   │   ├── chat_model.dart
│   │   │   └── subscription_model.dart
│   │   │
│   │   ├── repositories/                  # Data access layer
│   │   │   ├── auth_repository.dart
│   │   │   ├── user_repository.dart
│   │   │   ├── swipe_repository.dart
│   │   │   ├── match_repository.dart
│   │   │   ├── messaging_repository.dart
│   │   │   ├── storage_repository.dart
│   │   │   ├── subscription_repository.dart
│   │   │   └── analytics_repository.dart
│   │   │
│   │   └── services/                      # Port of existing services
│   │       ├── auth_service.dart
│   │       ├── matching_service.dart
│   │       ├── messaging_service.dart
│   │       ├── swipe_service.dart
│   │       ├── verification_service.dart
│   │       ├── payment_service.dart
│   │       ├── safety_service.dart
│   │       ├── block_report_service.dart
│   │       ├── admin_service.dart
│   │       └── analytics_service.dart
│   │
│   ├── presentation/                      # UI layer
│   │   ├── screens/                       # Full-screen pages
│   │   │   ├── auth/
│   │   │   │   ├── splash_screen.dart
│   │   │   │   ├── login_screen.dart
│   │   │   │   ├── signup_screen.dart
│   │   │   │   ├── forgot_password_screen.dart
│   │   │   │   └── email_verification_screen.dart
│   │   │   │
│   │   │   ├── onboarding/
│   │   │   │   ├── onboarding_flow_screen.dart
│   │   │   │   ├── welcome_screen.dart
│   │   │   │   ├── profile_setup_screen.dart
│   │   │   │   └── photo_upload_screen.dart
│   │   │   │
│   │   │   ├── main/
│   │   │   │   ├── main_screen.dart      # Bottom nav container
│   │   │   │   ├── home_screen.dart      # Swipe/discovery
│   │   │   │   ├── matches_screen.dart   # Likes & matches
│   │   │   │   ├── messages_screen.dart  # Chat list
│   │   │   │   └── profile_screen.dart   # User's profile
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── edit_profile_screen.dart
│   │   │   │   ├── view_profile_screen.dart  # View other user
│   │   │   │   └── settings_screen.dart
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   └── chat_screen.dart      # 1-on-1 messaging
│   │   │   │
│   │   │   ├── verification/
│   │   │   │   └── verification_screen.dart
│   │   │   │
│   │   │   ├── subscription/
│   │   │   │   └── subscription_screen.dart
│   │   │   │
│   │   │   ├── safety/
│   │   │   │   ├── safety_center_screen.dart
│   │   │   │   └── report_screen.dart
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── admin_panel_screen.dart
│   │   │       ├── analytics_dashboard_screen.dart
│   │   │       └── safety_moderation_screen.dart
│   │   │
│   │   ├── widgets/                       # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── app_button.dart
│   │   │   │   ├── app_text_field.dart
│   │   │   │   ├── loading_indicator.dart
│   │   │   │   ├── error_view.dart
│   │   │   │   ├── empty_state.dart
│   │   │   │   └── avatar_image.dart
│   │   │   │
│   │   │   ├── swipe/
│   │   │   │   ├── swipe_card.dart
│   │   │   │   ├── swipe_buttons.dart
│   │   │   │   └── profile_image_carousel.dart
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── message_bubble.dart
│   │   │   │   ├── chat_input.dart
│   │   │   │   └── chat_list_item.dart
│   │   │   │
│   │   │   └── profile/
│   │   │       ├── photo_grid.dart
│   │   │       ├── interest_chip.dart
│   │   │       └── verification_badge.dart
│   │   │
│   │   └── providers/                     # State management (Riverpod)
│   │       ├── auth_provider.dart
│   │       ├── user_provider.dart
│   │       ├── swipe_provider.dart
│   │       ├── match_provider.dart
│   │       ├── chat_provider.dart
│   │       └── theme_provider.dart
│   │
│   └── routes/
│       ├── app_router.dart                # GoRouter configuration
│       └── route_guards.dart              # Auth guards
│
├── assets/                                # Copied from web app
│   ├── images/
│   │   └── logo.png
│   ├── icons/
│   └── fonts/
│
├── android/                               # Android native code
├── ios/                                   # iOS native code
├── test/                                  # Unit & widget tests
├── integration_test/                      # Integration tests
│
├── pubspec.yaml                           # Dependencies
├── firebase.json                          # Firebase config (copied)
├── .env                                   # Environment variables
└── README.md
```

---

## 🔧 Technology Stack

### Core Framework
- **Flutter SDK**: 3.19+ (latest stable)
- **Dart**: 3.3+

### Firebase Services
```yaml
firebase_core: ^2.24.0
firebase_auth: ^4.16.0
firebase_firestore: ^4.14.0
firebase_storage: ^11.6.0
firebase_analytics: ^10.8.0
```

### State Management
```yaml
flutter_riverpod: ^2.4.0      # Modern state management
```

### Navigation
```yaml
go_router: ^13.0.0            # Declarative routing with deep links
```

### UI & Design
```yaml
google_fonts: ^6.1.0          # Typography
cached_network_image: ^3.3.0  # Image caching
flutter_svg: ^2.0.0           # SVG support
shimmer: ^3.0.0               # Loading skeletons
lottie: ^3.0.0                # Animations
```

### Features
```yaml
image_picker: ^1.0.0          # Photo selection
image_cropper: ^5.0.0         # Image editing
geolocator: ^11.0.0           # Location services
permission_handler: ^11.0.0   # Permissions
shared_preferences: ^2.2.0    # Local storage
flutter_dotenv: ^5.1.0        # Environment config
```

### Utilities
```yaml
intl: ^0.18.0                 # Date formatting
uuid: ^4.0.0                  # ID generation
timeago: ^3.6.0               # Relative time display
```

---

## 📊 Data Models (Port from Web)

All models will be ported from JavaScript to Dart, maintaining identical schemas:

### UserModel
```dart
class UserModel {
  final String uid;
  final String email;
  final String displayName;
  final String? photoURL;
  final List<String> photos;
  final String bio;
  final int? age;
  final String gender;
  final String location;
  final List<String> interests;
  final bool isVerifiedAccount;
  final bool isVerified;
  final bool profileSetupComplete;
  final bool hasActiveSubscription;
  final String subscriptionStatus;
  final DateTime? subscriptionStartDate;
  final DateTime? subscriptionEndDate;
  final List<String> blockedUsers;
  final List<String> blockedByUsers;
  final bool isAdmin;
  final String accountStatus;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime lastActiveAt;
}
```

### SwipeModel, MatchModel, MessageModel
Mirror existing web app models with proper Dart type safety.

---

## 🎨 UI/UX Design Approach

### Design Inspiration Sources
1. **Sample Screenshots** (in `/sample` folder):
   - Modern card-based layouts
   - Clean messaging interface
   - Profile view with photo carousel
   - Favorites/matches grid

2. **Brand Colors** (from existing web):
   ```dart
   class AppColors {
     static const Color cupidPink = Color(0xFFFF5FA8);
     static const Color deepPlum = Color(0xFF3D1A4D);
     static const Color warmBlush = Color(0xFFFCE8F1);
     static const Color softIvory = Color(0xFFFFF8FA);
   }
   ```

### Screen Designs

#### 1. Authentication Flow
- **Splash Screen**: Animated logo with gradient background
- **Login/Signup**: Minimalist forms with social auth options
- **Email Verification**: Clear status with resend option

#### 2. Onboarding
- **Welcome**: Swipeable intro screens
- **Profile Setup**: Step-by-step wizard (photos, bio, interests)
- **Permissions**: Location, notifications, camera access

#### 3. Main App (Bottom Navigation)
- **Home/Discovery**: Tinder-style swipe cards with smooth animations
- **Matches**: Grid view of mutual likes with "New" badges
- **Messages**: Chat list with unread indicators and last message preview
- **Profile**: User's own profile with edit option

#### 4. Detailed Screens
- **Chat Screen**: WhatsApp-style messaging with timestamps
- **Profile View**: Full-screen photo carousel, bio, interests, verification badge
- **Settings**: Account, privacy, notifications, subscription

---

## 🔐 Authentication & Security

### Firebase Auth Integration
```dart
class AuthService {
  final FirebaseAuth _auth;
  
  // Email/Password
  Future<UserCredential> signUp(String email, String password);
  Future<UserCredential> login(String email, String password);
  Future<void> sendEmailVerification();
  
  // Session management
  Stream<User?> get authStateChanges;
  Future<void> signOut();
}
```

### Route Guards
```dart
class AuthGuard extends GoRoute {
  @override
  FutureOr<String?> redirect(BuildContext context, GoRouterState state) {
    final authState = ref.read(authProvider);
    
    if (!authState.isAuthenticated) {
      return '/login';
    }
    
    if (!authState.user.profileSetupComplete) {
      return '/onboarding';
    }
    
    return null; // Allow access
  }
}
```

---

## 🔄 State Management Strategy

### Riverpod Architecture

```dart
// Auth Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authServiceProvider));
});

// User Profile Provider
final userProfileProvider = StreamProvider<UserModel?>((ref) {
  final userId = ref.watch(authProvider).user?.uid;
  if (userId == null) return Stream.value(null);
  return ref.read(userRepositoryProvider).getUserStream(userId);
});

// Swipe Stack Provider
final swipeStackProvider = FutureProvider<List<UserModel>>((ref) async {
  final userId = ref.watch(authProvider).user?.uid;
  return ref.read(matchingServiceProvider).getMatches(userId);
});
```

### Local State
- Use `ConsumerWidget` for reactive UI
- `StateProvider` for simple state (filters, selections)
- `StateNotifierProvider` for complex state (auth, profiles)
- `StreamProvider` for real-time Firestore data

---

## 💬 Real-Time Features

### Messaging (Firestore Streams)
```dart
class MessagingService {
  Stream<List<ChatModel>> getChatsStream(String userId) {
    return FirebaseFirestore.instance
      .collection('chats')
      .where('participants', arrayContains: userId)
      .orderBy('lastMessageAt', descending: true)
      .snapshots()
      .map((snapshot) => snapshot.docs
          .map((doc) => ChatModel.fromFirestore(doc))
          .toList());
  }
  
  Stream<List<MessageModel>> getMessagesStream(String chatId) {
    return FirebaseFirestore.instance
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', descending: true)
      .snapshots()
      .map((snapshot) => snapshot.docs
          .map((doc) => MessageModel.fromFirestore(doc))
          .toList());
  }
}
```

### Match Notifications
- Listen to `matches` collection for new matches
- Show in-app notification overlay
- Update matches screen in real-time

---

## 🎯 Core Services (Ported from Web)

### 1. MatchingService
```dart
class MatchingService {
  static const weights = {
    'location': 0.25,
    'interests': 0.20,
    'preferences': 0.20,
    'verification': 0.15,
    'activity': 0.10,
    'compatibility': 0.10,
  };
  
  Future<List<UserModel>> getMatches(String userId, {int limit = 50});
  double calculateCompatibilityScore(UserModel user, UserModel target);
}
```

### 2. SwipeService
```dart
class SwipeService {
  Future<void> recordSwipe(String userId, String targetId, SwipeDirection direction);
  Future<void> likeUser(String fromUserId, String toUserId);
  Future<bool> checkMutualLike(String userId, String targetId);
  Future<void> createMatch(String user1Id, String user2Id);
}
```

### 3. SafetyService
```dart
class SafetyService {
  Future<void> blockUser(String blockerId, String blockedId);
  Future<void> reportUser(String reporterId, String reportedId, String reason);
  Future<bool> isUserBlocked(String userId, String targetId);
}
```

### 4. SubscriptionService
```dart
class SubscriptionService {
  Future<void> initiatePurchase(String productId);
  Future<bool> hasActiveSubscription(String userId);
  Stream<SubscriptionStatus> subscriptionStatusStream(String userId);
}
```

---

## 🗺️ Navigation & Routing

### GoRouter Configuration
```dart
final router = GoRouter(
  initialLocation: '/splash',
  redirect: (context, state) {
    final authState = ref.read(authProvider);
    
    // Auth guards
    if (!authState.isAuthenticated && !_isAuthRoute(state.path)) {
      return '/login';
    }
    
    if (authState.isAuthenticated && !authState.user.profileSetupComplete) {
      return '/onboarding';
    }
    
    return null;
  },
  routes: [
    // Auth routes
    GoRoute(path: '/splash', builder: (context, state) => SplashScreen()),
    GoRoute(path: '/login', builder: (context, state) => LoginScreen()),
    GoRoute(path: '/signup', builder: (context, state) => SignupScreen()),
    
    // Main app (nested routes)
    ShellRoute(
      builder: (context, state, child) => MainScreen(child: child),
      routes: [
        GoRoute(path: '/home', builder: (context, state) => HomeScreen()),
        GoRoute(path: '/matches', builder: (context, state) => MatchesScreen()),
        GoRoute(path: '/messages', builder: (context, state) => MessagesScreen()),
        GoRoute(path: '/profile', builder: (context, state) => ProfileScreen()),
      ],
    ),
    
    // Detail screens
    GoRoute(path: '/chat/:chatId', builder: (context, state) {
      final chatId = state.params['chatId']!;
      return ChatScreen(chatId: chatId);
    }),
    
    GoRoute(path: '/profile/:userId', builder: (context, state) {
      final userId = state.params['userId']!;
      return ViewProfileScreen(userId: userId);
    }),
  ],
);
```

---

## 🎭 Animations & Gestures

### Swipe Cards
```dart
class SwipeCard extends StatelessWidget {
  // Use flutter_card_swiper or custom GestureDetector
  // Animations: scale, rotation, slide based on drag
  // Callbacks: onSwipeLeft, onSwipeRight, onSwipeUp
}
```

### Page Transitions
- Material page transitions for Android
- Cupertino page transitions for iOS
- Custom hero animations for profile photos

### Micro-interactions
- Button press feedback
- Like/match celebration animation (Lottie)
- Message send animation
- Pull-to-refresh

---

## 📱 Platform-Specific Features

### iOS
- Haptic feedback on swipes
- Native share sheet
- App Tracking Transparency prompt
- Sign in with Apple

### Android
- Material Design 3 components
- Adaptive icons
- Google Sign-In

### Push Notifications
- Firebase Cloud Messaging (FCM)
- Local notifications for matches
- Background message handling

---

## 🧪 Testing Strategy

### Unit Tests
- Models: `toJson()`, `fromJson()`, equality
- Services: Mock Firestore interactions
- Validators: Email, password, age validation

### Widget Tests
- Forms: Input validation, submission
- Cards: Swipe gestures, animations
- Lists: Rendering, scrolling

### Integration Tests
- Complete user flows:
  - Sign up → Onboarding → Home
  - Swipe → Match → Chat
  - Profile edit → Save

---

## 📦 Build & Deployment

### Development Setup
```bash
# 1. Create Flutter project
flutter create 99cupid_mobile
cd 99cupid_mobile

# 2. Add Firebase
flutterfire configure

# 3. Copy .env file
cp ../99cupid/.env .env

# 4. Run
flutter run
```

### Environment Configuration
```yaml
# .env
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Build Commands
```bash
# iOS
flutter build ios --release
# Upload to App Store Connect via Xcode

# Android
flutter build appbundle --release
# Upload to Google Play Console
```

---

## 🔄 Migration Checklist

### Phase 1: Project Setup
- [ ] Initialize Flutter project
- [ ] Configure Firebase (use existing project)
- [ ] Setup folder structure
- [ ] Copy assets (logo, icons)
- [ ] Define color theme
- [ ] Setup state management (Riverpod)
- [ ] Configure routing (GoRouter)

### Phase 2: Authentication
- [ ] Splash screen
- [ ] Login screen
- [ ] Signup screen
- [ ] Email verification
- [ ] Password reset
- [ ] Auth state management
- [ ] Route guards

### Phase 3: Onboarding
- [ ] Welcome screens
- [ ] Profile setup wizard
- [ ] Photo upload
- [ ] Interests selection
- [ ] Location permission

### Phase 4: Core Features
- [ ] Home/Discovery screen (swipe cards)
- [ ] Matches screen
- [ ] Messages screen (chat list)
- [ ] Profile screen
- [ ] Bottom navigation

### Phase 5: Detailed Features
- [ ] Chat screen (1-on-1 messaging)
- [ ] View profile screen
- [ ] Edit profile screen
- [ ] Settings screen
- [ ] Verification screen

### Phase 6: Advanced Features
- [ ] Matching algorithm
- [ ] Real-time notifications
- [ ] Subscription/payments
- [ ] Safety & reporting
- [ ] Block functionality
- [ ] Admin panel (optional)

### Phase 7: Polish & Testing
- [ ] Animations
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance optimization

### Phase 8: Deployment
- [ ] iOS app store submission
- [ ] Android Play Store submission
- [ ] App store assets (screenshots, description)
- [ ] Privacy policy & terms

---

## 🎨 UI Design Reference

Based on sample screenshots:

### Chat Interface (chat.jpg, chat2.jpg)
- Clean, modern messaging layout
- Message bubbles with timestamps
- Avatar images for participants
- Input field with attachment option
- Typing indicators

### Favorites/Matches (favourite.jpg)
- Grid layout for matched profiles
- Profile photos with names
- "New" or status indicators
- Tap to view full profile

### Profile View (profile.jpg)
- Full-screen photo carousel with dots indicator
- Name, age, location header
- Bio section
- Interests/tags as chips
- Action buttons (like, pass, message)

**Note**: Keep all existing brand colors; only adopt the layout and interaction patterns from samples.

---

## 🚀 Next Steps

1. **Review this architecture** - Provide feedback on structure, approach, and any missing features
2. **Create Flutter project** - Initialize with proper configuration
3. **Setup Firebase** - Use existing Firebase project, configure for mobile
4. **Begin implementation** - Start with authentication flow
5. **Iterate screen by screen** - Build incrementally, test frequently

---

## ❓ Questions for Clarification

1. **Payment Integration**: Should we use RevenueCat, Stripe mobile SDK, or in-app purchases?
2. **Analytics**: Google Analytics, Mixpanel, or Firebase Analytics only?
3. **Crash Reporting**: Firebase Crashlytics or Sentry?
4. **Deep Links**: Should the app support deep linking (e.g., share profile URLs)?
5. **Offline Support**: Should messages/profiles cache for offline viewing?
6. **Social Login**: Google, Apple, Facebook - which providers?
7. **Photo Editing**: Basic crop only, or filters/effects?
8. **Video Profiles**: Should we support video in profiles?
9. **Push Notifications**: Immediate priority or later phase?
10. **Admin Features**: Should mobile app include full admin panel?

---

## 📝 Notes

- All Firebase endpoints remain unchanged (same collections, same data structure)
- UI will be modern and mobile-optimized (inspired by samples)
- Brand identity (colors, logo) stays consistent
- Real-time features (chat, matches) work identically to web
- Code will be production-ready with proper error handling, loading states, and testing

---

## 📂 Project Locations

- **Web App**: `/Users/apple/99cupid/`
- **Flutter Mobile App**: `/Users/apple/99cupid_mobile/`
- **Setup Summary**: [FLUTTER_PROJECT_SETUP.md](./FLUTTER_PROJECT_SETUP.md)

---

**Ready to start implementation upon your approval!** 🚀
