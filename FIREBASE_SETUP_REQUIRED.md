# 🔥 Firebase Setup Required

## ⚠️ Current Issue

You're seeing this error:
```
Firebase: Error (auth/api-key-not-valid. Please pass a valid API key.)
```

This happens because the `.env` file with your Firebase credentials doesn't exist yet.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Get Your Firebase Config

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project (or create one if you haven't)
3. Click the **⚙️ Settings** icon (top left) → **Project Settings**
4. Scroll down to **"Your apps"** section
5. If you don't have a web app, click **"Add app"** → **Web** (</> icon)
6. You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 2: Create .env File

In your project folder (`C:\Users\PC\cupid99`), create a new file called `.env` (no extension).

**Option A: Create via PowerShell**
```powershell
cd C:\Users\PC\cupid99
New-Item -Path . -Name ".env" -ItemType "file"
```

**Option B: Create via File Explorer**
1. Open File Explorer
2. Navigate to `C:\Users\PC\cupid99`
3. Right-click → New → Text Document
4. Rename to `.env` (remove the .txt extension)
   - Make sure "File name extensions" is visible in View tab

### Step 3: Add Your Credentials

Open the `.env` file and paste this (replace with YOUR values):

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Important**: 
- Replace ALL values with your actual Firebase config
- No quotes needed around values
- No spaces around the `=` sign

### Step 4: Enable Authentication

In Firebase Console:
1. Go to **Authentication** (left sidebar)
2. Click **Get Started** (if first time)
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
   - Toggle "Enable"
   - Click "Save"
5. Enable **Google** provider (optional)
   - Toggle "Enable"
   - Add support email
   - Click "Save"

### Step 5: Create Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose **Start in production mode**
4. Select location (closest to you)
5. Click **Enable**
6. Go to **Rules** tab
7. Replace with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update: if request.auth.uid == userId;
      allow delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

8. Click **Publish**

### Step 6: Test Your App

```powershell
cd C:\Users\PC\cupid99
npm run dev
```

Open http://localhost:3000

You should now see:
- ✅ Logo displays (no "99cupid" text)
- ✅ Email/password fields
- ✅ Google sign-in button
- ✅ NO demo button
- ✅ No Firebase errors

---

## 🎨 What Changed

### ✅ Removed
- ❌ Demo login button
- ❌ "99cupid" text on auth pages
- ❌ Demo login functionality

### ✅ Updated
- ✅ Logo now displays alone (no text)
- ✅ Bigger logo (24x24 instead of 20x20)
- ✅ Demo users now use your actual images:
  - `mockpp1-female.jpg` → Emma
  - `mockpp2-female.jpeg` → Sophie
  - `mockpp3-male.jpeg` → Alex
  - `mockpp4-male.jpeg` → Michael
- ✅ Reduced to 4 realistic demo users (2 female, 2 male)

### ✅ Kept
- ✅ Email/password authentication
- ✅ Google OAuth integration
- ✅ Email verification flow
- ✅ Password reset
- ✅ All onboarding screens

---

## 📱 Demo Users Available

Your 4 demo users with real profile pictures:

| Name | Gender | Age | Photo |
|------|--------|-----|-------|
| Emma | Female | 24 | mockpp1-female.jpg |
| Sophie | Female | 23 | mockpp2-female.jpeg |
| Alex | Male | 26 | mockpp3-male.jpeg |
| Michael | Male | 28 | mockpp4-male.jpeg |

These will be used when you implement the swiping feature in Milestone 3.

---

## 🔍 Troubleshooting

### Still seeing Firebase error?
- Make sure `.env` file is in the root folder (next to package.json)
- Check that values don't have quotes or extra spaces
- Restart dev server: `Ctrl+C` then `npm run dev`

### Can't create .env file?
- Windows might hide file extensions
- In File Explorer: View → Show → File name extensions
- Then rename properly to `.env` (not `.env.txt`)

### Auth not working?
- Check Firebase Console → Authentication → Sign-in method
- Make sure Email/Password is enabled
- Check Firestore Database is created

---

## 📞 Need Help?

If you're stuck:
1. Check Firebase Console for any configuration errors
2. Open browser console (F12) to see specific error messages
3. Make sure all Firebase services are enabled

---

## ✨ Next Steps After Setup

Once `.env` is configured:

1. **Test Login/Signup**
   - Create account with your email
   - Verify email
   - Login successfully

2. **Test Google Sign In**
   - Click "Sign in with Google"
   - Complete authorization
   - Auto-logged in

3. **Ready for Deployment**
   - `npm run build`
   - `firebase deploy`

---

**Current Status**: ⏳ Waiting for `.env` file configuration

**After Setup**: ✅ Ready to run and test!
