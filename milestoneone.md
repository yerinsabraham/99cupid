MILESTONE 1: COMPLETE IMPLEMENTATION GUIDE FOR AI DEV
PROJECT OVERVIEW
You are building 99cupid - a dating app MVP with authentication, onboarding, and Firebase backend. This is a React web app that must work on both desktop and mobile browsers.

PRE-FLIGHT CHECKLIST
CRITICAL: Before starting, verify the following files exist in the root folder:

Firebase Configuration Files:

firebase.json or Firebase config object
Google Service JSON file (serviceAccountKey.json or similar)
Firebase project credentials


Verify Firebase Project Setup:

Confirm Firebase project is created and accessible
Note: Google Sign-in authentication will need to be enabled in Firebase Console manually
Email/Password authentication will need to be enabled in Firebase Console



Action: List all files in the root directory and confirm these exist before proceeding.

TECH STACK FOR MILESTONE 1

Frontend: React 18+ with Hooks
Styling: Tailwind CSS (utility classes only)
Backend: Firebase Authentication, Firestore Database
Routing: React Router v6
Icons: Lucide React
Animations: CSS transitions and Tailwind animations


PROJECT STRUCTURE
Create the following folder structure in the root:
/src
  /components
    /auth
      - LoginForm.jsx
      - SignUpForm.jsx
      - ForgotPasswordForm.jsx
    /onboarding
      - WelcomeScreen.jsx
      - RealConnectionsScreen.jsx
      - AuthenticProfileScreen.jsx
    /layout
      - AuthLayout.jsx
      - AppLayout.jsx
  /contexts
    - AuthContext.jsx
  /hooks
    - useAuth.js
  /config
    - firebase.js
  /utils
    - validation.js
  /pages
    - LoginPage.jsx
    - SignUpPage.jsx
    - ForgotPasswordPage.jsx
    - EmailVerificationPage.jsx
    - OnboardingPage.jsx
    - HomePage.jsx (placeholder)
  /styles
    - animations.css
  App.jsx
  main.jsx

STEP-BY-STEP IMPLEMENTATION
TASK 1: Firebase Configuration
File: /src/config/firebase.js
javascriptimport { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with actual Firebase config from the root folder files
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
Action: Extract Firebase config from the existing root folder files and populate this.

TASK 2: User Data Model
File: /src/models/UserModel.js
javascriptexport class UserModel {
  constructor(data = {}) {
    this.uid = data.uid || '';
    this.email = data.email || '';
    this.displayName = data.displayName || '';
    this.isVerifiedAccount = data.isVerifiedAccount || false;
    this.profileSetupComplete = data.profileSetupComplete || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toFirestore() {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      isVerifiedAccount: this.isVerifiedAccount,
      profileSetupComplete: this.profileSetupComplete,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromFirestore(doc) {
    return new UserModel(doc.data());
  }
}

TASK 3: Validation Utilities
File: /src/utils/validation.js
javascriptexport const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, message: 'Email is required' };
  if (!emailRegex.test(email)) return { valid: false, message: 'Please enter a valid email address' };
  return { valid: true };
};

export const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain at least one number' };
  return { valid: true };
};

export const validateDisplayName = (name) => {
  if (!name) return { valid: false, message: 'Name is required' };
  if (name.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
  if (name.length > 50) return { valid: false, message: 'Name must be less than 50 characters' };
  return { valid: true };
};

TASK 4: Authentication Context
File: /src/contexts/AuthContext.jsx
javascriptimport { createContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserModel } from '../models/UserModel';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up new user
  const signUp = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Create user profile in Firestore
      const newUser = new UserModel({
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        isVerifiedAccount: false,
        profileSetupComplete: false
      });

      await setDoc(doc(db, 'users', user.uid), newUser.toFirestore());

      return { success: true, message: 'Account created! Please check your email to verify your account.' };
    } catch (error) {
      return handleAuthError(error);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return handleAuthError(error);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent! Check your inbox.' };
    } catch (error) {
      return handleAuthError(error);
    }
  };

  // Resend verification email
  const resendVerification = async () => {
    try {
      if (currentUser) {
        await sendEmailVerification(currentUser);
        return { success: true, message: 'Verification email sent!' };
      }
      return { success: false, message: 'No user logged in' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Handle auth errors
  const handleAuthError = (error) => {
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered. Please login instead.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection.';
        break;
    }

    return { success: false, message };
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(UserModel.fromFirestore(userDoc));
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signUp,
    login,
    logout,
    resetPassword,
    resendVerification,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

TASK 5: Custom Hook
File: /src/hooks/useAuth.js
javascriptimport { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

TASK 6: Sign Up Form Component
File: /src/components/auth/SignUpForm.jsx
javascriptimport { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateDisplayName } from '../../utils/validation';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateDisplayName(formData.displayName);
    if (!nameValidation.valid) newErrors.displayName = nameValidation.message;

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) newErrors.email = emailValidation.message;

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) newErrors.password = passwordValidation.message;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) return;

    setLoading(true);
    const result = await signUp(formData.email, formData.password, formData.displayName);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => navigate('/verify-email'), 2000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border ${errors.displayName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="Enter your name"
            />
          </div>
          {errors.displayName && <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-11 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-11 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}

TASK 7: Login Form Component
File: /src/components/auth/LoginForm.jsx
javascriptimport { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) newErrors.email = emailValidation.message;

    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) return;

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (!result.success) {
      setMessage({ type: 'error', text: result.message });
    }
    // Navigation is handled by AuthContext and routing logic
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-11 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className="p-4 rounded-xl bg-red-50 text-red-800">
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
          >
            Create Account
          </button>
        </p>
      </form>
    </div>
  );
}

TASK 8: Forgot Password Form
File: /src/components/auth/ForgotPasswordForm.jsx
javascriptimport { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage({ type: '', text: '' });

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.message);
      return;
    }

    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setEmail('');
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={() => navigate('/login')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Login
      </button>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={`w-full pl-11 pr-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}

TASK 9: Onboarding Screens
File: /src/components/onboarding/WelcomeScreen.jsx
javascriptimport { Heart } from 'lucide-react';

export default function WelcomeScreen({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-800">
            Welcome to <span className="text-pink-600">99cupid</span>
          </h1>
          <p className="text-xl text-gray-600">
            Where real connections begin at just $0.99/month
          </p>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
**File: `/src/components/onboRetryYAContinueFile: /src/components/onboarding/RealConnectionsScreen.jsx
javascriptimport { Users, MessageCircle, Shield } from 'lucide-react';

export default function RealConnectionsScreen({ onNext, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">Real Connections</h2>
          <p className="text-lg text-gray-600">
            No fake profiles. No endless scrolling. Just authentic people looking for genuine connections.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Real People</h3>
              <p className="text-gray-600 text-sm">Verified members only. No bots, no catfish.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Meaningful Chats</h3>
              <p className="text-gray-600 text-sm">Quality conversations with people who actually reply.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">Your privacy matters. Report and block features available.</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="w-1/3 border-2 border-pink-500 text-pink-600 py-4 rounded-2xl font-semibold hover:bg-pink-50 transition-all duration-300"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="w-2/3 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
File: /src/components/onboarding/AuthenticProfileScreen.jsx
javascriptimport { CheckCircle, Image, Award } from 'lucide-react';

export default function AuthenticProfileScreen({ onNext, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">Be Your Authentic Self</h2>
          <p className="text-lg text-gray-600">
            Create a profile that shows the real you. Honesty is attractive!
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Upload Real Photos</h3>
              <p className="text-gray-600 text-sm">Show your genuine smile. No filters needed.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Get Verified</h3>
              <p className="text-gray-600 text-sm">Optional verification badge to stand out.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Founding Member</h3>
              <p className="text-gray-600 text-sm">Join early and get exclusive founding member badge.</p>
            </div>
          </div>
        </div>

        <div className="bg-pink-50 border-2 border-pink-200 p-4 rounded-2xl">
          <p className="text-center text-gray-700 text-sm">
            💝 <span className="font-semibold">Special Offer:</span> First month at just <span className="text-pink-600 font-bold">$0.99</span>
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="w-1/3 border-2 border-pink-500 text-pink-600 py-4 rounded-2xl font-semibold hover:bg-pink-50 transition-all duration-300"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="w-2/3 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Create Profile
          </button>
        </div>
      </div>
    </div>
  );
}

TASK 10: Email Verification Page
File: /src/pages/EmailVerificationPage.jsx
javascriptimport { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function EmailVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { currentUser, resendVerification, logout } = useAuth();
  const navigate = useNavigate();

  const handleResend = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    const result = await resendVerification();
    
    setLoading(false);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCheckVerification = async () => {
    await currentUser.reload();
    if (currentUser.emailVerified) {
      window.location.reload(); // Force reload to update auth state
    } else {
      setMessage({
        type: 'error',
        text: 'Email not verified yet. Please check your inbox and click the verification link.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-pink-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
          
          <p className="text-gray-600">
            We've sent a verification email to:
          </p>
          <p className="text-pink-600 font-semibold">{currentUser?.email}</p>
          
          <p className="text-sm text-gray-500">
            Please check your inbox and click the verification link to continue.
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCheckVerification}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            I've Verified My Email
          </button>

          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full border-2 border-pink-500 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Sending...' : 'Resend Email'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> Check your spam folder if you don't see the email within a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

TASK 11: Onboarding Page (Container)
File: /src/pages/OnboardingPage.jsx
javascriptimport { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeScreen from '../components/onboarding/WelcomeScreen';
import RealConnectionsScreen from '../components/onboarding/RealConnectionsScreen';
import AuthenticProfileScreen from '../components/onboarding/AuthenticProfileScreen';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const screens = [
    <WelcomeScreen key="welcome" onNext={() => setCurrentStep(1)} />,
    <RealConnectionsScreen 
      key="connections" 
      onNext={() => setCurrentStep(2)} 
      onBack={() => setCurrentStep(0)}
    />,
    <AuthenticProfileScreen 
      key="authentic" 
      onNext={() => navigate('/profile-setup')} 
      onBack={() => setCurrentStep(1)}
    />
  ];

  return (
    <div className="min-h-screen">
      {screens[currentStep]}
      
      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {screens.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep 
                ? 'w-8 bg-pink-600' 
                : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

TASK 12: Auth Layout
File: /src/components/layout/AuthLayout.jsx
javascriptimport { Heart } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              <span className="text-pink-600">99</span>cupid
            </h1>
            {title && <h2 className="text-2xl font-semibold text-gray-700 mt-2">{title}</h2>}
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Real connections at just $0.99/month
        </p>
      </div>
    </div>
  );
}

TASK 13: Pages Implementation
File: /src/pages/LoginPage.jsx
javascriptimport AuthLayout from '../components/layout/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue your journey"
    >
      <LoginForm />
    </AuthLayout>
  );
}
File: /src/pages/SignUpPage.jsx
javascriptimport AuthLayout from '../components/layout/AuthLayout';
import SignUpForm from '../components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthLayout 
      title="Join 99cupid" 
      subtitle="Start your journey to real connections"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
File: /src/pages/ForgotPasswordPage.jsx
javascriptimport AuthLayout from '../components/layout/AuthLayout';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="We'll send you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
File: /src/pages/HomePage.jsx
javascriptimport { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function HomePage() {
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {userProfile?.displayName || 'User'}! 🎉
              </h1>
              <p className="text-gray-600 mt-2">Email: {currentUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">
              ✅ Milestone 1 Complete!
            </h2>
            <p className="text-green-700">
              Authentication system is working perfectly. Ready for Milestone 2!
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Account Status:</span> Verified ✓
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Profile Setup:</span> Pending (Milestone 2)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TASK 14: Protected Route Component
File: /src/components/ProtectedRoute.jsx
javascriptimport { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requireVerification = true, requireProfileSetup = false }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Require email verification
  if (requireVerification && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Require profile setup (for Milestone 2+)
  if (requireProfileSetup && !userProfile?.profileSetupComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

TASK 15: App Router Configuration
File: /src/App.jsx
javascriptimport { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';

// Auth Guard for redirecting logged-in users
function AuthGuard({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, check verification and redirect accordingly
  if (currentUser) {
    if (!currentUser.emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes (redirect if authenticated) */}
      <Route path="/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
      <Route path="/signup" element={<AuthGuard><SignUpPage /></AuthGuard>} />
      <Route path="/forgot-password" element={<AuthGuard><ForgotPasswordPage /></AuthGuard>} />

      {/* Email Verification (requires auth but not verification) */}
      <Route 
        path="/verify-email" 
        element={
          <ProtectedRoute requireVerification={false}>
            <EmailVerificationPage />
          </ProtectedRoute>
        } 
      />

      {/* Onboarding (requires auth and verification) */}
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute requireVerification={true}>
            <OnboardingPage />
          </ProtectedRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute requireVerification={true}>
            <HomePage />
          </ProtectedRoute>
        } 
      />

      {/* Placeholder for profile setup (Milestone 2) */}
      <Route 
        path="/profile-setup" 
        element={
          <ProtectedRoute requireVerification={true}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="text-center bg-white p-8 rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Setup</h1>
                <p className="text-gray-600">Coming in Milestone 2</p>
              </div>
            </div>
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

TASK 16: Animation Styles
File: /src/styles/animations.css
css/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* Slow Bounce */
@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounceSlow 2s ease-in-out infinite;
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse 3s ease-in-out infinite;
}

/* Slide In From Left */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slideInLeft 0.5s ease-out;
}

/* Slide In From Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.5s ease-out;
}

TASK 17: Main Entry Point
File: /src/main.jsx
javascriptimport React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

TASK 18: Tailwind Configuration
File: tailwind.config.js
javascript/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cupid-pink': '#FF5FA8',
        'deep-plum': '#3D1A4D',
        'warm-blush': '#FCE8F1',
        'soft-ivory': '#FFF8FA',
        'mint-accent': '#A0ODBC8',
      },
      animation: {
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
```

---

### **TASK 19: Firebase Security Rules (Firestore)**

**File: `firestore.rules`** (to be uploaded to Firebase Console)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can create their own document on signup
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their own document
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // No one can delete user documents (admin only via Functions)
      allow delete: if false;
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

TASK 20: Package.json Dependencies
File: package.json (ensure these dependencies are installed)
json{
  "name": "99cupid",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "firebase": "^10.8.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.0"
  }
}

TESTING CHECKLIST
After implementation, test the following flows:
Test 1: Sign Up Flow

Navigate to /signup
Try submitting with invalid email → should show error
Try weak password → should show validation error
Try mismatched passwords → should show error
Submit valid form → should create account and send verification email
Check that user is redirected to /verify-email

Test 2: Email Verification
1RetryYACOntinue. No need to write full code, just design instructions, implementation and bullet pointsTESTING CHECKLIST (Continued)
Test 2: Email Verification

Check email inbox for verification link
Click verification link from email
Return to app and click "I've Verified My Email"
Should redirect to onboarding screens
Test "Resend Email" button functionality
Test logout from verification page

Test 3: Login Flow

Navigate to /login
Try invalid email format → should show error
Try wrong password → should show error message
Try unregistered email → should show "account not found"
Login with valid credentials → should redirect based on verification status
If not verified → redirect to /verify-email
If verified → redirect to onboarding or home

Test 4: Password Reset

Click "Forgot Password" from login page
Enter invalid email → should show validation error
Enter valid email → should send reset email
Check inbox for password reset link
Click link and reset password in Firebase
Login with new password

Test 5: Onboarding Flow

After verification, should see Welcome screen
Click "Get Started" → should show Real Connections screen
Click "Back" → should return to Welcome
Click "Continue" → should show Authentic Profile screen
Progress indicators at bottom should update
Click "Create Profile" → should redirect to profile setup placeholder

Test 6: Navigation Guards

Try accessing /home without login → redirect to login
Try accessing /home without verification → redirect to verify email
Try accessing /login while logged in → redirect to home
Test browser back button behavior
Test page refresh - should maintain auth state

Test 7: Responsive Design

Test on desktop (1920x1080, 1366x768)
Test on tablet (768px width)
Test on mobile (375px, 414px width)
Check all forms are usable on mobile
Check buttons are touch-friendly (minimum 44px height)
Verify text is readable without zooming

Test 8: Error Handling

Disconnect internet → should show network error
Try duplicate email registration → should show appropriate error
Test Firebase connection errors
Verify all error messages are user-friendly

Test 9: Firestore Data

After signup, check Firebase Console
Verify user document created in users collection
Check all fields are correct: uid, email, displayName, isVerifiedAccount, profileSetupComplete, createdAt
Verify isVerifiedAccount is false initially
After verification, manually test or wait for next milestone

Test 10: Security

Try accessing another user's data via browser console
Verify Firestore rules are working
Test that unauthenticated users can't read/write data
Verify email validation prevents SQL injection attempts
Test XSS prevention in form inputs


FIREBASE CONSOLE SETUP INSTRUCTIONS
Before Running the App:

Enable Authentication Methods:

Go to Firebase Console → Authentication → Sign-in method
Enable "Email/Password" authentication
Enable "Email link (passwordless sign-in)" if needed


Configure Email Templates:

Go to Authentication → Templates
Customize "Email verification" template with 99cupid branding
Customize "Password reset" template
Set sender name to "99cupid"
Add company logo if available


Deploy Firestore Rules:

Go to Firestore Database → Rules
Copy the rules from firestore.rules file
Click "Publish"
Test rules using Rules Playground


Create Firestore Database:

Go to Firestore Database
Click "Create Database"
Choose production mode
Select closest region to users
Create users collection (will auto-create on first signup)


Set Up Firebase Config:

Go to Project Settings → General
Scroll to "Your apps" section
Copy Firebase config object
Paste into /src/config/firebase.js




UI/UX POLISH REQUIREMENTS
Brand Consistency:

All primary buttons use Cupid Pink (#FF5FA8) background
All secondary buttons use Cupid Pink border with white background
Rounded corners on all elements (minimum 12px, prefer 16-24px)
Consistent spacing: 4px, 8px, 16px, 24px, 32px
Font weights: Regular (400), Semibold (600), Bold (700)

Animations & Transitions:

All button hovers have 300ms transition
Form inputs have smooth focus transitions
Page transitions use fade-in animation
Loading states have spinner animations
Hover effects on cards: slight lift (-translate-y-1) + shadow increase
Success messages slide in from top
Error messages shake slightly on display

Responsive Breakpoints:

Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px and above
Max content width: 1200px (centered)

Accessibility:

All form inputs have labels
Proper ARIA labels for icons
Keyboard navigation support
Focus indicators visible
Color contrast ratio minimum 4.5:1
Error messages announced to screen readers

Loading States:

Show spinner during API calls
Disable buttons during loading
Change button text to indicate progress
Show skeleton screens for data loading (Milestone 2+)


DEPLOYMENT PREPARATION
Environment Variables:
Create .env file in root:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
Update firebase.js to use environment variables:
javascriptconst firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
Build Configuration:

Run npm run build to create production build
Test production build locally: npm run preview
Verify all routes work in production
Check bundle size is reasonable (<500KB)
Ensure no console errors in production

Performance Optimization:

Lazy load routes for code splitting
Optimize images (if any added)
Enable compression in hosting
Add service worker for offline support (Milestone 3+)


COMMON ISSUES & SOLUTIONS
Issue 1: Firebase Not Connecting

Solution: Verify firebase.js config matches Firebase Console exactly
Check that Firebase project is active
Ensure billing is enabled for Firebase project
Verify network requests in browser DevTools

Issue 2: Email Not Sending

Solution: Check Firebase Authentication settings
Verify email templates are configured
Check spam folder
Ensure domain is not blacklisted
Test with different email providers (Gmail, Outlook, Yahoo)

Issue 3: Infinite Redirect Loop

Solution: Check ProtectedRoute logic
Verify AuthContext is providing correct state
Check that emailVerified is updating properly
Clear browser cache and localStorage

Issue 4: Styling Not Applying

Solution: Ensure Tailwind CSS is properly configured
Run npm install to install all dependencies
Verify tailwind.config.js includes all content paths
Check that animations.css is imported in main.jsx

Issue 5: Form Validation Not Working

Solution: Check validation.js imports
Verify error state is updating correctly
Console.log validation results for debugging
Ensure validation runs before form submission


CODE QUALITY CHECKLIST

 All components use proper React hooks
 No console.logs in production code
 All async functions have try-catch blocks
 All forms have proper validation
 All buttons have loading states
 All images have alt text
 All external links open in new tab
 No hardcoded credentials in code
 All Firebase calls have error handling
 Code is properly commented
 File naming is consistent (PascalCase for components)
 No unused imports or variables


PERFORMANCE BENCHMARKS
Target Metrics for Milestone 1:

Page load time: < 2 seconds
Time to interactive: < 3 seconds
First contentful paint: < 1.5 seconds
Form submission response: < 1 second
Lighthouse score: > 90 for Performance, Accessibility, Best Practices


SECURITY BEST PRACTICES

Never expose Firebase API keys in public repos
Use environment variables for all sensitive data
Validate all user inputs on both client and server
Implement rate limiting for auth endpoints (Firebase handles this)
Use HTTPS only in production
Sanitize all user-generated content
Implement CSRF protection
Regular security audits
Keep all dependencies updated
Monitor Firebase usage for unusual activity


HANDOFF DOCUMENTATION
For AI Dev/GitHub Copilot:
Quick Start Command:
bashnpm install
npm run dev
Project Structure:

/src/components - Reusable UI components
/src/pages - Full page components
/src/contexts - React contexts (Auth)
/src/hooks - Custom hooks
/src/config - Configuration files
/src/utils - Utility functions
/src/styles - Global styles

Key Files:

firebase.js - Firebase configuration
AuthContext.jsx - Authentication logic
App.jsx - Main routing configuration
validation.js - Form validation utilities

Commands:

npm run dev - Start development server
npm run build - Create production build
npm run preview - Preview production build


MILESTONE 1 COMPLETION CRITERIA
✅ User can sign up with email and password
✅ User receives verification email
✅ User can verify email and access app
✅ User can login with verified account
✅ User can reset password
✅ Onboarding screens display after verification
✅ All navigation guards work correctly
✅ UI is responsive on all devices
✅ Firebase is properly configured
✅ Error handling works for all scenarios
✅ User data is stored in Firestore correctly
✅ Security rules are implemented

FINAL DELIVERABLE CHECKLIST

 All code files created as specified
 Firebase configuration complete
 Authentication flows tested
 Email verification working
 Password reset working
 Onboarding screens functional
 UI matches brand guidelines
 Responsive design verified
 Error handling implemented
 Security rules deployed
 Code is clean and commented
 No console errors
 Performance benchmarks met
 Documentation complete


NEXT STEPS (MILESTONE 2 PREVIEW)
Milestone 2 will include:

Profile creation form (bio, age, gender, location)
Photo upload system (Firebase Storage)
Profile preview screen
Basic profile editing
Profile completion tracking
User preferences setup
Interest selection
Looking for selection (men/women/everyone)

Do not implement Milestone 2 features yet. Wait for user confirmation that Milestone 1 is complete and working.

PAYMENT MILESTONE VERIFICATION
Before requesting payment ($70), verify:

All authentication flows work end-to-end
Email verification is functional
Onboarding screens display correctly
Firebase integration is complete
UI is polished and responsive
No critical bugs or errors
Code is clean and well-organized
Documentation is complete

Submit for review with:

Screenshot of successful signup
Screenshot of email verification page
Screenshot of onboarding screens
Screenshot of home page after verification
List of tested scenarios
Any known issues or limitations


END OF MILESTONE 1 INSTRUCTIONSRetryClaude can make mistakes. Please double-check responses.