import PolicyPage from '../components/common/PolicyPage';

const content = `Introduction

Welcome to 99Cupid.

We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, process, and safeguard your information when you use our mobile application, website, and related services (collectively, the "Service").

By using 99Cupid, you consent to the collection and use of information as described in this Privacy Policy.

1. Information We Collect

A. Personal Information

When you create an account, we may collect:
• Name or username  
• Email address
• Date of birth and age
• Gender and preferences
• Profile photos
• Bio and profile details
• Country of residence
• Approximate location

If you purchase a subscription:
• Payment confirmation information (processed securely through Apple App Store or Google Play — we do not store full credit card details)

B. Usage & Device Information

We may automatically collect:
• Device type
• Operating system
• IP address
• Device identifiers
• App usage activity
• Time and date of use
• Crash logs
• Diagnostics and performance data

This helps us maintain app stability and prevent fraud.

C. Location Information

We may collect approximate location data to help match users within relevant regions.
We do not collect precise GPS location unless explicitly permitted by you.

D. Communications Data

If you use messaging features, we may collect:
• Messages sent through the platform
• Likes, matches, and connection activity

This data helps provide core functionality and maintain user safety.

2. Legal Basis for Processing (International Users)

Where applicable (including EU, UK, and similar jurisdictions), we process personal data based on:
• Your consent
• Performance of our contract with you
• Compliance with legal obligations
• Legitimate interests in operating and improving the Service

3. How We Use Your Information

We use your information to:
• Create and manage your account
• Provide core app features (search, match, message)
• Personalize your experience
• Improve app performance
• Detect fraud, scams, and abuse
• Provide customer support
• Process subscriptions
• Enforce our Terms and Community Guidelines

We do not sell your personal data.

4. Advertising & Tracking

99Cupid does not sell personal data to third parties.
We do not engage in cross-app tracking for advertising purposes.

If analytics or advertising services are used, only limited, anonymized, or aggregated information may be used to improve performance and user experience.

Private messages are never shared with advertisers.

5. Sharing of Information

We may share information:
• With trusted third-party service providers (cloud hosting, analytics, fraud detection, payment processors)
• To comply with legal obligations
• To enforce our Terms and policies
• To protect user safety

All service providers are contractually obligated to safeguard your data.

6. Data Retention

We retain personal data for as long as your account remains active or as necessary to provide the Service.

Upon account deletion:
• Profile data is removed from active systems immediately
• Encrypted backups may retain data for up to 30–90 days
• After that period, data is permanently erased

Certain limited information may be retained for:
• Legal compliance
• Fraud prevention
• Financial recordkeeping
• Misconduct prevention

Retention is limited to what is legally required.

7. Data Security

We implement commercially reasonable safeguards, including:
• Encrypted data transmission (HTTPS)
• Secure hosting environments
• Access controls
• Monitoring systems

However, no system is completely secure.

8. Your Rights

Depending on your jurisdiction, you may have the right to:
• Access your personal data
• Correct inaccurate data
• Request deletion
• Withdraw consent
• Restrict processing
• Opt out of marketing communications

You may submit requests by contacting support@99cupid.com.

California Privacy Rights:
California residents may request information regarding categories of personal data collected and request deletion in accordance with applicable laws.

9. International Data Transfers

99Cupid operates globally. By using the Service, you understand and consent that your data may be processed in jurisdictions outside your country of residence, subject to appropriate safeguards.

10. Children's Privacy

99Cupid is strictly for individuals aged 18 and older.

We do not knowingly collect data from minors. If we become aware that a minor has provided personal information, we will delete it promptly.

11. Changes to This Privacy Policy

We may update this Privacy Policy periodically.

Updates will be posted within the app and on our website. Continued use of the Service after updates constitutes acceptance of the revised policy.

12. Contact Us

If you have questions regarding this Privacy Policy:
• Email: support@99cupid.com  
• Website: https://99cupid.com/

By using 99Cupid, you acknowledge that you have read and understood this Privacy Policy.`;

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      lastUpdated="02/09/26"
      content={content}
    />
  );
}
