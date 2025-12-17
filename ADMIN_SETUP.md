# Set Admin Users - Instructions

## Quick Method: Using Firebase Console

1. Go to Firebase Console: https://console.firebase.google.com/project/cupid-e5874/firestore
2. Navigate to **Firestore Database**
3. Find the `users` collection
4. Search for the user documents with these emails:
   - `99cupidlove@gmail.com`
   - `yerinssaibs@gmail.com`

5. For each user document:
   - Click on the document
   - Click "Add field" button
   - Field name: `isAdmin`
   - Field type: `boolean`
   - Value: `true`
   - Click "Add"

## Alternative: Run in Browser Console

1. Open your app: https://cupid-e5874.web.app (or localhost)
2. Sign in with your admin account (99cupidlove@gmail.com)
3. Open browser DevTools (F12)
4. Go to Console tab
5. Paste this code:

```javascript
// Import Firestore functions
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './src/config/firebase';

async function setAdmin(email) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.error('User not found:', email);
    return;
  }
  
  const userDoc = snapshot.docs[0];
  await updateDoc(doc(db, 'users', userDoc.id), {
    isAdmin: true,
    adminSince: new Date().toISOString()
  });
  
  console.log('✅ Admin set:', email);
}

// Set both admins
await setAdmin('99cupidlove@gmail.com');
await setAdmin('yerinssaibs@gmail.com');
```

## Verification

After setting admin, verify by:
1. Sign in with admin account
2. Navigate to `/admin` route
3. You should see the admin panel

---

## Current Status

✅ **Firestore Rules Deployed** - Verification rules are live
⏳ **Admin Setup** - Follow instructions above
⏳ **Testing** - Test verification flows after admin setup

## What to Test

1. **Phone Verification**
   - Navigate to Profile → Verification
   - Start phone verification
   - Enter phone number
   - Receive and enter OTP (currently logs to console for testing)

2. **Photo Verification**
   - Navigate to Profile → Verification
   - Start photo verification
   - Take selfie or upload photo
   - Submit for review

3. **ID Verification**
   - Navigate to Profile → Verification
   - Start ID verification
   - Select ID type
   - Upload front/back images
   - Submit for review

4. **Admin Panel** (after setting admin)
   - Navigate to `/admin`
   - Review pending verifications
   - Approve/reject submissions

## Next Steps

- Test verification flows locally
- Review and approve test verifications in admin panel
- Deploy when ready: `npm run build && firebase deploy`
