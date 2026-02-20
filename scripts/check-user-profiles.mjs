import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';

// Firebase config from your project
const firebaseConfig = {
  apiKey: "AIzaSyCvMK81bqoKfR8gqMhRKvVIJvvhVz9QVYY",
  authDomain: "cupid-f95d1.firebaseapp.com",
  projectId: "cupid-f95d1",
  storageBucket: "cupid-f95d1.firebasestorage.app",
  messagingSenderId: "980588297535",
  appId: "1:980588297535:web:f52b53cd1e2e8d89077c04",
  measurementId: "G-94E8HLXYQ9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkUserProfiles() {
  console.log('Checking user profiles in Firebase...\n');

  try {
    // Get latest user profile
    const usersRef = collection(db, 'users');
    const q = query(usersRef, limit(5)); // Get last 5 users
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No users found in the database.');
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('═══════════════════════════════════════');
      console.log(`User ID: ${doc.id}`);
      console.log(`Email: ${data.email || 'N/A'}`);
      console.log(`Name: ${data.displayName || 'N/A'}`);
      console.log(`Age: ${data.age || 'N/A'}`);
      console.log(`Gender: ${data.gender || 'N/A'}`);
      console.log(`Looking For: ${data.lookingFor || 'N/A'}`);
      console.log(`Location: ${data.location || 'N/A'}`);
      console.log(`Bio: ${data.bio || 'N/A'}`);
      console.log(`Photos: ${data.photos?.length || 0} photos`);
      console.log(`Interests: ${JSON.stringify(data.interests || [])}`);
      console.log(`Preferences:`, JSON.stringify(data.preferences || {}, null, 2));
      console.log(`Profile Complete: ${data.profileSetupComplete || false}`);
      console.log(`Created: ${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : 'N/A'}`);
      console.log(`Updated: ${data.updatedAt ? new Date(data.updatedAt.seconds * 1000).toLocaleString() : 'N/A'}`);
      console.log('═══════════════════════════════════════\n');
    });

  } catch (error) {
    console.error('Error checking user profiles:', error);
    process.exit(1);
  }

  process.exit(0);
}

checkUserProfiles();
