# Firebase Hosting Deployment Guide

**Version**: 1.0  
**Updated**: November 20, 2025  
**Status**: Ready for Deployment

---

## 📋 Pre-Deployment Checklist

- [ ] `.env` file created with Firebase credentials
- [ ] Google OAuth enabled in Firebase Console (optional, but recommended)
- [ ] Local build successful: `npm run build` ✅
- [ ] Tested with `npm run dev` ✅
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Logged into Firebase: `firebase login`

---

## 🚀 Step 1: Verify Local Build

```bash
cd c:\Users\PC\cupid99

# Clear previous builds
rm -r dist

# Create new production build
npm run build

# Verify dist folder created with files:
# - dist/index.html
# - dist/assets/vendor-*.js
# - dist/assets/index-*.js
# - dist/assets/index-*.css
# - dist/assets/applogo-*.png
# - dist/assets/google-*.png
```

**Expected Output:**
```
✓ 1,292 modules transformed
✓ dist/index.html 0.73 kB
✓ Built successfully
```

---

## 🔧 Step 2: Firebase Project Setup

### 2.1 Create Firebase Project (if not done)
```bash
firebase projects:create cupid99-mvp
```

### 2.2 Initialize Firebase in Project
```bash
firebase init hosting

# When prompted:
# - Select project: cupid99-mvp
# - Public directory: dist
# - Configure as single-page app: YES (important!)
# - Set up automatic deploys: NO (optional)
```

### 2.3 Configure Authentication

**In Firebase Console:**

1. Go to **Authentication → Sign-in method**
2. Enable **Email/Password** provider (if not already done)
3. Enable **Google** provider:
   - Click Google
   - Toggle "Enable"
   - Enter Project Support Email
   - Complete OAuth consent screen
   - Save

### 2.4 Configure Firestore

**In Firebase Console:**

1. Go to **Firestore Database**
2. Create database:
   - Choose region: `us-central1` (or nearest to you)
   - Start in production mode
3. Replace security rules:
   - Go to **Rules** tab
   - Replace with content from `firestore.rules` in your project
   - Publish

**Firestore Rules Content:**
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

---

## 📤 Step 3: Deploy to Firebase Hosting

### Option A: First-Time Deploy

```bash
# Login if not already logged in
firebase login

# Deploy the application
firebase deploy --project=cupid99-mvp

# Watch the deployment progress
# Your app will be live at: https://cupid99-mvp.web.app
```

### Option B: Update Existing Deployment

```bash
# Rebuild project
npm run build

# Deploy updates
firebase deploy --project=cupid99-mvp --only hosting
```

---

## ✅ Step 4: Verify Deployment

After deployment completes, test:

### 4.1 Access Your App
```
https://cupid99-mvp.web.app
```

### 4.2 Test Features

**Demo Login (Works Immediately):**
1. Click "Try Demo" on login page
2. Should auto-create and login demo account
3. Should redirect to home page

**Google Sign In (If configured):**
1. Click "Sign in with Google"
2. Complete Google authorization
3. Should create account and redirect

**Email/Password (Works After .env config):**
1. Click "Create Account"
2. Fill in form
3. Should send verification email

### 4.3 Check Performance

Visit Firebase Console:
- **Hosting** tab to view traffic
- **Analytics** to see usage
- **Logs** to view errors

---

## 🔐 Environment Variables for Production

Your production app uses:
```
VITE_FIREBASE_API_KEY         ← From .env
VITE_FIREBASE_AUTH_DOMAIN     ← From .env
VITE_FIREBASE_PROJECT_ID      ← From .env
VITE_FIREBASE_STORAGE_BUCKET  ← From .env
VITE_FIREBASE_MESSAGING_SENDER_ID ← From .env
VITE_FIREBASE_APP_ID          ← From .env
```

**These are baked into the build** during `npm run build`, so they're production-secure.

---

## 📊 Deployment Outputs

```
Hosting URL Rewrite Rules:
  ✓ Configured for SPA (Single Page App)
  ✓ All routes redirect to index.html
  ✓ Static assets cached with long TTL

Bundle Analysis:
  ├─ JavaScript: 504.70 kB (117.60 kB gzipped)
  ├─ CSS: 21.61 kB (4.55 kB gzipped)
  ├─ Images: 2.01 MB (applogo + google logo)
  └─ Total: ~6 MB raw (~175 kB optimized)

Performance:
  ✓ Gzip compression enabled
  ✓ Minified code
  ✓ Code splitting for vendors
  ✓ Lazy loading ready
```

---

## 🛠️ Troubleshooting

### Issue: "dist folder not found"
```bash
npm run build
# Make sure build completes successfully
```

### Issue: "Firebase CLI not found"
```bash
npm install -g firebase-tools
firebase login
```

### Issue: "Wrong project selected"
```bash
firebase use --add
# Choose your project from the list
```

### Issue: "CORS errors with assets"
Firebase Hosting automatically handles CORS. If issues persist:
1. Check asset paths in `vite.config.js`
2. Clear browser cache
3. Check Firebase Hosting rules

### Issue: "Blank page after deploy"
1. Check browser console for errors
2. Verify `.env` variables were built into the app
3. Check Firestore rules aren't too restrictive
4. Verify Firebase project ID matches

---

## 📈 Post-Deployment Steps

### 1. Enable Enhanced Security
```bash
# In Firebase Console: Authentication settings
- Enable MFA (optional but recommended)
- Configure session duration
- Set up custom email templates
```

### 2. Setup Email Templates
```
In Firebase Console: Authentication → Templates

Customize:
1. Email verification
2. Password reset
3. Email change notification
```

### 3. Configure Custom Domain (Optional)
```
In Firebase Console: Hosting

1. Click "Connect Domain"
2. Add your custom domain (e.g., 99cupid.com)
3. Update DNS records
4. SSL certificate auto-provisioned
```

### 4. Enable Analytics
```bash
# In Firebase Console: Analytics

Track:
- User signups
- Auth methods used
- Session duration
- Page views
```

---

## 📱 Testing on Different Devices

After deployment:

**Desktop:**
- https://cupid99-mvp.web.app
- Test all authentication flows
- Check responsive design

**Mobile (iOS):**
- Visit URL in Safari
- Add to home screen
- Test form input on touch
- Test Google OAuth flow

**Mobile (Android):**
- Visit URL in Chrome
- "Install app" prompt should appear
- Test all flows

---

## 🔄 Continuous Deployment (Optional)

### Setup GitHub to Auto-Deploy

```bash
# In Firebase Console: Hosting → Connect repository
1. Connect your GitHub repo
2. Choose deployment branch (e.g., main)
3. Set build command: npm run build
4. Set output directory: dist
5. Save

# Now every push to main branch auto-deploys!
```

---

## 💾 Backup & Recovery

### Database Backup
```bash
# In Firebase Console: Firestore Database
1. Go to Backups & Restore
2. Enable automatic backups
3. Set retention period to 7-30 days
```

### Version Rollback
```bash
# If deployment has issues:
firebase hosting:channels:list
firebase hosting:channels:delete VERSION_ID

# Or redeploy previous version
firebase deploy --only hosting:VERSION
```

---

## 📞 Support & Monitoring

### Monitor Your App
- **Firebase Console Dashboard**: https://console.firebase.google.com
- **Hosting Analytics**: View traffic and performance
- **Realtime Database**: Monitor active users
- **Cloud Logging**: View application logs

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Slow initial load | Enable HTTP/2 push, minify assets |
| High bandwidth | Implement lazy loading for images |
| Auth failures | Check Firestore rules and permissions |
| CORS issues | Check Firebase hosting configuration |
| Login timeout | Increase session duration in Firebase |

---

## 🎉 Success Indicators

After deployment, you should see:

✅ App loads at Firebase URL  
✅ Logo displays on all auth pages  
✅ "Try Demo" button works without credentials  
✅ Google OAuth button visible (if configured)  
✅ Forms validate and show errors  
✅ Navigation works between pages  
✅ Console has no errors  
✅ Mobile responsiveness works  

---

## 📝 Deployment Command Reference

```bash
# One-line deployment (after build):
firebase deploy --project=cupid99-mvp

# Deploy only hosting:
firebase deploy --only hosting

# With specific alias:
firebase deploy --only hosting:production

# View deployment history:
firebase hosting:channels:list

# Get deployment URL:
firebase hosting:sites:get

# Monitor realtime deployments:
firebase hosting:serve
```

---

**Deployment Status**: Ready ✅  
**Build Verified**: Yes ✅  
**Estimated Time**: 3-5 minutes  

**Your app is production-ready. Deploy whenever you're comfortable!** 🚀
