# Testing Infrastructure for 99Cupid Dating App

## Problem Statement

Testing a dating app requires realistic user interactions:
- Swiping through profiles
- Creating matches
- Sending messages
- Testing subscription features
- Payment flows
- Verification systems

**Challenge**: We can't test with real users before launch, and creating 20+ Gmail accounts manually is inefficient.

---

## Solution Architecture

### Three-Tier Testing System

```
┌─────────────────────────────────────────────────────┐
│                 ADMIN TESTING PANEL                  │
│  (Quick switcher, impersonation, testing tools)     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              REAL TEST ACCOUNTS (3-5)               │
│  (Gmail aliases: yourmail+test1@gmail.com, etc.)    │
│  - Can log in, send messages, make payments         │
│  - Full authentication flow                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              DEMO PROFILES (20-30)                  │
│  (Firestore-only users, appear in swipe feed)      │
│  - Profile data + photos                            │
│  - Not real Firebase Auth accounts                  │
│  - Can be swiped, matched with                      │
└─────────────────────────────────────────────────────┘
```

---

## Phase 1: Demo Profile Generator (20-30 Profiles)

### What We'll Create

**Script**: `generate-demo-profiles.mjs`

**Features**:
- Generates 20-30 realistic user profiles
- Uses free profile photo APIs or stock photos
- Diverse demographics (age, gender, interests, location)
- Stores directly in Firestore `users` collection
- Each profile marked as `isDemoUser: true`

### Data Structure for Demo Profiles

```javascript
{
  uid: 'demo_user_001',
  email: 'demo001@99cupid.internal',
  displayName: 'Sarah Chen',
  age: 24,
  gender: 'female',
  interestedIn: 'male',
  bio: 'Coffee addict ☕ | Adventure seeker 🏔️ | Dog mom 🐕',
  photos: [
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg'
  ],
  interests: ['Travel', 'Photography', 'Coffee', 'Hiking'],
  location: {
    city: 'Manila',
    region: 'Metro Manila',
    country: 'Philippines',
    coordinates: { lat: 14.5995, lng: 120.9842 }
  },
  profileSetupComplete: true,
  isVerifiedAccount: true,
  isDemoUser: true, // ← KEY FLAG
  createdAt: '2026-01-09T...',
  lastActive: '2026-01-09T...'
}
```

### Photo Sources (Free APIs)

1. **RandomUser.me API** (Realistic faces)
   ```
   https://randomuser.me/api/portraits/women/1.jpg
   https://randomuser.me/api/portraits/men/1.jpg
   ```

2. **UI Faces** (Free profile photos)
   ```
   https://uifaces.co/api?limit=20
   ```

3. **This Person Does Not Exist** (AI-generated faces)
   ```
   https://thispersondoesnotexist.com/ (manual download)
   ```

4. **Unsplash Source** (Stock photos)
   ```
   https://source.unsplash.com/400x600/?portrait,woman
   ```

### Implementation Details

**File**: `scripts/generate-demo-profiles.mjs`

```javascript
// Pseudocode structure
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const DEMO_PROFILES = [
  {
    name: 'Sarah Chen',
    age: 24,
    gender: 'female',
    interestedIn: 'male',
    bio: 'Coffee addict ☕ | Adventure seeker',
    interests: ['Travel', 'Photography'],
    photoIndex: 1
  },
  // ... 19 more profiles
];

async function generateProfiles() {
  for (let i = 0; i < DEMO_PROFILES.length; i++) {
    const profile = createFullProfile(DEMO_PROFILES[i], i);
    await setDoc(doc(db, 'users', profile.uid), profile);
  }
}
```

**Execution**:
```bash
node scripts/generate-demo-profiles.mjs
```

---

## Phase 2: Real Test Accounts (Gmail Aliases)

### Gmail Alias Trick

**One Gmail = Infinite Accounts**

If your email is: `yourmail@gmail.com`

You can create:
- `yourmail+test1@gmail.com`
- `yourmail+test2@gmail.com`
- `yourmail+test3@gmail.com`

**All emails go to the same inbox!**

### Test Account Setup

Create **5 test accounts** with different personas:

| Account | Email | Persona | Use Case |
|---------|-------|---------|----------|
| Test 1 | `yourmail+male1@gmail.com` | John, 25, Male | Primary tester |
| Test 2 | `yourmail+female1@gmail.com` | Emma, 23, Female | Match with John |
| Test 3 | `yourmail+male2@gmail.com` | Alex, 28, Male | Subscription testing |
| Test 4 | `yourmail+female2@gmail.com` | Lisa, 26, Female | Messaging testing |
| Test 5 | `yourmail+admin@gmail.com` | Admin User | Full access |

### Creation Process

**Script**: `scripts/create-test-accounts.mjs`

```javascript
// Creates accounts via Firebase Admin SDK
const testAccounts = [
  { email: 'yourmail+male1@gmail.com', password: 'Test123!@#', profile: {...} },
  // ... more accounts
];

for (const account of testAccounts) {
  // Create Firebase Auth user
  // Set up complete profile
  // Verify email automatically (admin override)
}
```

---

## Phase 3: Enhanced Admin Panel

### Features to Add

#### 3.1 Quick Account Switcher

**Location**: Admin Panel Page → New "Testing Tools" section

```
┌─────────────────────────────────────┐
│   🔄 Quick Account Switcher         │
├─────────────────────────────────────┤
│  Current: Emma Thompson (Test 2)   │
│                                     │
│  Switch to:                         │
│  ○ John Doe (Test 1)               │
│  ○ Alex Rivera (Test 3)            │
│  ○ Lisa Wang (Test 4)              │
│  ○ Admin User (Test 5)             │
│                                     │
│  [Switch Account] [Logout All]     │
└─────────────────────────────────────┘
```

**How it works**:
- Stores test account credentials securely
- `signInWithEmailAndPassword()` programmatically
- No logout needed, instant switch
- Only visible to admin users

#### 3.2 User Impersonation

**Impersonate ANY user** (including demo profiles):

```javascript
async function impersonateUser(targetUserId) {
  // Load target user profile
  // Set context without auth (admin override)
  // Navigate to home as that user
}
```

**Use case**: "Act as Sarah Chen (demo_user_001) and swipe"

#### 3.3 Quick Testing Actions

**Instant Actions Panel**:

```
┌─────────────────────────────────────┐
│   ⚡ Quick Testing Actions           │
├─────────────────────────────────────┤
│  Force Match:                       │
│  User A: [Select ▼] User B: [Select ▼]│
│  [Create Match]                     │
│                                     │
│  Send Message As:                   │
│  From: [Select ▼] To: [Select ▼]   │
│  Message: [____________]            │
│  [Send]                             │
│                                     │
│  Quick Actions:                     │
│  [Clear Swipe History]              │
│  [Reset All Matches]                │
│  [Grant Premium (24h)]              │
│  [Skip Email Verification]          │
└─────────────────────────────────────┘
```

#### 3.4 Testing Mode Toggle

**Global Override for Testing**:

```javascript
// In AuthContext or config
const TESTING_MODE = {
  enabled: true, // ← Toggle on/off
  skipEmailVerification: true,
  skipPaymentGates: false,
  unlimitedSwipes: true,
  showDemoUsers: true
};
```

**Benefits**:
- Bypass email verification
- Unlimited swipes without subscription
- See demo users in feed
- Test premium features without payment

---

## Phase 4: Testing Tools Service

### File: `src/services/TestingService.js`

**Key Functions**:

```javascript
class TestingService {
  // 1. Account Management
  async switchToTestAccount(accountId) { }
  async impersonateUser(userId) { }
  async createTestAccount(profile) { }
  
  // 2. Match Manipulation
  async forceMatch(userA, userB) { }
  async unmatch(userA, userB) { }
  async clearSwipeHistory(userId) { }
  
  // 3. Message Testing
  async sendMessageAs(fromUserId, toUserId, message) { }
  async createConversation(userA, userB, messages) { }
  
  // 4. Feature Testing
  async grantTemporaryPremium(userId, duration) { }
  async setVerificationStatus(userId, verified) { }
  async modifyUserData(userId, updates) { }
  
  // 5. Data Cleanup
  async resetUserState(userId) { }
  async deleteAllTestData() { }
  async regenerateDemoProfiles() { }
}
```

---

## Implementation Timeline

### Week 1: Foundation

**Day 1-2**: Demo Profile Generator
- Create `generate-demo-profiles.mjs` script
- Generate 20 diverse profiles
- Upload to Firestore
- Test visibility in swipe feed

**Day 3**: Test Account Creation
- Create 5 Gmail alias accounts
- Set up complete profiles
- Document credentials securely

### Week 2: Admin Tools

**Day 4-5**: Account Switcher
- Add switcher UI to Admin Panel
- Implement programmatic sign-in
- Store test account registry

**Day 6-7**: Quick Actions
- Force match functionality
- Send message as user
- Clear swipe history

### Week 3: Advanced Features

**Day 8-9**: Testing Mode
- Global testing toggle
- Feature overrides
- Admin-only access

**Day 10**: Testing & Documentation
- Full testing workflow
- Document all features
- Create testing checklist

---

## Security Considerations

### 1. Demo User Protection

**Prevent demo users from real authentication**:

```javascript
// In AuthContext
if (userProfile?.isDemoUser) {
  throw new Error('Demo users cannot authenticate');
}
```

### 2. Admin-Only Access

**Lock testing tools to admin users**:

```javascript
// In TestingService
if (!currentUser.isAdmin) {
  throw new Error('Admin access required');
}
```

### 3. Production Safety

**Disable in production**:

```javascript
const ALLOW_TESTING_TOOLS = process.env.NODE_ENV === 'development';
```

### 4. Test Account Credentials

**Store securely**:

```javascript
// Environment variable or Firestore admin collection
const TEST_ACCOUNTS = {
  test1: { email: 'x+test1@gmail.com', password: env.TEST_PASS_1 }
};
```

---

## Testing Workflow Examples

### Scenario 1: Test Matching Flow

1. **Open Admin Panel** → Quick Account Switcher
2. **Switch to "John (Test 1)"**
3. **Swipe right** on Emma (Test 2)
4. **Switch to "Emma (Test 2)"**
5. **Swipe right** on John → **MATCH!**
6. Test match modal, navigation to messages

### Scenario 2: Test Messaging

1. **Admin Panel** → Quick Actions
2. **Force Match**: John ↔ Emma
3. **Switch to John**
4. Navigate to messages → Open Emma's chat
5. Send message: "Hey!"
6. **Switch to Emma**
7. Check if message received
8. Reply and verify John receives it

### Scenario 3: Test Premium Features

1. **Admin Panel** → Quick Actions
2. **Grant Premium (24h)** to Test 3
3. **Switch to Test 3**
4. Verify unlimited swipes
5. Verify Super Likes available
6. Test premium badge visibility

### Scenario 4: Bulk Swipe Testing

1. **Switch to Test 1**
2. **Swipe through all 20 demo profiles**
3. Like 10, reject 10
4. Verify swipe history in Firestore
5. Test "You've run out of profiles" state
6. **Admin: Clear swipe history**
7. Verify profiles reappear

---

## File Structure

```
cupid99/
├── scripts/
│   ├── generate-demo-profiles.mjs     ← NEW: Demo profile generator
│   ├── create-test-accounts.mjs       ← NEW: Test account creator
│   ├── cleanup-test-data.mjs          ← NEW: Reset testing data
│   └── demo-data/
│       ├── profiles.json              ← Profile templates
│       └── photos/                    ← Downloaded stock photos
│
├── src/
│   ├── services/
│   │   └── TestingService.js          ← NEW: Testing utilities
│   │
│   ├── pages/
│   │   └── AdminPanelPage.jsx         ← ENHANCE: Add testing tools
│   │
│   └── contexts/
│       └── AuthContext.jsx            ← MODIFY: Add testing mode
│
└── TESTING_INFRASTRUCTURE.md          ← This file
```

---

## Phase-by-Phase Deliverables

### Phase 1 Deliverable
✅ Script: `generate-demo-profiles.mjs`  
✅ 20 demo profiles in Firestore  
✅ All profiles visible in swipe feed  
✅ Photos loaded correctly  

### Phase 2 Deliverable
✅ 5 test accounts created with Gmail aliases  
✅ All accounts have complete profiles  
✅ Credentials documented securely  
✅ Can log in manually to each  

### Phase 3 Deliverable
✅ Admin Panel: Quick Account Switcher  
✅ Switch between accounts without logout  
✅ Current account indicator  
✅ Admin-only access  

### Phase 4 Deliverable
✅ TestingService.js with 15+ functions  
✅ Force match functionality  
✅ Send message as any user  
✅ Clear swipe history  
✅ Grant temporary premium  
✅ Testing mode toggle  

---

## Success Criteria

After implementation, you should be able to:

1. ✅ **Generate 20 profiles** with one command
2. ✅ **Switch between test accounts** in 2 clicks
3. ✅ **Create a match** between any 2 users instantly
4. ✅ **Send messages** as any user without switching
5. ✅ **Test all features** (swipe, match, message, premium)
6. ✅ **Reset test data** with one command
7. ✅ **Complete full user flow** in under 5 minutes

---

## Best Practices

### DO ✅
- Mark demo users clearly (`isDemoUser: true`)
- Use diverse, realistic profiles
- Test on both demo and real accounts
- Document all test credentials
- Reset test data regularly
- Keep testing tools admin-only

### DON'T ❌
- Deploy demo users to production
- Hardcode passwords in code
- Mix demo and real user data
- Skip security checks in testing mode
- Leave testing mode enabled in production
- Share admin credentials

---

## Next Steps

1. **Review this document** - Confirm approach
2. **Start Phase 1** - Generate demo profiles
3. **Create test accounts** - Set up Gmail aliases
4. **Build admin tools** - Account switcher + quick actions
5. **Test everything** - Full workflow validation
6. **Document learnings** - Update this guide

---

## Questions to Answer Before Starting

1. ❓ **Your Gmail address** for test account aliases?
2. ❓ **Photo preference**: RandomUser API or manual stock photos?
3. ❓ **Number of demo profiles**: 20, 30, or 50?
4. ❓ **Demographics split**: 50/50 male/female or custom?
5. ❓ **Location**: All Manila or diverse cities?
6. ❓ **Test account password**: One shared password for all?

---

**Ready to implement Phase 1?** Let me know and I'll create the demo profile generator script.
