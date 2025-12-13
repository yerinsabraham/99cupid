# Fix: Domain Authorization Error for 99cupid.com

## Problem
Users trying to log in at https://99cupid.com/admin-login are seeing the error:
> "This domain is not authorized. Please add it to Firebase Console > Authentication > Settings > Authorized domains"

## Solution

### Step 1: Add Domain to Firebase Authorized Domains

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/cupid-e5874/authentication/settings
   - Or navigate manually:
     - Go to https://console.firebase.google.com/
     - Select project: `cupid-e5874`
     - Click "Authentication" in the left sidebar
     - Click "Settings" tab
     - Scroll down to "Authorized domains" section

2. **Add Your Domains**
   Click "Add domain" and add the following domains one by one:
   
   ✅ Required domains:
   - `99cupid.com` (your production domain)
   - `www.99cupid.com` (if you use www subdomain)
   - `localhost` (for local development - should already be there)
   - `cupid-e5874.web.app` (Firebase hosting URL - should already be there)
   - `cupid-e5874.firebaseapp.com` (Firebase app URL - should already be there)

3. **Save Changes**
   - After adding all domains, changes are saved automatically
   - No need to redeploy your application

### Step 2: Verify DNS Configuration (If Custom Domain)

If you're using a custom domain (99cupid.com), ensure it's properly connected to Firebase Hosting:

1. **In Firebase Console > Hosting**
   - Go to https://console.firebase.google.com/project/cupid-e5874/hosting
   - Check if `99cupid.com` is listed under "Domains"
   - If not, click "Add custom domain" and follow the wizard
   - Add both `99cupid.com` and `www.99cupid.com`

2. **DNS Configuration**
   You'll need to add these DNS records at your domain registrar:
   ```
   Type: A
   Name: @ (or 99cupid.com)
   Value: [Firebase IP addresses provided in console]
   
   Type: A
   Name: www
   Value: [Firebase IP addresses provided in console]
   ```

### Step 3: Clear Browser Cache (Users)

After adding the domain, instruct users to:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Or try in an incognito/private window
3. Refresh the page and try logging in again

## Current Route Information

The `/admin-login` route is **already configured to allow all users**, not just admins. The route uses the same `LoginForm` component as regular login and has no special admin-only restrictions.

The "admin-login" name is just a URL path - it doesn't restrict who can log in. Any user with valid credentials can sign in through this page.

## Testing Checklist

After adding the domain to Firebase authorized domains:

✅ Test email/password login at https://99cupid.com/admin-login
✅ Test Google sign-in at https://99cupid.com/admin-login  
✅ Test signup at https://99cupid.com/admin-signup
✅ Verify users are redirected to /home after login
✅ Check browser console for any remaining errors

## Common Issues

### Issue 1: "Domain not authorized" persists
**Solution**: 
- Wait 5-10 minutes after adding domain for changes to propagate
- Clear browser cache completely
- Try in incognito mode
- Verify the domain was actually saved in Firebase Console

### Issue 2: SSL/HTTPS Certificate issues
**Solution**: 
- Firebase automatically provisions SSL certificates for custom domains
- This can take 24-48 hours after DNS configuration
- Check status in Firebase Console > Hosting > Domain

### Issue 3: Users can't sign in with Google
**Solution**:
- Ensure Google sign-in is enabled in Firebase Console > Authentication > Sign-in method
- Verify the domain is in authorized domains
- Check if OAuth consent screen is configured in Google Cloud Console

## Quick Fix Script (Manual Check)

To verify your current Firebase authorized domains, you can check in Firebase Console:
1. Authentication > Settings > Authorized domains section
2. You should see all domains listed above

## Need More Help?

If the issue persists after following these steps:
1. Check Firebase Console > Authentication > Users to see if accounts are being created
2. Open browser DevTools (F12) > Console tab to see specific error codes
3. Check Firebase Console > Authentication > Sign-in method to ensure Email/Password and Google are enabled
4. Verify .env file has correct Firebase configuration

## Contact Support

If authentication still fails after all steps:
- Firebase Support: https://firebase.google.com/support
- Check Firebase Status: https://status.firebase.google.com/
