# Upload Logo to Firebase Storage - Manual Steps

## Quick Steps to Upload Logo

### Option 1: Upload via Firebase Console (Easiest)

1. **Go to Firebase Storage:**
   - Visit: https://console.firebase.google.com/project/cupid-e5874/storage
   - Or navigate: Firebase Console > Storage > Files

2. **Create assets folder:**
   - Click "Create folder"
   - Name it: `assets`
   - Click "Create"

3. **Upload the logo:**
   - Click on the `assets` folder
   - Click "Upload file"
   - Select: `c:\Users\PC\cupid99\public\applogo.png`
   - Rename to: `logo.png` (if needed)

4. **Get the public URL:**
   - Click on the uploaded `logo.png` file
   - In the right panel, find "Access token" section
   - Copy the "Download URL" 
   - It will look like: `https://firebasestorage.googleapis.com/v0/b/cupid-e5874.firebasestorage.app/o/assets%2Flogo.png?alt=media&token=xxxxx`

### Option 2: Use Firebase CLI (if Option 1 doesn't work)

Since the upload script needs authentication, you can upload directly through the console (Option 1) which is simpler and faster.

## Update EmailJS Template

Once you have the public URL, update your EmailJS template:

### Current Header (to replace):
```html
<h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">99<span style="font-size: 28px;">💕</span>Cupid</h1>
```

### New Header (with logo):
```html
<img src="YOUR_PUBLIC_URL_HERE" alt="99Cupid Logo" style="height: 60px; width: auto; display: block; margin: 0 auto;" />
```

Or if you want to keep some text with the logo:
```html
<div style="text-align: center;">
  <img src="YOUR_PUBLIC_URL_HERE" alt="99Cupid Logo" style="height: 50px; width: auto; display: block; margin: 0 auto 10px;" />
  <p style="margin: 0; color: white; font-size: 20px; font-weight: 600;">Find love across borders 💕</p>
</div>
```

## Full Updated Email Template

Here's your complete email template with the logo in the header:

```html
<!-- Container -->
<table style="width: 100%; border-collapse: collapse;" role="presentation">
<tbody>
<tr>
<td style="padding: 40px 20px;" align="center">
<!-- Email Card -->
<table style="max-width: 600px; width: 100%; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(236, 72, 153, 0.1); overflow: hidden;" role="presentation">
<tbody>
<!-- Header with Gradient -->
<tr>
<td style="background: linear-gradient(135deg, #ec4899 0%, #9333ea 100%); padding: 40px 30px; text-align: center;">
  <!-- Logo replacing text -->
  <img src="https://firebasestorage.googleapis.com/v0/b/cupid-e5874.firebasestorage.app/o/assets%2Flogo.png?alt=media" 
       alt="99Cupid Logo" 
       style="height: 60px; width: auto; display: block; margin: 0 auto 10px;" />
  <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 16px; font-weight: 500;">Early Access Confirmed</p>
</td>
</tr>
<!-- Main Content -->
<tr>
<td style="padding: 40px 30px;">
  <!-- Greeting -->
  <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; line-height: 1.6;">Hi <strong>{{to_name}}</strong>,</p>
  <!-- Message -->
  <p style="margin: 0 0 25px 0; color: #374151; font-size: 16px; line-height: 1.7;">Thanks for joining <strong style="color: #ec4899;">99Cupid</strong> &mdash; we've added you to our early access list.</p>
  <!-- Status Badge -->
  <table style="width: 100%; margin: 0 0 25px 0;" role="presentation">
  <tbody>
  <tr>
  <td style="background: linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%); border-left: 4px solid #ec4899; padding: 20px; border-radius: 12px;">
    <p style="margin: 0; color: #be185d; font-size: 16px; line-height: 1.6;">🎉 <strong>{{founding_status}}</strong>: {{founding_benefit}}</p>
  </td>
  </tr>
  </tbody>
  </table>
  <!-- Reminder -->
  <p style="margin: 0 0 25px 0; color: #6b7280; font-size: 15px; line-height: 1.6; padding: 15px; background: #f9fafb; border-radius: 10px;">💬 <strong>Reminder:</strong> Messaging will be available to subscribers for <strong style="color: #ec4899;">$0.99/month</strong> at launch.</p>
  <!-- Footer Message -->
  <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">We'll keep you posted. Meanwhile, feel free to reply to this email with any questions.</p>
</td>
</tr>
<!-- Email Footer -->
<tr>
<td style="background: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #f0f0f0;">
  <p style="margin: 0 0 8px 0; color: #374151; font-size: 15px; font-weight: 600;">&mdash; 99Cupid Team</p>
  <p style="margin: 0 0 15px 0;"><a style="color: #ec4899; text-decoration: none; font-size: 14px;" href="mailto:support@99cupid.com">support@99cupid.com</a></p>
  <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">Find love across borders for just $0.99/month 💕</p>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
```

## Steps to Update EmailJS Template

1. **Go to EmailJS Dashboard:**
   - Visit: https://dashboard.emailjs.com/
   - Login with your account

2. **Find Your Template:**
   - Click on "Email Templates"
   - Find template ID: `template_sm7bz89` (the user confirmation template)

3. **Edit the Template:**
   - Click "Edit" on the template
   - Replace the `<h1>99💕Cupid</h1>` line with the new logo `<img>` tag
   - Use the public URL from Firebase Storage

4. **Test the Template:**
   - Click "Test it" button
   - Send a test email to yourself
   - Verify the logo displays correctly

5. **Save:**
   - Click "Save" to apply changes

## Notes

- The logo will be publicly accessible (read-only) from the `/assets` folder
- The updated storage rules have been deployed
- Email clients will cache the logo, so updates may take time to reflect
- Make sure the logo looks good on different email clients (Gmail, Outlook, etc.)
