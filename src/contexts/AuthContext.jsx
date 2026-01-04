import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  updateEmail,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { UserModel } from '../models/UserModel';
import { addDebugLog } from '../components/common/MobileDebug';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Track if we're processing a redirect to prevent double processing
  const processingRedirect = useRef(false);
  const profileLoaded = useRef(false);

  /**
   * Load or create user profile in Firestore
   */
  const loadOrCreateProfile = async (user) => {
    try {
      addDebugLog(`Loading profile for: ${user.email}`, 'info');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const profileData = { id: userDoc.id, ...userDoc.data() };
        addDebugLog(`Profile loaded! Setup complete: ${profileData.profileSetupComplete}`, 'success');
        return profileData;
      } else {
        addDebugLog('No profile found, creating new one...', 'info');
        const newUser = new UserModel({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || null,
          isVerifiedAccount: user.emailVerified || true,
          profileSetupComplete: false,
        });
        
        await setDoc(doc(db, 'users', user.uid), newUser.toFirestore());
        const newProfile = { id: user.uid, ...newUser.toFirestore() };
        addDebugLog('New profile created successfully', 'success');
        return newProfile;
      }
    } catch (err) {
      addDebugLog(`Profile error: ${err.message}`, 'error');
      throw err;
    }
  };

  /**
   * Sign up new user with email and password
   */
  const signUp = useCallback(async (email, password, displayName) => {
    try {
      setError(null);
      
      // Ensure persistence is set to local
      await setPersistence(auth, browserLocalPersistence);
      
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
   * Works on both mobile and desktop
   */
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      addDebugLog('Starting email/password login...', 'info');
      
      // Ensure persistence is set to local (survives page refreshes)
      await setPersistence(auth, browserLocalPersistence);
      addDebugLog('Persistence set to local', 'info');
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      addDebugLog(`Login successful: ${result.user.email}`, 'success');
      
      // Profile will be loaded by onAuthStateChanged
      return { success: true };
    } catch (error) {
      addDebugLog(`Login failed: ${error.code} - ${error.message}`, 'error');
      return handleAuthError(error);
    }
  }, []);

  /**
   * Login with Google
   * Uses redirect flow with a workaround for mobile browsers
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      
      // Detect mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      addDebugLog(`Google Sign-In starting... Mobile: ${isMobile}, iOS: ${isIOS}, Safari: ${isSafari}`, 'info');
      
      // Ensure persistence is set to local
      await setPersistence(auth, browserLocalPersistence);
      addDebugLog('Persistence set to local', 'info');
      
      // Try popup flow first on mobile (redirect is broken on Safari)
      if (isMobile) {
        addDebugLog('Attempting POPUP flow for mobile (redirect broken on Safari)...', 'info');
        
        try {
          const result = await signInWithPopup(auth, googleProvider);
          
          if (result && result.user) {
            addDebugLog(`Google popup success: ${result.user.email}`, 'success');
            return { success: true };
          }
        } catch (popupError) {
          addDebugLog(`Popup error: ${popupError.code} - ${popupError.message}`, 'error');
          
          // If popup is blocked or closed, try redirect as fallback
          if (popupError.code === 'auth/popup-blocked' || 
              popupError.code === 'auth/popup-closed-by-user' ||
              popupError.code === 'auth/cancelled-popup-request') {
            addDebugLog('Popup failed, falling back to REDIRECT...', 'warning');
            
            // Store pending state in localStorage (more reliable than sessionStorage on iOS)
            localStorage.setItem('googleSignInPending', Date.now().toString());
            
            addDebugLog('Redirecting to Google...', 'info');
            await signInWithRedirect(auth, googleProvider);
            return { success: true, redirecting: true };
          } else {
            // Other errors (network, auth, etc) - don't retry with redirect
            throw popupError;
          }
        }
      } else {
        addDebugLog('Using POPUP flow for desktop', 'info');
        
        const result = await signInWithPopup(auth, googleProvider);
        
        if (result && result.user) {
          addDebugLog(`Google popup success: ${result.user.email}`, 'success');
        }
        
        return { success: true };
      }
    } catch (error) {
      addDebugLog(`Google Sign-In error: ${error.code} - ${error.message}`, 'error');
      localStorage.removeItem('googleSignInPending');
      return handleAuthError(error);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setError(null);
      profileLoaded.current = false;
      await signOut(auth);
      setUserProfile(null);
      setCurrentUser(null);
      // Clear any stored data
      localStorage.removeItem('googleSignInPending');
      sessionStorage.removeItem('googleSignInPending');
      addDebugLog('User logged out', 'info');
      return { success: true };
    } catch (error) {
      addDebugLog(`Logout error: ${error.message}`, 'error');
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

      // Refresh profile from Firestore
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        const freshProfile = { id: updatedDoc.id, ...updatedDoc.data() };
        setUserProfile(freshProfile);
      }

      return { success: true };
    } catch (error) {
      return handleAuthError(error);
    }
  }, [currentUser]);

  /**
   * Force refresh user profile from Firestore
   */
  const refreshUserProfile = useCallback(async () => {
    try {
      if (!currentUser) {
        return { success: false, message: 'No user logged in' };
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const freshProfile = { id: userDoc.id, ...userDoc.data() };
        setUserProfile(freshProfile);
        return { success: true, profile: freshProfile };
      }

      return { success: false, message: 'Profile not found' };
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return { success: false, message: error.message };
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
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
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
        message = 'This sign-in method is not enabled.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Sign-in was cancelled.';
        break;
      case 'auth/cancelled-popup-request':
        message = 'Sign-in was cancelled.';
        break;
      case 'auth/popup-blocked':
        message = 'Popup was blocked. Please allow popups for this site.';
        break;
      case 'auth/unauthorized-domain':
        message = 'This domain is not authorized for sign-in.';
        break;
      default:
        message = error.message || message;
    }

    console.error('🚨 Auth error:', error.code, message);
    setError(message);
    return { success: false, message };
  };

  /**
   * STEP 1: Handle Google redirect result
   * Check both getRedirectResult AND onAuthStateChanged
   */
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const pendingSignIn = localStorage.getItem('googleSignInPending');
      addDebugLog(`Page loaded. Pending sign-in: ${pendingSignIn ? 'YES' : 'NO'}`, 'info');
      
      if (pendingSignIn) {
        addDebugLog('Checking for Google redirect result...', 'info');
        
        try {
          const result = await getRedirectResult(auth);
          
          if (result && result.user) {
            addDebugLog(`Redirect SUCCESS: ${result.user.email}`, 'success');
            localStorage.removeItem('googleSignInPending');
            
            // Profile will be loaded by auth state listener
            return;
          } else {
            addDebugLog('getRedirectResult returned null', 'warning');
            
            // Wait a moment for auth state to settle
            addDebugLog('Waiting for auth state...', 'info');
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if user was authenticated anyway (Safari workaround)
            if (auth.currentUser) {
              addDebugLog(`Auth restored! User: ${auth.currentUser.email}`, 'success');
              localStorage.removeItem('googleSignInPending');
            } else {
              addDebugLog('No user found after redirect. Sign-in may have failed.', 'error');
              localStorage.removeItem('googleSignInPending');
              setError('Google sign-in did not complete. Please try again.');
            }
          }
        } catch (error) {
          addDebugLog(`Redirect ERROR: ${error.code} - ${error.message}`, 'error');
          localStorage.removeItem('googleSignInPending');
          setError(`Google sign-in failed: ${error.message}`);
        }
      }
      
      setAuthInitialized(true);
    };

    handleGoogleRedirect();
  }, []);

  /**
   * STEP 2: Listen to auth state changes
   * This handles email/password login and maintaining session
   */
  useEffect(() => {
    addDebugLog('Setting up auth state listener...', 'info');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      addDebugLog(`Auth state changed: ${user ? user.email : 'No user'}`, user ? 'success' : 'info');
      
      try {
        if (user) {
          setCurrentUser(user);
          
          // Only load profile if not already loaded
          if (!profileLoaded.current) {
            addDebugLog('Loading profile...', 'info');
            setLoading(true);
            const profile = await loadOrCreateProfile(user);
            setUserProfile(profile);
            profileLoaded.current = true;
            addDebugLog(`Profile loaded! Setup complete: ${profile.profileSetupComplete}`, 'success');
          } else {
            addDebugLog('Profile already loaded, skipping', 'info');
          }
        } else {
          addDebugLog('No user - clearing state', 'info');
          setCurrentUser(null);
          setUserProfile(null);
          profileLoaded.current = false;
        }
      } catch (err) {
        addDebugLog(`Auth state error: ${err.message}`, 'error');
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    authInitialized,
    signUp,
    login,
    logout,
    resetPassword,
    resendVerification,
    updateUserProfile,
    refreshUserProfile,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
