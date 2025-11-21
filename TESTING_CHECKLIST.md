# 99cupid Milestone 1 - Testing Checklist

## Pre-Testing Setup

- [ ] All dependencies installed (`npm install`)
- [ ] `.env` file created with Firebase credentials
- [ ] Firebase project set up with:
  - [ ] Email/Password authentication enabled
  - [ ] Firestore database created
  - [ ] Security rules deployed
  - [ ] Email templates configured
- [ ] Development server running (`npm run dev`)
- [ ] No console errors on page load

---

## Test 1: Sign Up Flow

### Validation Testing
- [ ] **Invalid Email**: Try submitting with `user@`, `@example.com` → Error: "Please enter a valid email address"
- [ ] **Missing Email**: Leave email blank → Error: "Email is required"
- [ ] **Missing Name**: Leave name blank → Error: "Name is required"
- [ ] **Short Name**: Enter name with 1 character → Error: "Name must be at least 2 characters"
- [ ] **Long Name**: Enter name with 51+ characters → Error: "Name must be less than 50 characters"
- [ ] **Missing Password**: Leave password blank → Error: "Password is required"
- [ ] **Short Password**: Enter password with < 8 chars → Error: "Password must be at least 8 characters"
- [ ] **No Uppercase**: Password `lowercasepass1` → Error: "Must contain at least one uppercase letter"
- [ ] **No Lowercase**: Password `UPPERCASEPASS1` → Error: "Must contain at least one lowercase letter"
- [ ] **No Number**: Password `PasswordNoNumber` → Error: "Must contain at least one number"
- [ ] **Mismatched Passwords**: Confirm password different from password → Error: "Passwords do not match"

### Successful Sign Up
- [ ] Enter valid: Name, Email, Strong Password (e.g., `MyPass123`)
- [ ] Click "Create Account"
- [ ] Success message appears: "Account created! Please check your email..."
- [ ] Redirect to `/verify-email` after 2 seconds
- [ ] Can see email address on verification page

### Edge Cases
- [ ] Try signing up with same email twice → Error: "Email already registered"
- [ ] Enter email that's already used by another account → Error: "Email already registered"
- [ ] Check that form clears after successful submission

---

## Test 2: Email Verification

### Email Receipt
- [ ] Check email inbox for verification email from Firebase
- [ ] Email contains "Verify your email address"
- [ ] Email has clickable verification link
- [ ] Check spam folder if not in inbox

### Verification Process
- [ ] Click verification link in email → Opens Firebase verification page
- [ ] Return to app
- [ ] Click "I've Verified My Email" button
- [ ] Should redirect to onboarding screens

### Resend Email
- [ ] Click "Resend Email" button
- [ ] Loading state shows (spinner)
- [ ] Success message: "Verification email sent!"
- [ ] Receive new verification email

### Logout Option
- [ ] Click "Logout" button
- [ ] Redirect to `/login`
- [ ] No access to `/verify-email` anymore

### Error Scenarios
- [ ] Try accessing `/verify-email` without being logged in → Redirect to login
- [ ] Click "I've Verified My Email" before verifying → Error: "Email not verified yet"

---

## Test 3: Login Flow

### Validation Testing
- [ ] **Missing Email**: Leave email blank → Error: "Email is required"
- [ ] **Invalid Email**: Enter `notanemail` → Error: "Please enter a valid email"
- [ ] **Missing Password**: Leave password blank → Error: "Password is required"

### Authentication Testing
- [ ] **Wrong Email**: Enter non-existent email → Error: "No account found with this email"
- [ ] **Right Email, Wrong Password**: → Error: "Incorrect password"
- [ ] **Valid Email & Password**: Login successful → Redirect based on verification status

### Redirect Logic
- [ ] **If Email Not Verified**: After login → Redirect to `/verify-email`
- [ ] **If Email Verified**: After login → Redirect to `/home`

### UI Interactions
- [ ] Password toggle (eye icon) shows/hides password
- [ ] "Forgot Password?" link navigates to `/forgot-password`
- [ ] "Create Account" link navigates to `/signup`
- [ ] Loading state shows during login (spinner in button)

### Session Persistence
- [ ] Login, then refresh page → Stay logged in
- [ ] Logout, then refresh page → Redirect to login
- [ ] Close browser and reopen → Session persists (if local storage enabled)

---

## Test 4: Password Reset

### Initial Access
- [ ] From `/login`, click "Forgot Password?" → Navigate to `/forgot-password`
- [ ] See "Back to Login" button
- [ ] Cannot access without being logged in

### Email Submission
- [ ] **Missing Email**: Leave blank → Error: "Email is required"
- [ ] **Invalid Email**: `notvalid@` → Error: "Please enter a valid email address"
- [ ] **Valid Email (registered)**: Success message: "Password reset email sent! Check your inbox."

### Email Verification
- [ ] Check email for password reset link
- [ ] Click link → Opens Firebase password reset page
- [ ] Enter new password
- [ ] Submit and return to app

### Login with New Password
- [ ] Go to `/login`
- [ ] Login with old password → Error: "Incorrect password"
- [ ] Login with new password → Successful login

### Edge Cases
- [ ] Submit reset email for unregistered address → Still shows success (for security)
- [ ] Cannot reset password multiple times rapidly → Rate limiting works

---

## Test 5: Onboarding Flow

### Screen Navigation
- [ ] **Screen 1 (Welcome)**:
  - [ ] Shows logo and "99cupid" text
  - [ ] Shows tagline: "Real connections begin at just $0.99/month"
  - [ ] "Get Started" button navigates to Screen 2
  - [ ] Progress dots show 1 of 3

- [ ] **Screen 2 (Real Connections)**:
  - [ ] Shows three feature cards with icons
  - [ ] "Back" button goes to Screen 1
  - [ ] "Continue" button goes to Screen 3
  - [ ] Progress dots show 2 of 3

- [ ] **Screen 3 (Authentic Profile)**:
  - [ ] Shows three feature cards about profiles
  - [ ] Special offer badge visible: "$0.99" highlighted
  - [ ] "Back" button goes to Screen 2
  - [ ] "Create Profile" button navigates to `/profile-setup`
  - [ ] Progress dots show 3 of 3

### Animations
- [ ] Page transitions smooth (fade-in animation)
- [ ] Bounce animation on logo (Screen 1)
- [ ] Hover effects on buttons (lift up slightly)
- [ ] Cards have hover shadow effects

### Mobile Responsiveness
- [ ] On mobile: Buttons are full width or 2-column on bottom
- [ ] Text is readable without zoom
- [ ] Touch targets are 44px+ height
- [ ] No horizontal scroll

---

## Test 6: Navigation & Auth Guards

### Protected Routes
- [ ] Try accessing `/home` without login → Redirect to `/login`
- [ ] Try accessing `/onboarding` without login → Redirect to `/login`
- [ ] Try accessing `/profile-setup` without login → Redirect to `/login`

### Verification Requirement
- [ ] Login with unverified email → Redirect to `/verify-email`
- [ ] Cannot manually access `/home` → Redirect to `/verify-email`
- [ ] Verify email → Can access `/home`

### Authenticated User Redirects
- [ ] Logged in user goes to `/login` → Redirect to `/home` (or `/verify-email` if not verified)
- [ ] Logged in user goes to `/signup` → Redirect to `/home`
- [ ] Logged in user goes to `/forgot-password` → Redirect to `/home`

### Session Management
- [ ] Logout from home → Redirect to `/login`
- [ ] Logout from any page → Redirect to `/login`
- [ ] Try accessing protected routes after logout → Redirect to login

### Browser Back Button
- [ ] After logout, can't go back to protected routes
- [ ] Forward button works after navigating back

---

## Test 7: Responsive Design

### Mobile (375px - iPhone SE)
- [ ] **Layout**: 
  - [ ] Single column layout
  - [ ] Form fields stack vertically
  - [ ] Buttons are full width
  
- [ ] **Text & Readability**:
  - [ ] No horizontal scroll
  - [ ] Text is readable at normal size (no pinch zoom needed)
  - [ ] Inputs have proper padding

- [ ] **Touch Targets**:
  - [ ] Buttons are at least 44px tall
  - [ ] Form inputs are easily tappable
  - [ ] No overlapping tap targets

- [ ] **Images & Icons**:
  - [ ] Logo properly sized
  - [ ] Icons render correctly
  - [ ] No broken images

### Tablet (768px - iPad)
- [ ] Form width is not too wide
- [ ] Cards render with proper spacing
- [ ] 2-column layouts display correctly
- [ ] All functionality works on touch

### Desktop (1920px)
- [ ] Max-width container is respected
- [ ] Content is centered
- [ ] Proper spacing between elements
- [ ] Hover states work

### Different Browsers
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work
- [ ] Edge: All features work

---

## Test 8: Error Handling

### Network Errors
- [ ] Disconnect internet → Try to submit form → Error: "Network error..."
- [ ] Reconnect internet → Can submit form successfully

### Firebase Errors
- [ ] Too many login attempts → Error: "Too many attempts. Please try again later"
- [ ] Invalid Firebase config → Console error, app doesn't load

### Form Submission
- [ ] All validation errors display correctly
- [ ] Multiple errors show simultaneously
- [ ] Error messages are clear and actionable
- [ ] Errors clear when user corrects field

### Loading States
- [ ] During signup: Button shows "Creating Account..." with spinner
- [ ] During login: Button shows "Signing In..." with spinner
- [ ] During password reset: Button shows "Sending..." with spinner
- [ ] Buttons are disabled during loading
- [ ] Spinners animate smoothly

---

## Test 9: Firebase Integration

### User Document Creation
After successful signup:
- [ ] Go to Firebase Console → Firestore Database
- [ ] Check `users` collection
- [ ] Find document with your uid
- [ ] Verify fields:
  - [ ] `uid`: Matches current user's uid
  - [ ] `email`: Correct email address
  - [ ] `displayName`: Name you entered
  - [ ] `isVerifiedAccount`: false (before verification)
  - [ ] `profileSetupComplete`: false
  - [ ] `createdAt`: Timestamp created
  - [ ] `updatedAt`: Timestamp created
  - [ ] `photoURL`: null
  - [ ] `bio`: Empty string

### Email Verification in Firebase
- [ ] Firebase Console → Authentication
- [ ] Verify user exists in users list
- [ ] Before clicking link: `emailVerified` = false
- [ ] After verification: `emailVerified` = true

### Data Persistence
- [ ] Create account, logout, login again
- [ ] User data is retrieved correctly
- [ ] Display name shows correctly on home page
- [ ] Email shows correctly on home page

### Security Rules
- [ ] Cannot read other user's documents (test in console)
- [ ] Cannot write to other user's documents
- [ ] Cannot delete user documents
- [ ] Can only access your own user document

---

## Test 10: UI/UX Polish

### Animations & Transitions
- [ ] All button hovers have smooth transition
- [ ] Page transitions are smooth (fade-in)
- [ ] Loading spinners rotate smoothly
- [ ] Error messages animate in
- [ ] Success messages animate in

### Styling Consistency
- [ ] All primary buttons are pink (#FF5FA8)
- [ ] All secondary buttons have pink border
- [ ] Consistent border radius (12px minimum)
- [ ] Consistent spacing/padding
- [ ] Font weights are consistent

### Color Scheme
- [ ] Pink primary: #FF5FA8
- [ ] Gradients look smooth
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Background gradients are not overwhelming

### Typography
- [ ] Headings use bold (700)
- [ ] Body text uses regular (400)
- [ ] Labels use medium (500)
- [ ] Buttons use semibold (600)

### Accessibility
- [ ] All form inputs have labels
- [ ] All buttons have visible text (no icon-only)
- [ ] Focus indicators are visible (outline on input)
- [ ] Error messages are readable
- [ ] Color is not sole means of conveying info

---

## Test 11: Performance

### Page Load
- [ ] First page load: < 3 seconds
- [ ] Route navigation: Instant (< 500ms)
- [ ] Form submission: < 2 seconds (with network)

### Lighthouse Scores
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

### Bundle Size
- [ ] Production build: < 500KB (uncompressed)
- [ ] Gzipped: < 150KB

### No Console Errors
- [ ] Open DevTools → Console
- [ ] No red errors
- [ ] No critical warnings
- [ ] No failed network requests

---

## Test 12: Data & Security

### Input Validation
- [ ] Special characters in name: Allowed if valid
- [ ] SQL injection attempts in email: Prevented
- [ ] XSS attempts in name: Prevented
- [ ] Very long inputs: Truncated or rejected appropriately

### Password Security
- [ ] Passwords always sent over HTTPS
- [ ] Passwords never logged
- [ ] Passwords not visible in localStorage
- [ ] Passwords properly reset via email

### Data Privacy
- [ ] Only logged-in users can access their data
- [ ] Email address not visible to other users (yet)
- [ ] Personal data encrypted in transit
- [ ] No sensitive data in browser storage

---

## Final Sign-Off Checklist

### Core Functionality
- [ ] Sign up works end-to-end
- [ ] Email verification works
- [ ] Login works
- [ ] Password reset works
- [ ] Logout works
- [ ] Onboarding displays correctly
- [ ] All navigation works

### Technical Requirements
- [ ] Firebase properly configured
- [ ] All routes protected correctly
- [ ] Auth state persists on refresh
- [ ] No console errors
- [ ] No broken links

### User Experience
- [ ] All forms validate input
- [ ] Error messages are clear
- [ ] Loading states show progress
- [ ] Animations are smooth
- [ ] Mobile responsive

### Production Ready
- [ ] Environment variables configured
- [ ] Firestore rules deployed
- [ ] Email templates configured
- [ ] No test data left in Firebase
- [ ] Security audit passed

---

## Sign-Off

- **Tester**: ___________________
- **Date**: ___________________
- **Passed**: [ ] Yes [ ] No

**Notes**: ________________________________________________________________

---

**Milestone 1 Status**: Ready for Deployment ✅
