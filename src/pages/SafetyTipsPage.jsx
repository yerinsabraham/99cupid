import PolicyPage from '../components/common/PolicyPage';

const content = `Your Safety Comes First ❤️

At 99Cupid, we believe love should be accessible — and safe.

While we work hard to monitor activity and remove bad actors, your awareness and good judgment are essential.

Please review these safety tips carefully.

1. Protect Your Personal Information

Never share:
• Your home address
• Financial details
• Banking information
• Social security numbers
• Passwords or verification codes
• Private email accounts

Never send money to someone you've just met online.

Real relationships do not begin with financial requests.

2. Recognize Common Red Flags

Be cautious if someone:
• Professes strong feelings very quickly
• Avoids video calls
• Refuses to meet in person over time
• Claims to be overseas unexpectedly
• Asks for financial help
• Requests gift cards, crypto, or wire transfers
• Has inconsistent profile information

If something feels off — trust your instincts.

3. Protect Your Financial Security

99Cupid will never:
• Ask you for your password
• Request payment outside official app stores
• Ask you to send money to another user

All subscriptions are processed securely through Apple App Store or Google Play.

4. Keep Conversations in the App

Avoid moving conversations too quickly to:
• WhatsApp
• Telegram
• Instagram
• Email

Keeping conversations within the app allows us to assist if problems arise.

5. Meeting in Person Safely

If you choose to meet someone:
• Meet in a public place
• Tell a trusted friend where you're going
• Arrange your own transportation
• Keep your phone charged
• Avoid excessive alcohol
• Leave immediately if you feel uncomfortable

You are never obligated to stay in a situation that makes you feel unsafe.

6. Report Suspicious Behavior

If you encounter:
• Harassment
• Scams
• Fake profiles
• Inappropriate content
• Threats

Use the in-app "Report" feature immediately.

We review reports seriously and may suspend or permanently remove accounts that violate our policies.

In cases involving credible threats or illegal activity, we may cooperate with law enforcement where required.

7. Age Requirement

99Cupid is strictly for individuals 18 years and older.

If you believe someone is underage, report the account immediately.

8. Emergency Situations

99Cupid does not provide emergency services.

If you are in immediate danger, contact your local emergency services immediately.

9. Your Responsibility

99Cupid connects people but does not conduct full criminal background checks on all users.

You are responsible for your own safety and interactions.

Our Commitment

We are committed to:
• Removing fraudulent accounts
• Monitoring suspicious behavior
• Improving safety systems
• Supporting users who report concerns

We built 99Cupid to be fair and affordable — and we are committed to keeping it safe.

If you have safety concerns, contact: support@99cupid.com`;

export default function SafetyTipsPage() {
  return (
    <PolicyPage
      title="Safety Tips"
      lastUpdated="02/09/26"
      content={content}
    />
  );
}
