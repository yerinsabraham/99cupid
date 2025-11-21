import { createContext, useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  updateEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { UserModel } from '../models/UserModel';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Sign up new user with email and password
   */
  const signUp = useCallback(async (email, password, displayName) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName });

      // Send verification email
      await sendEmailVerification(user);

      // Create user profile in Firestore
      const newUser = new UserModel({
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        isVerifiedAccount: false,
        profileSetupComplete: false,
      });

      await setDoc(doc(db, 'users', user.uid), newUser.toFirestore());

      return {
        success: true,
        message: 'Account created! Please check your email to verify your account.'
      };
    } catch (error) {
      return handleAuthError(error);
    }
  }, []);

  /**
   * Login user with email and password
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return handleAuthError(error);
    }
  }, []);

  /**
   * Login with Google
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile in Firestore for Google signups
        const newUser = new UserModel({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || null,
          isVerifiedAccount: user.emailVerified || true,
          profileSetupComplete: false,
        });

        await setDoc(doc(db, 'users', user.uid), newUser.toFirestore());
      }

      return { success: true };
    } catch (error) {
      return handleAuthError(error);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  /**
   * Reset password with email
   */
  const resetPassword = useCallback(async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent! Check your inbox.' };
    } catch (error) {
      return handleAuthError(error);
    }
  }, []);

  /**
   * Resend verification email
   */
  const resendVerification = useCallback(async () => {
    try {
      setError(null);
      if (currentUser) {
        await sendEmailVerification(currentUser);
        return { success: true, message: 'Verification email sent!' };
      }
      return { success: false, message: 'No user logged in' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, [currentUser]);

  /**
   * Update user profile in Firestore
   */
  const updateUserProfile = useCallback(async (data) => {
    try {
      setError(null);
      if (!currentUser) {
        return { success: false, message: 'No user logged in' };
      }

      // Update Firebase Auth profile if needed
      if (data.displayName) {
        await updateProfile(currentUser, { displayName: data.displayName });
      }

      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, updateData);

      // Update local profile state
      setUserProfile(prev => ({
        ...prev,
        ...updateData
      }));

      return { success: true };
    } catch (error) {
      return handleAuthError(error);
    }
  }, [currentUser]);

  /**
   * Handle Firebase authentication errors
   */
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
      case 'auth/weak-password':
        message = 'Password is too weak. Use at least 8 characters.';
        break;
      case 'auth/operation-not-allowed':
        message = 'Email/password authentication is not enabled.';
        break;
      default:
        message = error.message || message;
    }

    setError(message);
    return { success: false, message };
  };

  /**
   * Listen to auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);

        if (user) {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(UserModel.fromFirestore(userDoc));
          } else {
            // Create user profile if it doesn't exist
            const newUser = UserModel.fromAuthUser(user);
            await setDoc(doc(db, 'users', user.uid), newUser.toFirestore());
            setUserProfile(newUser);
          }
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error in auth state listener:', err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signUp,
    login,
    logout,
    resetPassword,
    resendVerification,
    updateUserProfile,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
