/**
 * Cleanup Test Data Script
 * 
 * Removes all demo profiles and test data from Firestore
 * Use this before regenerating demo profiles
 * 
 * Usage: node scripts/cleanup-test-data.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase config (hardcoded for scripts)
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

/**
 * Delete all demo profiles
 */
async function cleanupDemoProfiles() {
  console.log('🧹 Cleaning up demo profiles...\n');
  
  const q = query(collection(db, 'users'), where('isDemoUser', '==', true));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log('✅ No demo profiles found. Nothing to clean up.\n');
    return 0;
  }
  
  console.log(`Found ${snapshot.size} demo profiles to delete...\n`);
  
  let deleted = 0;
  for (const docSnap of snapshot.docs) {
    const profile = docSnap.data();
    try {
      await deleteDoc(doc(db, 'users', docSnap.id));
      console.log(`🗑️  Deleted: ${profile.displayName} (${docSnap.id})`);
      deleted++;
    } catch (error) {
      console.error(`❌ Failed to delete ${docSnap.id}:`, error.message);
    }
  }
  
  return deleted;
}

/**
 * Main cleanup function
 */
async function cleanup() {
  console.log('🚀 99Cupid Test Data Cleanup');
  console.log('============================\n');
  
  const deletedCount = await cleanupDemoProfiles();
  
  console.log('\n============================');
  console.log(`✅ Cleanup complete! Deleted ${deletedCount} demo profiles.\n`);
  
  process.exit(0);
}

// Run cleanup
cleanup().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
