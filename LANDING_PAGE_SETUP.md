# Landing Page Setup Guide - 99Cupid

## Overview
Beautiful, responsive landing page with email collection, Firestore integration, and automated confirmation emails via EmailJS.

**Live URL:** https://cupid-e5874.web.app/landing

---

## Features ✨

✅ **Email Collection** - Captures early user emails with optional fields
✅ **Firestore Integration** - Saves all submissions to `earlyUsers` collection
✅ **Automated Emails** - Sends instant confirmation via EmailJS
✅ **Founding Members** - First 500 users get special benefits
✅ **Real-time Counter** - Shows remaining founding spots
✅ **Responsive Design** - Mobile-first with beautiful gradients
✅ **Social Sharing** - Twitter & Facebook share buttons
✅ **Animated 99 Logos** - Subtle branding throughout the page

---

## EmailJS Setup (Required)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail**
4. Connect your Gmail: **99Cupidlove@gmail.com**
5. Note your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

**Template Name:** 99Cupid Early Access Confirmation

**Subject:** 
```
Thanks for joining 99Cupid — early access confirmed
```

**Email Body:**
```html
Hi {{to_name}},

Thanks for joining 99Cupid — we've added you to our early access list.

🎉 {{founding_status}}: {{founding_benefit}}

Reminder: Messaging will be available to subscribers for $0.99/month at launch.

We'll keep you posted. Meanwhile, feel free to reply to this email with any questions.

— 99Cupid Team
99Cupidlove@gmail.com
```

4. Save the template and note your **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `AbCdEfGh123456789`)

### Step 5: Update Code
Open `src/pages/LandingPage.jsx` and replace these placeholders:

```javascript
// Line 21:
emailjs.init('YOUR_EMAILJS_PUBLIC_KEY'); // Replace with your Public Key

// Line 69-70:
await emailjs.send(
  'YOUR_SERVICE_ID',      // Replace with your Service ID
  'YOUR_TEMPLATE_ID',     // Replace with your Template ID
  templateParams
);
```

**Example:**
```javascript
emailjs.init('AbCdEfGh123456789');

await emailjs.send(
  'service_abc123',
  'template_xyz789',
  templateParams
);
```

---

## Firestore Setup (Already Done ✅)

The `earlyUsers` collection is automatically created when first user submits.

**Collection:** `earlyUsers`

**Document Structure:**
```javascript
{
  email: "user@example.com",
  name: "John Doe",               // optional
  role: "interested-user",        // or "potential-cofounder"
  referral: "Twitter",            // optional
  founderCandidate: true,         // true if within first 500
  submittedAt: Timestamp,
  source: "landing"
}
```

**Security Rules:** Already deployed ✅

---

## Testing Checklist

Before going live, test:

1. ✅ Visit https://cupid-e5874.web.app/landing
2. ✅ Submit email and check Firestore for document
3. ✅ Check inbox for confirmation email
4. ✅ Verify success screen shows correct founding status
5. ✅ Test on mobile devices (responsive design)
6. ✅ Test social share buttons
7. ✅ Try submitting duplicate email (should still work)

---

## Deployment

Landing page will be deployed automatically with the main app:

```bash
npm run build
firebase deploy --only hosting
```

Landing page accessible at: **https://cupid-e5874.web.app/landing**

---

## Email Template Variables

EmailJS automatically replaces these in your template:

- `{{to_email}}` - Recipient's email address
- `{{to_name}}` - Recipient's name (or "there" if not provided)
- `{{founding_status}}` - "Founding Member" or "Early Access"
- `{{founding_benefit}}` - Different message based on founding status

---

## Founding Members Logic

- **First 500 signups:** `founderCandidate: true` + "Founding Member" email
- **After 500:** `founderCandidate: false` + "Early Access" email
- **Benefit:** 6 months free premium access (worth $5.94)

Counter updates in real-time as users submit.

---

## Color Theme

Uses app's existing pink-to-purple gradient:
- **Primary:** `from-pink-500 to-purple-600`
- **Backgrounds:** `from-pink-50 via-purple-50 to-pink-50`
- **Accents:** Pink-100, Purple-100 for cards

---

## Assets Used

1. **App Logo:** `/applogo.png` (header)
2. **99 Logo:** `/99logo.png` (animated throughout)
3. **Hero Image:** `/newFrame 57.jpg.png` (right side)

All assets automatically copied to `public/` folder.

---

## Social Share URLs

**Twitter:**
```
https://twitter.com/intent/tweet?text=I just joined 99Cupid early access! Find love across borders for just $0.99/month 💕&url=https://cupid-e5874.web.app/landing
```

**Facebook:**
```
https://www.facebook.com/sharer/sharer.php?u=https://cupid-e5874.web.app/landing
```

---

## Troubleshooting

### Emails not sending?
1. Check EmailJS dashboard for errors
2. Verify Gmail connection is active
3. Check browser console for errors
4. Ensure Public Key, Service ID, and Template ID are correct

### Landing page not showing?
1. Clear browser cache
2. Check URL: https://cupid-e5874.web.app/landing
3. Verify deployment completed successfully

### Counter not updating?
- Firestore security rules must allow read access
- Check browser console for Firestore errors

---

## Cost

**EmailJS Free Tier:**
- 200 emails/month free
- Upgrade to $9/month for 1,000 emails
- Good for initial launch

**Alternative:** 
If you hit limits, we can switch to Cloud Functions + SendGrid (more setup but better for scale).

---

## Next Steps

1. ✅ Set up EmailJS account (5 minutes)
2. ✅ Update the 3 placeholders in LandingPage.jsx
3. ✅ Deploy: `npm run build && firebase deploy`
4. ✅ Test the landing page
5. ✅ Share on social media!

---

## Support

Questions? Email: 99Cupidlove@gmail.com

Landing page is ready to collect early users! 🚀💕
