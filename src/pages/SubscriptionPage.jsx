import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CreditCard, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import SubscriptionService from '../services/SubscriptionService';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      // In production, this would integrate with Stripe via a backend
      // For now, we'll simulate a successful purchase
      const result = await SubscriptionService.createStripeSubscription(currentUser.uid, {
        customerId: 'cus_' + Math.random().toString(36).substr(2, 9),
        subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 9),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (result.success) {
        // Update local profile
        await updateUserProfile({
          hasActiveSubscription: true,
          subscriptionStatus: 'active',
        });

        // Show success and redirect
        setError(''); // Clear any previous errors
        setTimeout(() => {
          navigate('/messages');
        }, 1500);
      } else {
        setError(result.error || 'Failed to process subscription');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/messages')}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Messages</span>
        </button>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Premium Messaging</h1>
            <p className="text-gray-600 text-lg">
              Connect with your matches and build meaningful relationships
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
            {/* Pricing Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-12 text-white text-center">
              <div className="text-6xl font-bold mb-2">$0.99</div>
              <div className="text-xl opacity-90">per month</div>
              <p className="text-sm opacity-75 mt-2">Cancel anytime, no hidden fees</p>
            </div>

            {/* Features */}
            <div className="px-8 py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-8">What You Get</h3>
              <div className="space-y-4">
                {[
                  'Unlimited messaging with all matches',
                  'See read receipts and typing indicators',
                  'Priority message delivery',
                  'Verified badge display',
                  'Access to verified members',
                  'Block and report features',
                  '24/7 customer support',
                  'Cancel anytime',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Subscribe Button */}
            <div className="px-8 pb-12">
              <button
                onClick={handleSubscribe}
                disabled={loading || isProcessing}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Subscribe Now</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Common Questions</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">How does billing work?</h4>
                <p className="text-gray-600">
                  You'll be charged $0.99 per month on a recurring basis until you cancel.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-600">
                  Absolutely! You can cancel your subscription anytime from your account settings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Is my payment information secure?</h4>
                <p className="text-gray-600">
                  Yes, we use encrypted Stripe payment processing to keep your data safe.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What if I have billing issues?</h4>
                <p className="text-gray-600">
                  Contact our support team at support@99cupid.com for immediate assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex justify-center space-x-8 text-gray-600">
            <div className="text-center">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-sm">Secure Payment</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">✓</div>
              <p className="text-sm">Cancel Anytime</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm">Support 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
