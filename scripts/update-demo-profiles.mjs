/**
 * Update Demo Profiles - Add photoURL field
 * 
 * Updates existing demo profiles to add photoURL field
 * 
 * Usage: node scripts/update-demo-profiles.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCPxk1bESk-222gUpwX9A4WJJJy01nI3ak",
  authDomain: "cupid-e5874.firebaseapp.com",
  projectId: "cupid-e5874",
  storageBucket: "cupid-e5874.firebasestorage.app",
  messagingSenderId: "302226954210",
  appId: "1:302226954210:web:0d36a783337094cfb40bbb",
  measurementId: "G-Q65KNJ2V3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateDemoProfiles() {
  console.log('🔄 Updating demo profiles with photoURL...\n');
  
  try {
    const q = query(collection(db, 'users'), where('isDemoUser', '==', true));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ No demo profiles found.\n');
      process.exit(1);
    }
    
    console.log(`Found ${snapshot.size} demo profiles to update...\n`);
    
    let updated = 0;
    for (const docSnap of snapshot.docs) {
      const profile = docSnap.data();
      
      // Set photoURL to first photo in photos array
      if (profile.photos && profile.photos.length > 0) {
        try {
          await updateDoc(doc(db, 'users', docSnap.id), {
            photoURL: profile.photos[0]
          });
          console.log(`✅ Updated: ${profile.displayName}`);
          updated++;
        } catch (error) {
          console.error(`❌ Failed to update ${profile.displayName}:`, error.message);
        }
      }
    }
    
    console.log(`\n✨ Updated ${updated} profiles successfully!\n`);
    process.exit(0);
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

updateDemoProfiles();
