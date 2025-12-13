# Firebase Authentication Setup Guide

## 🚨 IMPORTANT: Enable Authentication Methods

If you're seeing authentication errors like "operation-not-allowed" or "configuration-not-found", you need to enable authentication methods in Firebase Console.

## Steps to Enable Email/Password Authentication

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `cupid-e5874`

2. **Navigate to Authentication**
   - Click on "Build" in the left sidebar
   - Click on "Authentication"
   - Click on the "Sign-in method" tab

3. **Enable Email/Password Provider**
   - Find "Email/Password" in the list
   - Click on it
   - Toggle "Enable" to ON
   - Click "Save"

## Steps to Enable Google Sign-In

1. **In the same Sign-in method tab**
   - Find "Google" in the list of providers
   - Click on it
   - Toggle "Enable" to ON
   - Add your project support email (required)
   - Click "Save"

2. **Configure OAuth Consent Screen** (if needed)
   - Go to Google Cloud Console: https://console.cloud.google.com/
   - Select your project
   - Navigate to "APIs & Services" > "OAuth consent screen"
   - Fill in the required information
   - Add your app domain to authorized domains

## Steps to Authorize Your Domain

If you see "unauthorized-domain" error:

1. **In Firebase Console > Authentication > Settings**
   - Scroll down to "Authorized domains"
   - Click "Add domain"
   - Add your domains:
     - `localhost` (for local development)
     - `127.0.0.1` (alternative localhost)
     - Your production domain (when deployed)

## Verification Checklist

✅ Email/Password provider is enabled
✅ Google provider is enabled (with support email configured)
✅ localhost is in authorized domains
✅ .env file has all required Firebase credentials
✅ Dev server restarted after enabling auth methods

## Common Issues and Solutions

### Issue: "operation-not-allowed"
**Solution**: Enable the authentication method (Email/Password or Google) in Firebase Console as described above.

### Issue: "unauthorized-domain"
**Solution**: Add your domain to the authorized domains list in Firebase Console > Authentication > Settings.

### Issue: "popup-blocked"
**Solution**: Allow popups in your browser for localhost during development.

### Issue: "invalid-api-key"
**Solution**: Verify that your .env file has the correct Firebase API key from Firebase Console > Project Settings.

## After Enabling Authentication

1. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Clear browser cache** (optional but recommended):
   - Open browser DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

3. **Test signup/login**:
   - Try creating a new account with email/password
   - Try signing in with Google
   - Check browser console for any remaining errors

## Need Help?

If you continue to experience issues:
1. Check the browser console for specific error codes
2. Verify all environment variables in .env file
3. Ensure Firebase project is active and not deleted
4. Check Firebase Console > Usage for any quota limits
