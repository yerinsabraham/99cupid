# 99cupid - Dating App MVP

A modern, responsive dating app built with React, Firebase, and Tailwind CSS. Milestone 1 focuses on authentication, email verification, and onboarding.

## Features - Milestone 1

✅ User Registration & Sign Up
✅ Email Verification
✅ Login/Logout
✅ Password Reset
✅ Onboarding Screens
✅ Protected Routes
✅ Responsive Design
✅ Real-time Firebase Integration
✅ Secure Authentication with Firebase

## Tech Stack

- **Frontend**: React 18+, React Router v6
- **Styling**: Tailwind CSS
- **Backend**: Firebase Authentication & Firestore
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Storage**: Firebase Storage (for Milestone 2)

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── SignUpForm.jsx
│   │   ├── LoginForm.jsx
│   │   └── ForgotPasswordForm.jsx
│   ├── onboarding/        # Onboarding screens
│   │   ├── WelcomeScreen.jsx
│   │   ├── RealConnectionsScreen.jsx
│   │   └── AuthenticProfileScreen.jsx
│   ├── layout/
│   │   └── AuthLayout.jsx
│   └── ProtectedRoute.jsx
├── pages/                 # Page components
│   ├── LoginPage.jsx
│   ├── SignUpPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── EmailVerificationPage.jsx
│   ├── OnboardingPage.jsx
│   └── HomePage.jsx
├── contexts/
│   └── AuthContext.jsx    # Authentication context
├── hooks/
│   └── useAuth.js         # Auth hook
├── config/
│   └── firebase.js        # Firebase configuration
├── models/
│   └── UserModel.js       # User data model
├── utils/
│   └── validation.js      # Form validation
├── styles/
│   └── animations.css     # Custom animations
├── App.jsx                # Main routing
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Get your Firebase config from [Firebase Console](https://console.firebase.google.com/)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your Firebase credentials in `.env`:
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### 3. Configure Firebase Console

1. **Enable Authentication Methods**:
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password"

2. **Deploy Firestore Rules**:
   - Go to Firestore Database → Rules
   - Update with security rules from `firestore.rules`
   - Click Publish

3. **Configure Email Templates**:
   - Go to Authentication → Templates
   - Customize email verification template
   - Customize password reset template

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm run preview
```

## Firebase Security Rules

Place in Firebase Console > Firestore Database > Rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Testing Flows

### Sign Up Flow
1. Navigate to `/signup`
2. Enter valid name, email, and strong password
3. Receive verification email
4. Click verification link
5. Verify email in app

### Login Flow
1. Go to `/login`
2. Enter credentials
3. If verified → redirects to home
4. If not verified → redirects to verification page

### Password Reset
1. Click "Forgot Password" on login page
2. Enter email
3. Check inbox for reset link
4. Reset password on Firebase
5. Login with new password

### Onboarding Flow
1. After email verification
2. View welcome screen
3. Navigate through onboarding screens
4. Complete onboarding flow

## Responsive Design

- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px and above

All components are fully responsive and mobile-optimized.

## Performance

Target metrics for production:
- Page load time: < 2 seconds
- Time to interactive: < 3 seconds
- Lighthouse score: > 90

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Environment Variables

See `.env.example` for required environment variables.

**Never commit `.env` file to version control!**

## Available Routes

### Public Routes (Auth Pages)
- `/login` - Login page
- `/signup` - Sign up page
- `/forgot-password` - Password reset page

### Protected Routes (Require Authentication)
- `/verify-email` - Email verification page
- `/onboarding` - Onboarding screens
- `/home` - Home/dashboard page
- `/profile-setup` - Profile setup (Milestone 2)

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

3. Build the app:
   ```bash
   npm run build
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## Troubleshooting

### Firebase Connection Issues
- Verify `.env` file has correct credentials
- Check Firebase project is active
- Ensure billing is enabled

### Email Not Sending
- Check Firebase Authentication email templates are configured
- Verify sender email in Firebase Console
- Check spam folder

### Infinite Redirect Loop
- Clear browser cache
- Check `ProtectedRoute` logic
- Verify auth state is updating properly

## Milestone 2 Preview

Coming soon:
- Profile creation with photo upload
- User preferences
- Basic matching algorithm
- Messaging system
- Profile browsing

## Contributing

Follow these guidelines:
- Use meaningful commit messages
- Test before pushing
- Keep code clean and commented
- Follow React best practices
- Use Tailwind CSS for styling

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.

---

Built with ❤️ using React & Firebase
