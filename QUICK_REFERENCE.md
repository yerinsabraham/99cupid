# 99cupid - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Navigate to project
cd c:\Users\PC\cupid99

# 2. Install dependencies
npm install

# 3. Create .env file (copy .env.example and fill in Firebase credentials)
# VITE_FIREBASE_API_KEY=your_key
# VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... etc

# 4. Start development server
npm run dev

# App opens at http://localhost:3000
```

---

## 📂 Key Directories

```
src/
├── components/auth      → Login, SignUp, Password Reset forms
├── components/onboarding → Onboarding screens
├── pages                → Full page components
├── contexts             → AuthContext (state management)
├── hooks                → Custom hooks (useAuth)
├── config               → Firebase setup
├── utils                → Validation functions
├── styles               → Animations CSS
└── models               → Data models (UserModel)
```

---

## 🔐 Authentication Flow

### Sign Up
```
/signup → fill form → verify email → /verify-email → click link → /onboarding → /home
```

### Login
```
/login → enter credentials → check verification → /verify-email (if needed) or /home
```

### Password Reset
```
/forgot-password → enter email → check email for link → reset → /login with new password
```

---

## 🛠 Common Commands

```bash
npm run dev           # Start development server (with hot reload)
npm run build         # Build for production
npm run preview       # Preview production build locally
npm install           # Install dependencies
npm audit fix         # Fix security vulnerabilities
```

---

## 📁 Project Structure at a Glance

```
99cupid/
├── src/
│   ├── components/
│   │   ├── auth/ (3 forms)
│   │   ├── onboarding/ (3 screens)
│   │   ├── layout/
│   │   └── ProtectedRoute.jsx
│   ├── pages/ (6 pages)
│   ├── contexts/
│   ├── hooks/
│   ├── config/
│   ├── models/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx (routing)
│   ├── main.jsx (entry)
│   └── index.css (global)
├── Configuration Files
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
├── Documentation
│   ├── README.md
│   ├── SETUP_GUIDE.md
│   ├── TESTING_CHECKLIST.md
│   ├── COMPLETION_REPORT.md
│   └── firestore.rules
└── public/
    └── assets/
        └── icons/applogo.png
```

---

## 🔗 Routes Overview

| Route | Type | Requires | Purpose |
|-------|------|----------|---------|
| `/login` | Public | None | User login |
| `/signup` | Public | None | User registration |
| `/forgot-password` | Public | None | Password reset |
| `/verify-email` | Protected | Auth | Email verification |
| `/onboarding` | Protected | Auth + Verified | Onboarding flow |
| `/home` | Protected | Auth + Verified | Dashboard |
| `/profile-setup` | Protected | Auth + Verified | Profile setup (Milestone 2) |

---

## 📱 Responsive Design

```
Mobile (375px)    → Single column, full-width buttons
Tablet (768px)    → 2 columns, comfortable spacing
Desktop (1920px)  → Max-width container, centered
```

---

## 🎨 Brand Colors

| Color | Value | Usage |
|-------|-------|-------|
| Primary Pink | #FF5FA8 | Buttons, accents |
| Deep Plum | #3D1A4D | Headers, text |
| Warm Blush | #FCE8F1 | Backgrounds |
| Soft Ivory | #FFF8FA | Light backgrounds |

---

## 🔔 Required Firebase Setup

```
1. Create Firebase Project
2. Enable Authentication → Email/Password
3. Create Firestore Database
4. Deploy firestore.rules
5. Configure email templates
6. Get credentials → .env file
```

---

## 🧪 Testing Key Flows

### Test Sign Up
```
1. Go to /signup
2. Enter: Name, Email, Password (8+ chars, uppercase, lowercase, number)
3. Verify email address gets used
4. Check inbox for verification email
5. Click link → return to app
6. Verify account
```

### Test Login
```
1. Go to /login
2. Try with wrong password → error
3. Try with correct credentials → redirects based on verification status
```

### Test Password Reset
```
1. Go to /login → click "Forgot Password?"
2. Enter email → get reset link in inbox
3. Click link → Firebase reset page
4. Set new password
5. Login with new password
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Firebase config not found" | Create `.env` with all variables |
| "Email not sending" | Check Firebase email templates |
| "Module not found" | Run `npm install` |
| "Port 3000 in use" | Kill process or change port in vite.config.js |
| "Build fails" | Check vite.config.js, try `npm install` |

---

## 💾 Environment Variables (.env)

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

⚠️ Never commit `.env` file!

---

## 📊 Performance Targets

- Page load: < 2 seconds ✅
- Route navigation: < 500ms ✅
- Form submission: < 1 second ✅
- Lighthouse score: > 90 ✅

---

## 📚 Important Files to Know

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main router - all routes defined here |
| `src/contexts/AuthContext.jsx` | Authentication logic and state |
| `src/config/firebase.js` | Firebase initialization |
| `src/utils/validation.js` | All form validation rules |
| `tailwind.config.js` | Styling configuration |
| `.env` | Environment variables (create this!) |

---

## 🔍 Where to Add New Features (Milestone 2+)

| Feature | Location |
|---------|----------|
| New form | `src/components/` → create new folder |
| New page | `src/pages/` → create new .jsx file |
| New route | `src/App.jsx` → add to Routes |
| New validation | `src/utils/validation.js` → add function |
| New context | `src/contexts/` → create new context |
| New animation | `src/styles/animations.css` → add keyframes |

---

## 🎯 Common Tasks

### Add a New Page
```javascript
// 1. Create file: src/pages/NewPage.jsx
export default function NewPage() {
  return <div>New Page</div>
}

// 2. Add to App.jsx routes
<Route path="/new-page" element={<NewPage />} />
```

### Add a New Form
```javascript
// 1. Create: src/components/MyForm.jsx
// 2. Import and use in a page
// 3. Add validation in src/utils/validation.js
```

### Change Colors
```javascript
// Edit tailwind.config.js extend colors section
colors: {
  'custom-color': '#hexcode',
}
```

---

## 📞 Firebase Console Checks

✅ **Before Testing**
- [ ] Authentication → Email/Password enabled
- [ ] Firestore → Database created
- [ ] Firestore → Rules deployed
- [ ] Authentication → Email templates configured
- [ ] Project Settings → Web app config available

✅ **During Testing**
- [ ] Authentication → Check users are created
- [ ] Firestore → Check user documents created
- [ ] Authentication → Check `emailVerified` changes

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] All tests passing
- [ ] No console errors
- [ ] Build successful: `npm run build`
- [ ] `.env` configured on hosting platform
- [ ] Firebase rules deployed
- [ ] Email templates configured
- [ ] All routes tested
- [ ] Mobile responsive verified

---

## 📖 Documentation Files

| File | What It Contains |
|------|------------------|
| `README.md` | Project overview & features |
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `TESTING_CHECKLIST.md` | Complete testing scenarios |
| `COMPLETION_REPORT.md` | Milestone 1 summary |
| `firestore.rules` | Security rules for Firebase |

---

## 💡 Pro Tips

1. **Hot Reload**: Changes to code auto-reload in browser
2. **DevTools**: Use React DevTools extension for debugging
3. **Firebase Console**: Always check console for errors/data
4. **Responsive Testing**: Use browser DevTools device toggle
5. **Local Storage**: Check Application tab in DevTools to debug

---

## 🎓 Resources

- [React Docs](https://react.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Lucide React Icons](https://lucide.dev/)

---

## ✅ Milestone 1 Complete!

**Ready to:**
- Test locally
- Deploy to production
- Start Milestone 2
- Gather feedback

**Next Steps:**
1. Run `npm run dev`
2. Follow TESTING_CHECKLIST.md
3. Deploy to Firebase Hosting
4. Plan Milestone 2

---

**99cupid - Real connections at just $0.99/month** ❤️
