# 🚀 Cupid99 - New PC Setup Guide

This guide will help you set up the Cupid dating app on a new development machine.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Firebase CLI** - Install with `npm install -g firebase-tools`
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

---

## 🔧 Step 1: Clone the Repository

```bash
git clone <your-github-repo-url>
cd cupid99
```

---

## 📦 Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`.

---

## 🔐 Step 3: Configure Environment Variables

### **CRITICAL: Create `.env` file**

The `.env` file is **NOT** included in the repository for security reasons. You must create it manually.

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Add Firebase credentials** to `.env`:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSyCPxk1bESk-222gUpwX9A4WJJJy01nI3ak
   VITE_FIREBASE_AUTH_DOMAIN=cupid-e5874.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=cupid-e5874
   VITE_FIREBASE_STORAGE_BUCKET=cupid-e5874.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=302226954210
   VITE_FIREBASE_APP_ID=1:302226954210:web:0d36a783337094cfb40bbb
   VITE_FIREBASE_MEASUREMENT_ID=G-Q65KNJ2V3N
   ```

   > ⚠️ **IMPORTANT:** These are your actual Firebase project credentials. Keep them secure!

---

## 🔥 Step 4: Firebase CLI Setup

### **Login to Firebase**

```bash
firebase login
```

This will open a browser window for authentication.

### **Select Project**

The project is already configured in `firebase.json`, but verify:

```bash
firebase use cupid-e5874
```

---

## 🏃 Step 5: Run Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## 🏗️ Step 6: Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

---

## 🚀 Step 7: Deploy to Firebase

```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy hosting + Firestore rules
firebase deploy --only "hosting,firestore:rules"

# Deploy everything
firebase deploy
```

---

## 📁 Files NOT in Git (You Need These)

These files are in `.gitignore` and must be configured on each new machine:

### **1. `.env` (REQUIRED)**
- **Location:** Root directory
- **Purpose:** Firebase configuration
- **How to get:** See Step 3 above or Firebase Console → Project Settings

### **2. `node_modules/` (Auto-generated)**
- **Location:** Root directory
- **Purpose:** npm packages
- **How to get:** Run `npm install`

### **3. `dist/` (Auto-generated)**
- **Location:** Root directory
- **Purpose:** Production build files
- **How to get:** Run `npm run build`

### **4. `.firebaserc` (Ignored for security)**
- **Location:** Root directory
- **Purpose:** Firebase project alias
- **Content:**
  ```json
  {
    "projects": {
      "default": "cupid-e5874"
    }
  }
  ```
- **How to get:** Run `firebase use cupid-e5874` or create manually

---

## 🔑 Firebase Console Access

You'll need access to the Firebase project to:
- View analytics
- Manage users
- Update Firestore rules
- Configure authentication providers

**Firebase Console:** https://console.firebase.google.com/project/cupid-e5874

---

## 🌐 Deployment URLs

- **Production:** https://99cupid.com
- **Firebase Hosting:** https://cupid-e5874.web.app
- **Firebase Project Console:** https://console.firebase.google.com/project/cupid-e5874

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Firebase
firebase login           # Login to Firebase
firebase deploy          # Deploy everything
firebase serve           # Test locally with Firebase

# Git
git pull                 # Get latest changes
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to GitHub
```

---

## 📚 Project Structure

```
cupid99/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── services/       # Firebase/API services
│   ├── utils/          # Helper functions
│   ├── config/         # Configuration files
│   └── contexts/       # React contexts
├── public/             # Static assets
├── dist/               # Production build (generated)
├── .env                # Environment variables (NOT in Git)
├── firebase.json       # Firebase configuration
├── firestore.rules     # Database security rules
└── package.json        # Dependencies
```

---

## 🔒 Security Notes

### **Never commit these to Git:**
- `.env` file
- Firebase private keys
- API secrets
- User data

### **Files already protected by `.gitignore`:**
- `.env`
- `.env.local`
- `.firebaserc`
- `node_modules/`
- `dist/`

---

## ❓ Troubleshooting

### **"Firebase not initialized" error**
- Make sure `.env` file exists with correct values
- Run `npm install` to ensure dependencies are installed

### **"Permission denied" during deploy**
- Run `firebase login` again
- Check that you have access to the Firebase project

### **Build errors**
- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again

### **Port 5173 already in use**
- Kill the existing process or use a different port:
  ```bash
  npm run dev -- --port 3000
  ```

---

## 👥 Team Collaboration

When working with multiple developers:

1. **Always pull before starting work:**
   ```bash
   git pull
   ```

2. **Create feature branches:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit regularly with clear messages:**
   ```bash
   git commit -m "feat: add user profile completion percentage"
   ```

4. **Push your changes:**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🎉 You're All Set!

Your development environment is now ready. Start coding!

For questions or issues, refer to the main project documentation or contact the team.

---

**Last Updated:** December 25, 2025
**Project:** Cupid Dating App (99cupid.com)
**Firebase Project:** cupid-e5874
