import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB9OeLjZaNwsCDWBB6qlF3GLHZ7kQDsKEs",
  authDomain: "cupid-e5874.firebaseapp.com",
  projectId: "cupid-e5874",
  storageBucket: "cupid-e5874.firebasestorage.app",
  messagingSenderId: "302226954210",
  appId: "1:302226954210:web:41c8e2b35dc0a49c4c03df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userId = '40152qILi6WbEAVNYIn38yQ5qVi1';

try {
  console.log(`\n🔍 Fetching profile for user: ${userId}\n`);
  
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log('✅ User Profile Data:');
    console.log('====================');
    console.log('Name:', data.displayName || '❌ NOT SET');
    console.log('Age:', data.age || '❌ NOT SET');
    console.log('Gender:', data.gender || '❌ NOT SET');
    console.log('Location:', data.location || '❌ NOT SET');
    console.log('Bio:', data.bio || '(empty)');
    console.log('Photos:', data.photos?.length || 0, 'photos');
    console.log('Interests:', data.interests?.length || 0, 'interests');
    console.log('Profile Complete:', data.profileSetupComplete ? '✅ YES' : '❌ NO');
    console.log('\n📸 Photo URLs:', data.photos || []);
    console.log('\n❤️ Interests:', data.interests || []);
    console.log('\n📋 Full Document:');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('❌ Document does not exist!');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

process.exit(0);
