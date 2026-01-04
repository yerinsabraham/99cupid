import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Crown, CheckCircle, ArrowLeft, Loader, X, Heart, Zap, Eye, RotateCcw, TrendingUp, Shield, Star } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import PaymentService from '../services/PaymentService';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadSubscriptionData();
  }, [currentUser]);

  const loadSubscriptionData = async () => {
    if (!currentUser) return;
    
    try {
      const subscription = await PaymentService.getUserSubscription(currentUser.uid);
      setCurrentSubscription(subscription);

      const history = await PaymentService.getTransactionHistory(currentUser.uid);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (tierId) => {
    if (tierId === 'free') return;
    setSelectedTier(tierId);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !selectedTier) return;

    setProcessing(true);
    try {
      const tier = PaymentService.SUBSCRIPTION_TIERS[selectedTier];
      
      const result = await PaymentService.processPayment({
        userId: currentUser.uid,
        tierId: selectedTier,
        amount: tier.price,
        currency: tier.currency,
        method: selectedPaymentMethod
      });

      if (result.success) {
        alert('🎉 Subscription activated successfully!');
        setShowPaymentModal(false);
        loadSubscriptionData();
      } else {
        alert('Payment failed: ' + result.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    try {
      const result = await PaymentService.cancelSubscription(currentUser.uid);
      if (result.success) {
        alert(result.message);
        loadSubscriptionData();
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader className="w-8 h-8 text-pink-600 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const tiers = PaymentService.SUBSCRIPTION_TIERS;
  const isSubscribed = currentSubscription?.id !== 'free';

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-4 md:p-6 pb-24">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Crown className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Only ₱0.99/month
          </h1>
          <p className="text-xl md:text-2xl text-pink-600 font-semibold mb-4">
            That's 99 Cents. That's 99Cupid. 💕
          </p>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            All premium features. No hidden fees. Just ₱0.99 per month.
          </p>
        </div>

        {/* Current Subscription Status */}
        {isSubscribed && currentSubscription && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-500">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="w-5 h-5 text-pink-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                      Active: {currentSubscription.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Expires: {currentSubscription.expiresAt ? 
                      new Date(currentSubscription.expiresAt.toDate ? currentSubscription.expiresAt.toDate() : currentSubscription.expiresAt).toLocaleDateString() : 
                      'N/A'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-renew: {currentSubscription.autoRenew ? 'ON' : 'OFF'}
                  </p>
                </div>
                
                <button
                  onClick={handleCancelSubscription}
                  className="mt-4 md:mt-0 px-6 py-2 text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Card - Single Premium Option */}
        <div className="max-w-xl mx-auto mb-12">
          {/* Premium Tier - Center Spotlight */}
          <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8 md:p-10 text-white transform hover:scale-105 transition-transform">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Crown className="w-5 h-5 mr-2" />
                <span className="text-sm font-bold">BEST VALUE</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">99 Premium</h3>
              
              <div className="mb-4">
                <div className="inline-block">
                  <span className="text-6xl md:text-7xl font-black">₱0.99</span>
                  <span className="text-2xl text-white/80 ml-2">/month</span>
                </div>
              </div>
              
              <p className="text-white/90 text-lg mb-2">Less than a cup of coffee! ☕</p>
              <p className="text-sm text-white/70">Cancel anytime • No hidden fees</p>
            </div>

            {/* Features Grid */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <h4 className="font-bold text-lg mb-4 text-center">Everything You Need:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tiers.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('premium')}
              disabled={currentSubscription?.id === 'premium'}
              className="w-full py-4 bg-white text-pink-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentSubscription?.id === 'premium' ? '✓ Subscribed' : 'Subscribe for ₱0.99/month'}
            </button>
            
            <p className="text-center text-white/70 text-xs mt-4">
              🔒 Secure payment • 100% satisfaction guaranteed
            </p>
          </div>
        </div>

        {/* Why 99Cupid Section */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Why Only ₱0.99? 🤔
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Everyone Deserves Love</h3>
              <p className="text-sm text-gray-600">
                Dating shouldn't be expensive. We believe everyone should be able to afford finding their match.
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Premium for All</h3>
              <p className="text-sm text-gray-600">
                Get all the premium features other apps charge ₱500+ for, at just 99 cents.
              </p>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">No Tricks, Just Value</h3>
              <p className="text-sm text-gray-600">
                One simple price. No upsells. No hidden fees. Just honest, affordable dating.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Privacy Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 md:p-8 mb-12 border-2 border-green-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Bank-Level Security & Identity Protection
            </h2>
            <p className="text-gray-600">Your privacy and security are our top priorities</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Security */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                Payment Security
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>256-bit SSL/TLS encryption</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>PCI DSS Level 1 Certified</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Card data never stored (tokenized)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time fraud detection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>3D Secure authentication</span>
                </li>
              </ul>
            </div>

            {/* Identity Protection */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                Identity Protection
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Payment info never shared with matches</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Billing separated from dating profile</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>All personal data encrypted at rest</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>GDPR & Data Privacy Act compliant</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Right to delete all your data anytime</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Privacy Promise */}
          <div className="mt-6 bg-white rounded-xl p-5 text-center border-2 border-green-300">
            <p className="font-bold text-gray-800 mb-2">Our Privacy Promise</p>
            <p className="text-sm text-gray-700">
              🔒 Your data is <span className="font-bold text-green-600">NEVER sold</span> to third parties<br/>
              🛡️ We only collect what's necessary for your experience<br/>
              🏦 Bank-grade infrastructure protects your information
            </p>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Secure Payment</h3>
                <button onClick={() => setShowPaymentModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Security Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-800">
                  <span className="font-semibold">256-bit encrypted</span> • Your payment info is never stored
                </p>
              </div>

              {/* Selected Plan Summary */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Selected Plan</p>
                <p className="text-2xl font-bold text-gray-800">
                  {PaymentService.SUBSCRIPTION_TIERS[selectedTier]?.name}
                </p>
                <p className="text-lg text-pink-600 font-semibold">
                  ₱{PaymentService.SUBSCRIPTION_TIERS[selectedTier]?.price}/month
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Choose Payment Method</p>
                {Object.values(PaymentService.PAYMENT_METHODS).map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="text-left">
                          <p className="font-semibold text-gray-800">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.security}</p>
                        </div>
                      </div>
                      {selectedPaymentMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-pink-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Privacy Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">🔐 Complete Privacy:</span> Your payment details are never visible to other users or shared with matches.
                </p>
              </div>

              {/* Confirm Payment */}
              <button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || processing}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Pay Securely - ₱{PaymentService.SUBSCRIPTION_TIERS[selectedTier]?.price}</span>
                  </>
                )}
              </button>

              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-500 text-center flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                  Secured by bank-grade encryption
                </p>
                <p className="text-xs text-gray-500 text-center flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                  PCI DSS Level 1 Certified
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
