/**
 * Demo Users for Testing
 * These are mock user profiles used for testing the swiping and matching features
 * Using actual profile images from assets/images folder
 */

export const demoUsers = [
  {
    uid: 'demo-user-001',
    id: 'user_001',
    displayName: 'Emma',
    age: 24,
    gender: 'female',
    email: 'emma.demo@cupid99.test',
    photoURL: '/mockpp1-female.jpg',
    photos: ['/mockpp1-female.jpg'],
    bio: 'Adventure seeker ✈️ | Coffee enthusiast ☕ | Looking for genuine connections',
    location: 'San Francisco, CA',
    interests: ['Travel', 'Photography', 'Hiking', 'Cooking'],
    isVerified: true,
    isVerifiedAccount: true,
    profileSetupComplete: true,
    hasActiveSubscription: true,
    subscriptionStatus: 'active',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    uid: 'demo-user-002',
    id: 'user_002',
    displayName: 'Sophie',
    age: 23,
    gender: 'female',
    email: 'sophie.demo@cupid99.test',
    photoURL: '/mockpp2-female.jpeg',
    photos: ['/mockpp2-female.jpeg'],
    bio: 'Artist & dog lover 🐕 | Wine tasting | Passionate about creative writing',
    location: 'New York, NY',
    interests: ['Art', 'Music', 'Dogs', 'Wine'],
    isVerified: true,
    isVerifiedAccount: true,
    profileSetupComplete: true,
    hasActiveSubscription: true,
    subscriptionStatus: 'active',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    uid: 'demo-user-003',
    id: 'user_003',
    displayName: 'Alex',
    age: 26,
    gender: 'male',
    email: 'alex.demo@cupid99.test',
    photoURL: '/mockpp3-male.jpeg',
    photos: ['/mockpp3-male.jpeg'],
    bio: 'Tech enthusiast 💻 | Fitness junkie 💪 | Into hiking and mountain biking',
    location: 'Austin, TX',
    interests: ['Technology', 'Fitness', 'Biking', 'Gaming'],
    isVerified: false,
    isVerifiedAccount: true,
    profileSetupComplete: true,
    hasActiveSubscription: false,
    subscriptionStatus: 'inactive',
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    uid: 'demo-user-004',
    id: 'user_004',
    displayName: 'Michael',
    age: 28,
    gender: 'male',
    email: 'michael.demo@cupid99.test',
    photoURL: '/mockpp4-male.jpeg',
    photos: ['/mockpp4-male.jpeg'],
    bio: 'Engineer by day, musician by night 🎸 | Love outdoor activities and good conversations',
    location: 'Seattle, WA',
    interests: ['Music', 'Engineering', 'Hiking', 'Coffee'],
    isVerified: true,
    isVerifiedAccount: true,
    profileSetupComplete: true,
    hasActiveSubscription: true,
    subscriptionStatus: 'active',
    createdAt: new Date('2024-02-14').toISOString(),
  },
];

/**
 * Get demo users for swiping interface
 * @returns {Array} Array of demo user objects
 */
export function getDemoUsers() {
  return demoUsers;
}

/**
 * Get a demo user by ID
 * @param {string} userId - The ID of the user to retrieve
 * @returns {Object|null} The user object or null if not found
 */
export function getDemoUserById(userId) {
  return demoUsers.find(user => user.id === userId) || null;
}

/**
 * Get random demo users for swiping
 * @param {number} count - Number of users to return (default: 4)
 * @returns {Array} Array of random demo users
 */
export function getRandomDemoUsers(count = 4) {
  const shuffled = [...demoUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, demoUsers.length));
}

/**
 * Get demo users by gender
 * @param {string} gender - 'male' or 'female'
 * @returns {Array} Array of filtered demo users
 */
export function getDemoUsersByGender(gender) {
  return demoUsers.filter(user => user.gender === gender);
}
