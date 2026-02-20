import PolicyPage from '../components/common/PolicyPage';

const content = `Your Data. Your Choice.

At 99Cupid, we respect your right to control your personal information. This Data Deletion Policy explains how you can delete your account, what happens to your data, and what information may be retained for legal or safety reasons.

1. How to Delete Your Account

You may delete your account at any time using one of the following methods:

Option 1: In-App Deletion
1. Open the 99Cupid app
2. Go to Settings
3. Select "Delete Account"
4. Confirm deletion

Your account will be permanently scheduled for removal.

Option 2: Email Request

If you cannot access the app, you may request deletion by contacting:
📧 support@99cupid.com

Please include:
• The email associated with your account
• Your username (if available)

We may request identity verification to protect your account from unauthorized deletion requests.

2. What Data Is Deleted

When your account is deleted, we remove from active systems:
• Profile information
• Photos
• Bio and preferences
• Messages (from active databases)
• Match history
• Account identifiers

Your profile will no longer be visible to other users.

Deleted accounts cannot be restored.

3. Data That May Be Retained

Certain limited information may be retained for legitimate purposes, including:
• Transaction records (legal and accounting obligations)
• Records of misconduct or moderation actions
• Fraud prevention and abuse detection data
• Legal compliance requirements
• Backup system archives (temporarily)

Retention is limited to what is necessary and permitted by applicable law.

4. Deletion Timeline

• Account data is removed from active systems promptly after confirmation.
• Encrypted backup systems may retain data for up to 30–90 days.
• After that period, backup data is permanently erased.

In certain cases involving fraud, abuse, or legal requirements, limited data may be retained beyond standard timelines as required by law.

5. Subscription Cancellation

Deleting your account does not automatically cancel your subscription.

You must cancel your subscription separately through:
• Apple App Store
• Google Play Store

Refunds and billing matters are governed by their respective policies.

6. Moderation-Related Data

If your account is under investigation or involved in a moderation action:
• Certain data may be temporarily retained
• Deletion requests may be delayed until investigations are resolved

This ensures community safety and compliance with applicable laws.

7. International Data Rights

Depending on your jurisdiction (including Canada, EU, UK, and California), you may have additional rights, including:
• Right to access your data
• Right to correct inaccurate information
• Right to request deletion
• Right to restrict or object to processing

We honor valid requests in accordance with applicable data protection laws.

8. Contact Information

For data deletion requests or questions:
📧 support@99cupid.com
🌐 https://99cupid.com/

At 99Cupid, we believe fairness includes control over your personal data.`;

export default function DataDeletionPage() {
  return (
    <PolicyPage
      title="Data Deletion Policy"
      lastUpdated="02/09/26"
      content={content}
    />
  );
}
