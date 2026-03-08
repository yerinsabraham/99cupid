import PolicyPage from '../components/common/PolicyPage';

const content = `Get Help & Support

Welcome to 99Cupid support! We're here to help you make meaningful connections. Whether you have questions, need technical assistance, or want to provide feedback, we're ready to help.

📧 Contact Us

Email: support@99cupid.com

For the fastest response, please include:
• Your registered email address
• A detailed description of your issue
• Screenshots (if applicable)
• Device type and operating system version

We typically respond within 24-48 hours during business days.

🆘 Common Issues & Quick Fixes

Account Access Issues
• Forgot password? Use the "Forgot Password" link on the login screen
• Email not verified? Check your spam folder for the verification email
• Can't log in with Google/Apple? Ensure you're using the same account you signed up with

Profile & Photos
• Photos not uploading? Check your internet connection and ensure images are under 10MB
• Profile not showing to others? Make sure your profile setup is 100% complete
• Want to update your profile? Go to Settings > Edit Profile

Matching & Swiping
• Not seeing profiles? Try adjusting your filter settings (age range, distance, etc.)
• Accidentally swiped left on someone? Premium features may include rewind functionality
• No matches yet? Keep swiping! Perfect connections take time

Messages & Chat
• Messages not sending? Check your internet connection
• Not receiving messages? Ensure notifications are enabled in your device settings
• Experiencing abusive messages? Use the block and report features immediately

Verification
• Want to verify your account? Go to Settings > Verification
• Verification pending? Our team reviews requests within 1-3 business days
• Verification rejected? Ensure photos are clear, well-lit, and match your profile

Subscription & Billing
• Questions about billing? Contact your app store (Apple App Store or Google Play)
• Want to cancel? Subscriptions are managed through your app store account
• Refund requests? Subject to app store policies

Technical Issues
• App crashing? Try updating to the latest version
• Slow performance? Clear app cache in Settings > Storage
• Features not working? Try logging out and back in

🔒 Safety & Privacy

Report a User
If someone violates our Community Guidelines:
1. Open their profile
2. Tap the three-dot menu
3. Select "Report"
4. Choose a reason and submit

We take all reports seriously and investigate within 24 hours.

Block a User
To stop seeing or hearing from someone:
1. Open their profile or chat
2. Tap the three-dot menu  
3. Select "Block User"

Account Security
• Never share your password
• Enable two-factor authentication if available
• Be cautious of suspicious links or requests for money
• Report scams immediately

🗑️ Account Management

Delete Your Account
To permanently delete your account:
1. Go to Settings
2. Scroll to "Delete Account"
3. Confirm deletion

Or email us at support@99cupid.com with your deletion request.

For detailed information, see our Data Deletion Policy.

Change Your Email
To update your email address:
1. Go to Settings
2. Select "Account Settings"
3. Update email and verify

Update Password
1. Go to Settings > Security
2. Select "Change Password"
3. Enter current password and new password

💡 Feature Requests & Feedback

We love hearing from our community! Have an idea to improve 99Cupid?

Email us at: support@99cupid.com with the subject "Feature Request"

Your feedback helps us build a better dating experience for everyone.

📚 Additional Resources

• Privacy Policy: https://99cupid.com/privacy-policy
• Terms of Service: https://99cupid.com/terms
• Community Guidelines: https://99cupid.com/community-guidelines
• Safety Tips: https://99cupid.com/safety-tips
• Data Deletion Policy: https://99cupid.com/data-deletion
• Moderation Policy: https://99cupid.com/moderation-policy

🌐 Website

Visit our website: https://99cupid.com

🕐 Support Hours

Email support is monitored:
• Monday - Friday: 9 AM - 6 PM EST
• Saturday - Sunday: Limited support (urgent issues only)

Emergency safety concerns are prioritized 24/7.

💖 Our Commitment

At 99Cupid, we believe in dating without paywalls and barriers. We're committed to:
• Responding to all support requests
• Protecting your privacy and safety
• Continuously improving based on your feedback
• Creating an inclusive, accessible dating platform for everyone

Thank you for being part of the 99Cupid community!`;

export default function SupportPage() {
  return (
    <PolicyPage
      title="Support & Help Center"
      lastUpdated="02/23/26"
      content={content}
    />
  );
}
