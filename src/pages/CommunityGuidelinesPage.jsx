import PolicyPage from '../components/common/PolicyPage';

const content = `Everyone Deserves Love — Respectfully.

1. Respect & Safety First

Treat all users with kindness and dignity.

The following is strictly prohibited:
• Harassment or bullying  
• Hate speech or discriminatory language
• Threats or intimidation
• Sexual coercion or aggressive behavior
• Stalking or repeated unwanted contact

99Cupid connects people globally — respect cultural differences and boundaries.

2. Zero Tolerance for Scams & Exploitation

Financial exploitation is strictly prohibited.

This includes:
• Asking for money
• Requesting gift cards
• Investment or crypto pitches
• Romance scams
• Emergency money requests

Accounts engaging in financial solicitation will be permanently removed.

3. Authentic Profiles Only

You must:
• Use real photos of yourself
• Provide truthful information
• Avoid impersonating others

Fake accounts, catfishing, and stolen images will result in immediate removal.

4. No Explicit, Illegal, or Harmful Content

The following content is prohibited:
• Nudity or sexually explicit material
• Pornographic content
• Graphic violence
• Illegal activity promotion
• Exploitation or abuse content
• Content involving minors

99Cupid is strictly for users 18 and older.

Any attempt to involve minors will result in immediate removal and possible reporting to authorities.

5. Privacy Protection

Do not:
• Share private information of other users
• Post phone numbers or addresses publicly
• Distribute screenshots without consent
• Attempt to dox or expose users

Respect boundaries and confidentiality.

6. Off-Platform Misconduct

Misconduct that occurs outside the app but originates from 99Cupid interactions may still result in enforcement action.

We reserve the right to remove accounts that engage in harmful behavior beyond the platform.

7. Reporting & Cooperation

If you encounter:
• Harassment
• Scams
• Fake profiles
• Inappropriate content

Use the in-app Report feature immediately.

We review reports seriously and may request additional information during investigations.

8. Enforcement Actions

Violations may result in:
• Warning
• Temporary suspension
• Permanent removal
• Device or IP restrictions
• Reporting to law enforcement where appropriate

Enforcement decisions are made at our discretion to protect the community.

9. Our Mission

99Cupid was built to make dating fair and affordable.

We believe:
• Love should be accessible
• Safety should be standard
• Respect creates real connection

Help us build a better dating environment.

10. Final Reminder

Always prioritize your safety.
• Meet in public places
• Inform a trusted contact
• Trust your instincts

You are never obligated to remain in a situation that makes you uncomfortable.

By continuing to use 99Cupid, you agree to follow these Community Guidelines.`;

export default function CommunityGuidelinesPage() {
  return (
    <PolicyPage
      title="Community Guidelines"
      lastUpdated="02/09/26"
      content={content}
    />
  );
}
