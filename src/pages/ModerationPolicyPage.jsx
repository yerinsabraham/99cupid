import PolicyPage from '../components/common/PolicyPage';

const content = `Protecting Our Community

At 99Cupid, user safety is a priority. We are committed to maintaining a respectful, secure, and welcoming environment for all members.

This Moderation & Reporting Policy explains how reports are handled, how moderation decisions are made, and what enforcement actions may be taken when violations occur.

1. Reporting a User

Users may report accounts directly within the app.

Reports can be submitted through:
• The "Report User" button on a profile
• The "Report" option within chat conversations

You may report a user for:
• Harassment, bullying, or intimidation
• Hate speech or discriminatory behavior
• Scams or financial solicitation
• Fake profiles or impersonation
• Underage accounts
• Explicit or inappropriate content
• Threats or unsafe behavior
• Off-platform misconduct related to 99Cupid interactions

Reports are confidential. The reported user will not be notified of who submitted the report.

2. Review Process

When a report is submitted:
1. It is securely logged in our system.
2. Relevant profile data, messages, and activity may be reviewed.
3. Moderation tools and pattern detection systems may assist in the review.
4. A determination is made in accordance with our Community Guidelines and Terms.

We aim to review reports promptly, typically within 24–72 hours, depending on severity and complexity.

Urgent safety threats may be prioritized for immediate action.

3. Moderation Methods

99Cupid may use a combination of:
• Manual review by trained moderators
• Automated systems to detect suspicious or harmful behavior
• Behavioral pattern analysis for fraud detection
• Community reporting signals

Automated tools may flag content; however, enforcement decisions may involve human review where appropriate.

4. Enforcement Actions

Depending on the severity and nature of the violation, enforcement actions may include:
• Warning notice
• Content removal
• Temporary account suspension
• Permanent account removal
• Device or IP restriction
• Reporting to appropriate authorities (where required by law)

We reserve the right to remove content or terminate accounts at our discretion to protect the safety and integrity of the community.

Repeated violations may result in escalated enforcement.

5. Zero-Tolerance Violations

The following behaviors may result in immediate permanent removal:
• Romance scams or financial exploitation
• Soliciting money or gift cards
• Underage activity
• Sexual content involving minors
• Credible threats of violence
• Severe harassment or hate speech
• Human trafficking or exploitation-related activity

In appropriate cases, we may cooperate with law enforcement authorities.

6. Off-Platform Conduct

Misconduct that occurs outside the app but originates from 99Cupid interactions may still result in enforcement action.

User safety extends beyond the platform where appropriate.

7. False or Malicious Reporting

Submitting knowingly false or malicious reports may result in account action.

Reporting tools are intended to protect the community — not to harass or retaliate against other users.

8. Appeals Process

If you believe your account was suspended or terminated in error, you may submit an appeal by contacting: support@99cupid.com

We may request identity verification before reviewing an appeal.

Appeals are reviewed at our discretion, and decisions are final unless otherwise required by law.

9. Data Handling During Investigations

During investigations, we may temporarily retain relevant data (including messages and profile information) for review, safety assessment, and legal compliance.

Data retention during moderation follows our Privacy Policy and Data Deletion Policy.

10. User Responsibility

While we actively monitor and enforce safety standards, users are responsible for:
• Exercising caution
• Following safety guidelines
• Reporting suspicious activity

99Cupid does not conduct comprehensive criminal background checks on all users.

11. Continuous Improvement

We continuously improve our moderation systems to:
• Detect scams and abuse more effectively
• Reduce repeat offenders
• Improve response times
• Strengthen community trust

12. Our Commitment

99Cupid was built to make dating affordable — and safety is part of that commitment.

We are dedicated to:
• Transparency
• Fair and consistent enforcement
• User protection
• Responsible platform growth`;

export default function ModerationPolicyPage() {
  return (
    <PolicyPage
      title="Moderation & Reporting Policy"
      lastUpdated="02/09/26"
      content={content}
    />
  );
}
