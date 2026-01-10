/**
 * Demo Profile Generator for 99Cupid Testing
 * 
 * Generates 20 realistic demo profiles with photos from RandomUser.me API
 * Profiles are stored in Firestore and appear in swipe feed
 * 
 * Usage: node scripts/generate-demo-profiles.mjs
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

// Demo profile templates (10 male, 10 female, diverse locations)
const DEMO_PROFILES = [
  // FEMALE PROFILES (10)
  {
    name: 'Sofia Martinez',
    age: 24,
    gender: 'female',
    interestedIn: 'male',
    bio: '🌮 Foodie | 📸 Photography enthusiast | ✈️ Travel addict',
    interests: ['Photography', 'Travel', 'Cooking', 'Music'],
    city: 'Mexico City',
    country: 'Mexico',
    lat: 19.4326,
    lng: -99.1332,
    photoGender: 'women',
    photoIndex: 1
  },
  {
    name: 'Amara Okonkwo',
    age: 26,
    gender: 'female',
    interestedIn: 'male',
    bio: '💃 Dancer | 📚 Book lover | 🎨 Creative soul',
    interests: ['Dance', 'Reading', 'Art', 'Fashion'],
    city: 'Lagos',
    country: 'Nigeria',
    lat: 6.5244,
    lng: 3.3792,
    photoGender: 'women',
    photoIndex: 2
  },
  {
    name: 'Isabella Santos',
    age: 23,
    gender: 'female',
    interestedIn: 'male',
    bio: '🏖️ Beach vibes | 🎵 Music festival junkie | ☕ Coffee addict',
    interests: ['Music', 'Beach', 'Coffee', 'Yoga'],
    city: 'Rio de Janeiro',
    country: 'Brazil',
    lat: -22.9068,
    lng: -43.1729,
    photoGender: 'women',
    photoIndex: 3
  },
  {
    name: 'Maya Reyes',
    age: 25,
    gender: 'female',
    interestedIn: 'male',
    bio: '🌸 Nature lover | 🧘 Wellness advocate | 🌙 Night owl',
    interests: ['Yoga', 'Hiking', 'Wellness', 'Travel'],
    city: 'Manila',
    country: 'Philippines',
    lat: 14.5995,
    lng: 120.9842,
    photoGender: 'women',
    photoIndex: 4
  },
  {
    name: 'Zara Ahmed',
    age: 27,
    gender: 'female',
    interestedIn: 'male',
    bio: '👗 Fashion designer | 🎭 Theater lover | 🌍 World explorer',
    interests: ['Fashion', 'Theater', 'Travel', 'Design'],
    city: 'Cape Town',
    country: 'South Africa',
    lat: -33.9249,
    lng: 18.4241,
    photoGender: 'women',
    photoIndex: 5
  },
  {
    name: 'Emma Thompson',
    age: 22,
    gender: 'female',
    interestedIn: 'male',
    bio: '🎬 Film buff | 🍕 Pizza connoisseur | 🏃‍♀️ Marathon runner',
    interests: ['Movies', 'Running', 'Food', 'Music'],
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    photoGender: 'women',
    photoIndex: 6
  },
  {
    name: 'Priya Sharma',
    age: 28,
    gender: 'female',
    interestedIn: 'male',
    bio: '🧑‍💻 Tech enthusiast | 🎮 Gamer | 🍜 Foodie explorer',
    interests: ['Technology', 'Gaming', 'Food', 'Travel'],
    city: 'Mumbai',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    photoGender: 'women',
    photoIndex: 7
  },
  {
    name: 'Olivia Chen',
    age: 24,
    gender: 'female',
    interestedIn: 'male',
    bio: '🎨 Artist | 🍣 Sushi lover | 🚴‍♀️ Cycling enthusiast',
    interests: ['Art', 'Cycling', 'Food', 'Photography'],
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    photoGender: 'women',
    photoIndex: 8
  },
  {
    name: 'Lucia Fernandez',
    age: 26,
    gender: 'female',
    interestedIn: 'male',
    bio: '💃 Salsa dancer | 🎸 Music lover | 🌅 Sunset chaser',
    interests: ['Dance', 'Music', 'Photography', 'Beach'],
    city: 'Barcelona',
    country: 'Spain',
    lat: 41.3851,
    lng: 2.1734,
    photoGender: 'women',
    photoIndex: 9
  },
  {
    name: 'Yuki Tanaka',
    age: 25,
    gender: 'female',
    interestedIn: 'male',
    bio: '🍜 Ramen expert | 📖 Manga reader | 🎌 Culture enthusiast',
    interests: ['Food', 'Reading', 'Culture', 'Travel'],
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    photoGender: 'women',
    photoIndex: 10
  },

  // MALE PROFILES (10)
  {
    name: 'Carlos Rodriguez',
    age: 27,
    gender: 'male',
    interestedIn: 'female',
    bio: '⚽ Football fanatic | 🎸 Guitarist | 🌮 Taco enthusiast',
    interests: ['Sports', 'Music', 'Food', 'Travel'],
    city: 'Buenos Aires',
    country: 'Argentina',
    lat: -34.6037,
    lng: -58.3816,
    photoGender: 'men',
    photoIndex: 1
  },
  {
    name: 'Kofi Mensah',
    age: 29,
    gender: 'male',
    interestedIn: 'female',
    bio: '🏀 Basketball player | 🎵 Music producer | ✈️ Adventure seeker',
    interests: ['Sports', 'Music', 'Travel', 'Photography'],
    city: 'Accra',
    country: 'Ghana',
    lat: 5.6037,
    lng: -0.1870,
    photoGender: 'men',
    photoIndex: 2
  },
  {
    name: 'Lucas Silva',
    age: 25,
    gender: 'male',
    interestedIn: 'female',
    bio: '🏄‍♂️ Surfer | 🌴 Beach lover | 🎧 EDM fan',
    interests: ['Surfing', 'Beach', 'Music', 'Fitness'],
    city: 'São Paulo',
    country: 'Brazil',
    lat: -23.5505,
    lng: -46.6333,
    photoGender: 'men',
    photoIndex: 3
  },
  {
    name: 'Miguel Santos',
    age: 26,
    gender: 'male',
    interestedIn: 'female',
    bio: '🏊‍♂️ Swimmer | 🍻 Craft beer lover | 🏝️ Island hopper',
    interests: ['Swimming', 'Beer', 'Travel', 'Food'],
    city: 'Cebu',
    country: 'Philippines',
    lat: 10.3157,
    lng: 123.8854,
    photoGender: 'men',
    photoIndex: 4
  },
  {
    name: 'Thabo Ndlovu',
    age: 28,
    gender: 'male',
    interestedIn: 'female',
    bio: '🦁 Wildlife photographer | 🏔️ Hiker | 🌍 Explorer',
    interests: ['Photography', 'Hiking', 'Wildlife', 'Travel'],
    city: 'Johannesburg',
    country: 'South Africa',
    lat: -26.2041,
    lng: 28.0473,
    photoGender: 'men',
    photoIndex: 5
  },
  {
    name: 'James Wilson',
    age: 24,
    gender: 'male',
    interestedIn: 'female',
    bio: '🎮 Gamer | 🍺 Pub quiz champion | ⚽ Arsenal fan',
    interests: ['Gaming', 'Sports', 'Trivia', 'Beer'],
    city: 'Manchester',
    country: 'United Kingdom',
    lat: 53.4808,
    lng: -2.2426,
    photoGender: 'men',
    photoIndex: 6
  },
  {
    name: 'Arjun Kapoor',
    age: 30,
    gender: 'male',
    interestedIn: 'female',
    bio: '🏏 Cricket lover | 🍛 Foodie | 🎬 Bollywood buff',
    interests: ['Cricket', 'Food', 'Movies', 'Travel'],
    city: 'Delhi',
    country: 'India',
    lat: 28.7041,
    lng: 77.1025,
    photoGender: 'men',
    photoIndex: 7
  },
  {
    name: 'Ryan Tan',
    age: 27,
    gender: 'male',
    interestedIn: 'female',
    bio: '💼 Entrepreneur | 🏃 Marathon runner | ☕ Coffee snob',
    interests: ['Business', 'Running', 'Coffee', 'Technology'],
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    photoGender: 'men',
    photoIndex: 8
  },
  {
    name: 'Diego Alvarez',
    age: 25,
    gender: 'male',
    interestedIn: 'female',
    bio: '🏖️ Beach volleyball | 🎨 Street art lover | 🌮 Tapas expert',
    interests: ['Sports', 'Art', 'Food', 'Beach'],
    city: 'Valencia',
    country: 'Spain',
    lat: 39.4699,
    lng: -0.3763,
    photoGender: 'men',
    photoIndex: 9
  },
  {
    name: 'Kenji Sato',
    age: 26,
    gender: 'male',
    interestedIn: 'female',
    bio: '🎮 Game developer | 🍱 Bento master | 🗻 Mt. Fuji climber',
    interests: ['Gaming', 'Food', 'Hiking', 'Technology'],
    city: 'Osaka',
    country: 'Japan',
    lat: 34.6937,
    lng: 135.5023,
    photoGender: 'men',
    photoIndex: 10
  }
];

/**
 * Create full profile object from template
 */
function createFullProfile(template, index) {
  const uid = `demo_user_${String(index + 1).padStart(3, '0')}`;
  
  return {
    // Identity
    uid,
    email: `${uid}@99cupid.internal`,
    displayName: template.name,
    
    // Profile basics
    age: template.age,
    gender: template.gender,
    interestedIn: template.interestedIn,
    bio: template.bio,
    
    // Photos from RandomUser.me API
    photos: [
      `https://randomuser.me/api/portraits/${template.photoGender}/${template.photoIndex}.jpg`,
      `https://randomuser.me/api/portraits/${template.photoGender}/${template.photoIndex + 20}.jpg`,
      `https://randomuser.me/api/portraits/${template.photoGender}/${template.photoIndex + 40}.jpg`
    ],
    
    // Primary photo URL (used by SwipeCard)
    photoURL: `https://randomuser.me/api/portraits/${template.photoGender}/${template.photoIndex}.jpg`,
    
    // Interests
    interests: template.interests,
    
    // Location
    location: {
      city: template.city,
      region: template.city,
      country: template.country,
      coordinates: {
        lat: template.lat,
        lng: template.lng
      }
    },
    
    // Profile status
    profileSetupComplete: true,
    isVerifiedAccount: true,
    isDemoUser: true, // KEY FLAG - marks as demo profile
    
    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    
    // Additional realistic data
    height: template.gender === 'male' ? 170 + Math.floor(Math.random() * 20) : 155 + Math.floor(Math.random() * 20),
    education: ['High School', 'Bachelor\'s Degree', 'Master\'s Degree'][Math.floor(Math.random() * 3)],
    occupation: ['Student', 'Professional', 'Entrepreneur', 'Creative'][Math.floor(Math.random() * 4)],
    
    // User stats (for realism)
    likesReceived: Math.floor(Math.random() * 50),
    likesGiven: Math.floor(Math.random() * 30),
    matchCount: Math.floor(Math.random() * 10),
    
    // Subscription (all demo users are free)
    subscriptionStatus: 'free',
    subscriptionTier: 'free'
  };
}

/**
 * Check if demo profiles already exist
 */
async function checkExistingDemoProfiles() {
  const { collection, query, where, getDocs } = await import('firebase/firestore');
  const q = query(collection(db, 'users'), where('isDemoUser', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * Generate and upload all demo profiles
 */
async function generateDemoProfiles() {
  console.log('🚀 99Cupid Demo Profile Generator');
  console.log('==================================\n');
  console.log('📝 Generating 20 demo profiles...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < DEMO_PROFILES.length; i++) {
    const profile = createFullProfile(DEMO_PROFILES[i], i);
    
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', profile.uid), profile);
      console.log(`✅ [${i + 1}/20] ${profile.displayName} (${profile.city}, ${profile.country})`);
      successCount++;
    } catch (error) {
      console.error(`❌ [${i + 1}/20] Failed to create ${profile.displayName}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n==================================');
  console.log('📊 Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📍 Total: ${DEMO_PROFILES.length}`);
  console.log('==================================\n');
  
  if (successCount > 0) {
    console.log('✨ Demo profiles generated successfully!');
    console.log('   They will now appear in the swipe feed.');
    console.log('   Look for users with "isDemoUser: true" flag.\n');
  }
  
  process.exit(0);
}

// Run the generator
generateDemoProfiles().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
