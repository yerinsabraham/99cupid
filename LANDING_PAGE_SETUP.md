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
4. Connect your Gmail: **support@99cupid.com**
5. Note your **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Configure the template settings:

**Template Name:** 99Cupid Early Access Confirmation

**To Email:** (IMPORTANT - Click "Edit" and enter exactly this)
```
{{to_email}}
```

**From Name:**
```
99Cupid Team
```

**Subject:** 
```
Thanks for joining 99Cupid — early access confirmed
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>99Cupid Early Access</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #fdf2f8 100%); min-height: 100vh;">
  
  <!-- Container -->
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Email Card -->
        <table role="presentation" style="max-width: 600px; width: 100%; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(236, 72, 153, 0.1); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                99<span style="font-size: 28px;">💕</span>Cupid
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 16px; font-weight: 500;">
                Early Access Confirmed
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; line-height: 1.6;">
                Hi <strong>{{to_name}}</strong>,
              </p>
              
              <!-- Message -->
              <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.7;">
                Thanks for joining <strong style="color: #ec4899;">99Cupid</strong> — we've added you to our early access list.
              </p>
              
              <!-- Status Badge -->
              <table role="presentation" style="width: 100%; margin: 0 0 25px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%); border-left: 4px solid #ec4899; padding: 20px; border-radius: 12px;">
                    <p style="margin: 0; color: #be185d; font-size: 16px; line-height: 1.6;">
                      🎉 <strong>{{founding_status}}</strong>: {{founding_benefit}}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Reminder -->
              <p style="margin: 0 0 25px 0; color: #6b7280; font-size: 15px; line-height: 1.6; padding: 15px; background: #f9fafb; border-radius: 10px;">
                💬 <strong>Reminder:</strong> Messaging will be available to subscribers for <strong style="color: #ec4899;">$0.99/month</strong> at launch.
              </p>
              
              <!-- Call to Action -->
              <table role="presentation" style="width: 100%; margin: 0 0 25px 0;">
                <tr>
                  <td align="center">
                    <a href="https://cupid-e5874.web.app" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 25px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);">
                      Visit 99Cupid →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Footer Message -->
              <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                We'll keep you posted. Meanwhile, feel free to reply to this email with any questions.
              </p>
              
            </td>
          </tr>
          
          <!-- Email Footer -->
          <tr>
            <td style="background: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0 0 8px 0; color: #374151; font-size: 15px; font-weight: 600;">
                — 99Cupid Team
              </p>
              <p style="margin: 0 0 15px 0;">
                <a href="mailto:support@99cupid.com" style="color: #ec4899; text-decoration: none; font-size: 14px;">
                  support@99cupid.com
                </a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                Find love across borders for just $0.99/month 💕
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
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

**Note:** If you don't see the logo or latest changes:
- **Hard refresh:** Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- **Firefox:** Press `Ctrl + F5` or clear cache in Settings → Privacy & Security → Clear Data
- **Chrome:** Press `Ctrl + Shift + Delete` and clear cached images/files

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
**Error: "The recipients address is empty" (Status 422)**

This means the EmailJS template is not configured correctly. Fix:

1. Go to EmailJS Dashboard → Email Templates
2. Select your template (`template_sm7bz89`)
3. Click on **Settings** tab
4. Find the **"To Email"** field
5. **CRITICAL:** Enter exactly: `{{to_email}}` (with the double curly braces)
6. Save the template

Without `{{to_email}}` in the "To Email" field, EmailJS doesn't know where to send emails.

**Other checks:**
1. Verify Gmail connection is active in Email Services
2. Check browser console for specific error messages
3. Ensure Public Key, Service ID, and Template ID are correct in code

### Landing page not showing?
1. Clear browser cache (Ctrl + Shift + R or Ctrl + F5)
2. Check URL: https://cupid-e5874.web.app/landing
3. Verify deployment completed successfully

### Logo not showing?
- Hard refresh your browser (Ctrl + Shift + R)
- Clear browser cache completely
- Different browsers cache differently - try in incognito/private mode first

### Counter not updating?
- Firestore security rules must allow read access
- Check browser console for Firestore errors

### Modal not appearing (Firefox)?
- Clear Firefox cache: Settings → Privacy & Security → Clear Data
- Try hard refresh: Ctrl + F5
- Test in private browsing mode first

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

Questions? Email: support@99cupid.com

Landing page is ready to collect early users! 🚀💕
