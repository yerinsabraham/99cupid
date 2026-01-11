# 99cupid Mobile App

Flutter mobile application for 99cupid dating platform. Supports iOS and Android with full feature parity with the web version.

## 🚀 Quick Start

### Prerequisites
- Flutter SDK 3.10.1 or higher
- Dart 3.0 or higher
- Xcode (for iOS development)
- Android Studio (for Android development)

### Setup

1. **Install dependencies**
   ```bash
   flutter pub get
   ```

2. **Configure Firebase**
   
   Copy the `.env` file from the web app or create a new one:
   ```bash
   cp ../99cupid/.env .env
   ```
   
   Ensure all Firebase credentials are properly set:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

3. **Run the app**
   ```bash
   # For iOS
   flutter run -d ios
   
   # For Android
   flutter run -d android
   
   # For specific device
   flutter devices  # List available devices
   flutter run -d [device-id]
   ```

## 📁 Project Structure

```
lib/
├── core/                   # Core utilities
│   ├── constants/         # Colors, strings, assets
│   ├── config/            # Firebase configuration
│   └── utils/             # Helper functions
├── data/                  # Data layer
│   ├── models/            # Data models
│   ├── repositories/      # Data access
│   └── services/          # Business logic
├── presentation/          # UI layer
│   ├── screens/           # App screens
│   ├── widgets/           # Reusable widgets
│   └── providers/         # State management
└── routes/                # Navigation
```

## 🔥 Firebase Setup

This app uses the **same Firebase project** as the web version. Ensure:
- Firebase Authentication is enabled (Email/Password, Google)
- Firestore database is configured with proper rules
- Firebase Storage is set up for profile photos

## 🎨 Design

The mobile app maintains the same brand colors and identity:
- **Primary**: Cupid Pink (#FF5FA8)
- **Secondary**: Deep Plum (#3D1A4D)
- **Background**: Warm Blush (#FCE8F1) & Soft Ivory (#FFF8FA)

UI design inspired by modern dating apps with mobile-first approach.

## 📝 Development Notes

- Check the web app implementation (`/99cupid/src`) when unsure about features
- All Firebase collections and data structures match the web version
- Users can login with the same credentials on both web and mobile

## 🧪 Testing

```bash
# Run unit tests
flutter test

# Run integration tests
flutter test integration_test/
```

## 📦 Build

```bash
# iOS
flutter build ios --release

# Android
flutter build appbundle --release
```

## 📖 Architecture Documentation

See [FLUTTER_APP_ARCHITECTURE.md](../99cupid/FLUTTER_APP_ARCHITECTURE.md) for detailed architecture and implementation guide.
