import { Shield, FileText, Clock, Trash2, Lock, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * DataDeletionPolicyPage - Public page explaining data deletion policy
 * Required for Google Play Store compliance and user transparency
 */
export default function DataDeletionPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">99</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">99 Cupid</h1>
                <p className="text-sm text-gray-600">Data Deletion Policy</p>
              </div>
            </div>
            <Link 
              to="/" 
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              Back to App
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-12 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <FileText className="w-12 h-12" />
              <div>
                <h2 className="text-3xl font-bold">Data Deletion Policy</h2>
                <p className="text-pink-100 mt-1">Your data, your control</p>
              </div>
            </div>
            <p className="text-pink-50 text-sm">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-8">
            {/* Quick Summary */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Quick Summary
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ You can delete your account at any time</li>
                <li>✓ Deletion is permanent and irreversible</li>
                <li>✓ All personal data is removed within 30 days</li>
                <li>✓ Some data may be retained for legal compliance</li>
              </ul>
            </div>

            {/* Section 1: Your Right to Delete */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <UserX className="w-6 h-6 mr-2 text-pink-600" />
                Your Right to Delete Your Data
              </h3>
              <div className="text-gray-700 space-y-3">
                <p>
                  At 99 Cupid, we respect your right to control your personal information. You have the right
                  to request deletion of your account and associated data at any time, for any reason.
                </p>
                <p>
                  This policy outlines what happens when you delete your account, what data is removed,
                  and what information we may retain for legal or operational purposes.
                </p>
              </div>
            </section>

            {/* Section 2: How to Delete */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trash2 className="w-6 h-6 mr-2 text-pink-600" />
                How to Delete Your Account
              </h3>
              <div className="text-gray-700 space-y-4">
                <p>You can delete your 99 Cupid account through two methods:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-2 border-gray-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Method 1: Mobile App</h4>
                    <ol className="text-sm space-y-1 text-gray-600">
                      <li>1. Open the 99 Cupid app</li>
                      <li>2. Navigate to Settings</li>
                      <li>3. Tap "Account Management"</li>
                      <li>4. Select "Delete My Account"</li>
                      <li>5. Confirm with your password</li>
                    </ol>
                  </div>
                  
                  <div className="border-2 border-gray-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Method 2: Online Request</h4>
                    <ol className="text-sm space-y-1 text-gray-600">
                      <li>1. Visit our{' '}
                        <Link to="/account-deletion" className="text-pink-600 hover:text-pink-700 font-medium">
                          Account Deletion page
                        </Link>
                      </li>
                      <li>2. Submit your email address</li>
                      <li>3. Verify your identity via email</li>
                      <li>4. Confirm deletion request</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Data Deleted */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trash2 className="w-6 h-6 mr-2 text-pink-600" />
                What Data Gets Deleted
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">
                  When you delete your account, the following information is permanently removed:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">✕</span>
                    <span className="text-sm text-gray-700">Profile information and bio</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">✕</span>
                    <span className="text-sm text-gray-700">All uploaded photos</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">✕</span>
                    <span className="text-sm text-gray-700">Matches and likes</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">✕</span>
                    <span className="text-sm text-gray-700">Messages and conversations</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">✕</span>
                    <span className="text-sm text-gray-700">Preferences and settings</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">✕</span>
                    <span className="text-sm text-gray-700">Location data</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">✕</span>
                    <span className="text-sm text-gray-700">Verification status and documents</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">✕</span>
                    <span className="text-sm text-gray-700">Subscription information</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Timeline */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-pink-600" />
                Deletion Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-pink-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Immediate (0-24 hours)</h4>
                    <p className="text-sm text-gray-600">
                      Your profile becomes invisible to other users. You are logged out of all devices
                      and cannot access your account.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-pink-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Within 7 Days</h4>
                    <p className="text-sm text-gray-600">
                      Your profile data, photos, and messages are deleted from our active databases.
                      Conversations are removed from your matches' chat lists.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-pink-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Within 30 Days</h4>
                    <p className="text-sm text-gray-600">
                      Complete deletion from backups and cached data. After this point, your data
                      cannot be recovered under any circumstances.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Retained Data */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-pink-600" />
                Data We May Retain
              </h3>
              <div className="text-gray-700 space-y-3">
                <p>
                  For legal, security, and operational purposes, we may retain certain limited information:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    <span><strong>Legal Compliance:</strong> Records of reports, investigations, or legal holds
                    may be retained as required by law.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    <span><strong>Security:</strong> Records of banned or blocked users to prevent re-registration
                    and protect our community.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    <span><strong>Financial Records:</strong> Transaction records may be retained for tax and
                    accounting purposes as required by law (typically 7 years).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">⚠</span>
                    <span><strong>Anonymized Analytics:</strong> Aggregated, non-identifiable usage statistics
                    for improving our service.</span>
                  </li>
                </ul>
                <p className="text-sm italic bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  Note: Retained data is minimal, cannot identify you personally, and is kept only as
                  long as legally required or necessary for legitimate business purposes.
                </p>
              </div>
            </section>

            {/* Section 6: Important Notes */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Important Information</h3>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Deletion is Permanent:</strong> Once your account is deleted and the 30-day process
                  is complete, we cannot recover your data. There is no "undo" option.
                </p>
                <p>
                  <strong>Before You Delete:</strong> Consider exporting your data first using the
                  "Export My Data" feature in Account Management.
                </p>
                <p>
                  <strong>Active Subscriptions:</strong> Cancel any active subscriptions before deleting
                  your account. Account deletion does not automatically cancel subscriptions.
                </p>
                <p>
                  <strong>Creating a New Account:</strong> You may create a new account with the same
                  email address after deletion is complete, but your previous data will not be restored.
                </p>
              </div>
            </section>

            {/* Section 7: Contact */}
            <section className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions or Concerns?</h3>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">
                  If you have questions about our data deletion policy or need assistance with
                  deleting your account, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@99cupid.com" className="text-pink-600 hover:text-pink-700">
                      privacy@99cupid.com
                    </a>
                  </p>
                  <p>
                    <strong>Support:</strong>{' '}
                    <a href="mailto:support@99cupid.com" className="text-pink-600 hover:text-pink-700">
                      support@99cupid.com
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="text-center pt-6">
              <Link
                to="/account-deletion"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete My Account</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <Link to="/privacy-policy" className="hover:text-pink-600">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-pink-600">Terms of Service</Link>
            <span>•</span>
            <Link to="/account-deletion" className="hover:text-pink-600">Delete Account</Link>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 99 Cupid. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
