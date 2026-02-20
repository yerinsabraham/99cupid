import PolicyPage from '../components/common/PolicyPage';

const content = `1. Acceptance of Terms

By accessing or using the 99Cupid mobile application ("App"), website, or related services (collectively, the "Service"), you agree to be bound by these Terms and Conditions ("Terms").

If you do not agree to these Terms, you may not use the Service.

2. Eligibility

You must:
• Be at least 18 years old
• Have the legal capacity to enter into a binding agreement
• Not be prohibited from using dating services under applicable law

By using 99Cupid, you represent and warrant that you meet these requirements.

3. Account Registration

To access certain features, you must create an account.

You agree to:
• Provide accurate and truthful information
• Keep your login credentials secure
• Be responsible for all activity under your account

We reserve the right to suspend or terminate accounts containing false or misleading information.

4. Subscription & Payments

99Cupid offers full premium access for $0.99 per month (subject to change).

Payments are processed through third-party providers such as:
• Apple App Store
• Google Play Store

We do not store your full payment details.

Subscriptions may automatically renew unless canceled through your platform provider.
Refunds are governed by the policies of Apple or Google, depending on where your subscription was purchased.

Deleting your account does not automatically cancel your subscription.

5. User Conduct

You agree NOT to:
• Harass, threaten, or abuse other users
• Impersonate another person
• Post false, misleading, or fraudulent information
• Share illegal, explicit, or harmful content
• Solicit money or financial assistance from other users
• Use the Service for scams or commercial solicitation

Violations may result in suspension or permanent removal.

6. User Content

You retain ownership of content you upload, including photos, messages, and profile information.

By posting content on 99Cupid, you grant us a non-exclusive, worldwide, royalty-free license to:
• Display
• Host
• Reproduce
• Distribute

This license exists solely for the purpose of operating and improving the Service.
You are solely responsible for your content.

7. Safety & Interactions

99Cupid does not conduct full criminal background checks on all users.

You acknowledge and agree that:
• You are responsible for your interactions
• You will exercise caution when communicating or meeting others
• 99Cupid is not responsible for user behavior outside the platform

8. Moderation & Enforcement

We may monitor, review, and remove content or accounts that violate our Community Guidelines.

Enforcement actions may include:
• Warnings
• Temporary suspension
• Permanent account removal
• Reporting to authorities where required

We reserve the right to take action at our discretion to protect users and the integrity of the Service.

9. Account Termination

We may suspend or terminate your account if:
• These Terms are violated
• Fraud or abuse is suspected
• Required by law

You may delete your account at any time through the app or by contacting support.

10. Intellectual Property

All app design, branding, logos, software, and related materials are the property of 99Cupid.

You may not copy, modify, distribute, reverse engineer, or exploit any portion of the Service without written permission.

11. Disclaimer of Warranties

The Service is provided "as is" and "as available."

We do not guarantee:
• Matches
• Relationship outcomes
• Continuous availability
• Error-free operation

Use of the Service is at your own risk.

12. Limitation of Liability

To the fullest extent permitted by law, 99Cupid shall not be liable for:
• Indirect or consequential damages
• Emotional distress
• Lost profits
• User interactions

Our maximum liability shall not exceed the amount paid by you in the previous 12 months.

13. Indemnification

You agree to indemnify and hold harmless 99Cupid, its owners, affiliates, and employees from any claims, damages, liabilities, losses, or expenses arising from:
• Your use of the Service
• Your violation of these Terms
• Your interactions with other users
• Your posted content

14. Dispute Resolution

Before initiating formal legal proceedings, you agree to attempt to resolve disputes informally by contacting: support@99cupid.com

If a dispute cannot be resolved informally, it may be resolved through binding arbitration in Ontario, Canada, except where prohibited by applicable law.

15. Force Majeure

99Cupid shall not be liable for failure or delay in performance resulting from causes beyond reasonable control, including:
• Natural disasters
• Internet outages
• Governmental actions
• Third-party service disruptions

16. Governing Law

These Terms shall be governed by and interpreted in accordance with the laws of the Province of Ontario, Canada, without regard to conflict of law principles.

Any disputes arising out of or relating to these Terms or the use of the Service shall be subject to the exclusive jurisdiction of the courts located in Ontario, Canada, except where mandatory consumer protection laws in your country of residence apply.

17. Changes to Terms

We may update these Terms periodically.

Continued use of the Service after updates constitutes acceptance of the revised Terms.

18. Contact Information

If you have questions regarding these Terms, please contact:
• Email: support@99cupid.com
• Website: https://99cupid.com/

By using 99Cupid, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.`;

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms and Conditions"
      lastUpdated="02/09/26"
      content={content}
    />
  );
}
