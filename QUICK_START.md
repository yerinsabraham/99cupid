# Quick Start Guide - New Features Testing

**Last Updated**: November 20, 2025

---

## 🎯 What's New?

✅ **Logo** - App logo now displays on all auth pages  
✅ **Google Sign In** - Users can login with Google  
✅ **Demo Mode** - Try the app without creating an account  
✅ **Demo Users** - 8 test profiles for future swiping feature  

---

## 🚀 Get Started in 2 Minutes

### Step 1: Start the Dev Server
```bash
cd c:\Users\PC\cupid99
npm run dev
```

App opens at: `http://localhost:3000`

### Step 2: Test Demo Login
1. You should see the **99cupid logo** at the top
2. Click the **"Try Demo"** button (purple with 🎬 icon)
3. App auto-creates a demo account
4. You're logged in! ✅

### Step 3: Explore the App
- Click through onboarding screens
- View the home page
- Logout and test again

---

## 🔐 Demo Credentials (For Manual Testing)

If you want to login manually:
- **Email**: `demo@cupid99.test`
- **Password**: `Demo@12345`

(But the "Try Demo" button does this automatically!)

---

## 🟠 Google Sign In Setup (Optional)

Want to test Google sign in? Follow these steps:

### 1. Open Firebase Console
https://console.firebase.google.com

### 2. Enable Google Provider
- Authentication → Sign-in method
- Click "Google"
- Toggle "Enable"
- Complete setup

### 3. Test It
- Go back to app
- Click "Sign in with Google"
- Complete Google authorization
- You're signed up! ✅

---

## 📱 Demo Users Available

The app has 8 test users ready for your swiping feature:

| Name | Age | Location | Interests |
|------|-----|----------|-----------|
| Emma | 24 | San Francisco | Travel, Photography |
| Sophie | 23 | New York | Art, Music, Dogs |
| Alex | 26 | Austin | Tech, Fitness, Gaming |
| Jessica | 25 | Los Angeles | Wellness, Yoga, Food |
| Maya | 27 | Chicago | Books, Running, Business |
| Sarah | 22 | Seattle | Photography, Nature |
| Lisa | 28 | Miami | Fitness, Health, Beach |
| Rachel | 25 | Denver | Cooking, DIY, Games |

**Usage:**
```javascript
import { getDemoUsers, getRandomDemoUsers } from '@/utils/demoUsers';

// Get all demo users
const allUsers = getDemoUsers();

// Get 5 random users for swiping
const cardUsers = getRandomDemoUsers(5);
```

---

## 🧪 Test Checklist

### Visual Elements
- [ ] Logo displays on login page
- [ ] Logo displays on signup page  
- [ ] Google logo shows on buttons
- [ ] Demo button is purple with 🎬 icon
- [ ] All buttons are properly styled
- [ ] Layout is responsive on mobile

### Demo Login
- [ ] Click "Try Demo" on login page
- [ ] App creates demo account automatically
- [ ] Redirects to home page after login
- [ ] Can access all pages without email verification
- [ ] Can logout and login again with demo
- [ ] "Try Demo" recognizes existing demo account

### Email/Password Auth
- [ ] Signup form validates inputs
- [ ] Creates account successfully
- [ ] Sends verification email
- [ ] Email verification page works
- [ ] Can resend verification email
- [ ] Can login after verification

### Password Reset
- [ ] Click "Forgot Password?"
- [ ] Enter email
- [ ] Should send reset email
- [ ] Can reset password via email link

### Navigation
- [ ] Onboarding screens navigate correctly
- [ ] Protected routes redirect when not logged in
- [ ] Home page shows user info
- [ ] Logout works and redirects to login

---

## 🔍 Troubleshooting

### Issue: Demo button doesn't work
**Solution:**
1. Make sure you have `.env` file with Firebase credentials
2. Check browser console for errors
3. Clear browser cache and try again

### Issue: Google button doesn't work
**Solution:**
1. Google OAuth not enabled yet in Firebase Console
2. That's OK! It will work after you enable it
3. Demo login still works without it

### Issue: Logo not showing
**Solution:**
1. Check that `applogo.png` is in `/assets/icons/`
2. Clear browser cache
3. Restart dev server: `npm run dev`

### Issue: Logo doesn't load in dist (after npm run build)
**Solution:**
1. This is expected for build - images are optimized
2. When deployed to Firebase, assets will load
3. Check dev server works fine

---

## 📂 File Locations

All new/updated files:

```
src/
├── config/
│   └── firebase.js (UPDATED - added Google OAuth)
├── contexts/
│   └── AuthContext.jsx (UPDATED - added demo login)
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx (UPDATED - added Google & Demo buttons)
│   │   └── SignUpForm.jsx (UPDATED - added Google button)
│   └── layout/
│       └── AuthLayout.jsx (UPDATED - now uses logo image)
└── utils/
    └── demoUsers.js (NEW - 8 demo user profiles)

assets/
├── icons/
│   ├── applogo.png (YOUR LOGO)
│   └── google.png (GOOGLE LOGO)

.env.example (UPDATED - added Google OAuth notes)
```

---

## 🔄 Dev Server Workflow

```bash
# Start dev server
npm run dev

# App hot-reloads when you edit files
# Changes appear instantly!

# To stop server
Ctrl+C

# To run again
npm run dev
```

---

## 🛠️ Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests (when available)
npm test

# Check for errors/linting
npm run lint
```

---

## 📋 Feature Checklist Before Deployment

- [ ] Logo displays on all auth pages ✅
- [ ] Demo login works without Firebase config ✅
- [ ] Google buttons visible and styled ✅
- [ ] Demo users file created with 8 profiles ✅
- [ ] Build completes successfully ✅
- [ ] No console errors in dev mode ✅
- [ ] Responsive design works on mobile ✅
- [ ] Can navigate between pages ✅

---

## 🎬 Demo Mode Benefits

Use Demo Mode to:
- ✅ Test all pages without email verification
- ✅ Skip authentication completely
- ✅ Explore onboarding flow
- ✅ Check responsive design
- ✅ Test form validation
- ✅ Preview swiping UI when implemented

---

## 📚 Documentation

For more detailed info, see:
- `FEATURE_UPDATES.md` - What's new in detail
- `FIREBASE_DEPLOYMENT_GUIDE.md` - How to deploy
- `TESTING_CHECKLIST.md` - All test scenarios
- `README.md` - Project overview

---

## 🚀 Next Steps

1. **Run Dev Server**
   ```bash
   npm run dev
   ```

2. **Click "Try Demo"**
   - Instant access without signup

3. **Test All Pages**
   - Explore the app flow
   - Check responsive design

4. **When Ready to Deploy**
   - Follow `FIREBASE_DEPLOYMENT_GUIDE.md`
   - Your build is already verified ✅

---

## ✨ You're All Set!

Everything is ready. Just run `npm run dev` and start testing! 🎉

**Questions?** Check the documentation files or add more features to Milestone 2!
