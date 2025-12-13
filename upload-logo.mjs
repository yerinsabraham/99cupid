// Upload Logo to Firebase Storage
// This script uploads the logo to Firebase Storage with public access

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase configuration (from .env)
const firebaseConfig = {
  apiKey: "AIzaSyCPxk1bESk-222gUpwX9A4WJJJy01nI3ak",
  authDomain: "cupid-e5874.firebaseapp.com",
  projectId: "cupid-e5874",
  storageBucket: "cupid-e5874.firebasestorage.app",
  messagingSenderId: "302226954210",
  appId: "1:302226954210:web:0d36a783337094cfb40bbb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function uploadLogo() {
  try {
    console.log('📤 Uploading logo to Firebase Storage...');
    
    // Read the logo file
    const logoPath = join(__dirname, 'public', 'applogo.png');
    const logoBuffer = readFileSync(logoPath);
    
    // Create a reference to 'assets/logo.png'
    const logoRef = ref(storage, 'assets/logo.png');
    
    // Set metadata for the file
    const metadata = {
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000', // Cache for 1 year
    };
    
    // Upload the file
    await uploadBytes(logoRef, logoBuffer, metadata);
    console.log('✅ Logo uploaded successfully!');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(logoRef);
    console.log('\n📋 Public URL for your logo:');
    console.log(downloadURL);
    console.log('\n✨ Use this URL in your EmailJS template!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading logo:', error);
    process.exit(1);
  }
}

uploadLogo();
