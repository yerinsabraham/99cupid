/**
 * Script to set admin privileges for specific users
 * Run this in Firebase Console or via Node.js with Firebase Admin SDK
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './src/config/firebase.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Set admin status for a user by email
 * @param {string} email - User email address
 */
async function setAdminByEmail(email) {
  try {
    console.log(`🔍 Searching for user with email: ${email}`);
    
    // Find user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error(`❌ User not found with email: ${email}`);
      console.log('💡 Make sure the user has signed up first!');
      return false;
    }

    // Update user to admin
    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      isAdmin: true,
      adminSince: new Date().toISOString()
    });

    console.log(`✅ Successfully set ${email} as admin!`);
    console.log(`📋 User ID: ${userId}`);
    return true;
  } catch (error) {
    console.error('❌ Error setting admin:', error.message);
    return false;
  }
}

// Admin emails to set
const adminEmails = [
  '99cupidlove@gmail.com',
  'yerinssaibs@gmail.com'
];

// Run the script
async function setAdmins() {
  console.log('🚀 Starting admin setup...\n');
  
  for (const email of adminEmails) {
    await setAdminByEmail(email);
    console.log(''); // Empty line for readability
  }
  
  console.log('✨ Admin setup complete!');
  process.exit(0);
}

setAdmins();
