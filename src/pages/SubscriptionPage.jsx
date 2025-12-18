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
        <div className="max-w-6xl mx-auto text-center mb-12">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Crown className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Upgrade Your Experience
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Find your perfect match faster with premium features designed for the Filipino dating experience
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

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-800">₱0</span>
            </div>

            <ul className="space-y-3 mb-8">
              {tiers.free.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Plus Tier */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-2xl p-6 md:p-8 text-white transform md:scale-105">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">99 Plus</h3>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">POPULAR</span>
            </div>
            
            <div className="mb-6">
              <span className="text-5xl font-bold">₱{tiers.plus.price}</span>
              <span className="text-white/80">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {tiers.plus.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan('plus')}
              disabled={currentSubscription?.id === 'plus'}
              className="w-full py-3 bg-white text-pink-600 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentSubscription?.id === 'plus' ? 'Current Plan' : 'Subscribe Now'}
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2 border-purple-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-gray-800">99 Premium</h3>
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-800">₱{tiers.premium.price}</span>
              <span className="text-gray-600">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {tiers.premium.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan('premium')}
              disabled={currentSubscription?.id === 'premium'}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentSubscription?.id === 'premium' ? 'Current Plan' : 'Get Premium'}
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Feature Comparison</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Heart, label: 'Daily Likes', free: '20', plus: 'Unlimited', premium: 'Unlimited' },
              { icon: Star, label: 'Super Likes', free: '0', plus: '5/day', premium: 'Unlimited' },
              { icon: RotateCcw, label: 'Rewinds', free: 'No', plus: 'Yes', premium: 'Yes' },
              { icon: Zap, label: 'Boosts', free: 'No', plus: '1/month', premium: '5/month' },
              { icon: Eye, label: 'See Who Liked', free: 'No', plus: 'Yes', premium: 'Yes' },
              { icon: TrendingUp, label: 'Priority Matching', free: 'No', plus: 'No', premium: 'Yes' },
              { icon: Shield, label: 'Ad-Free', free: 'No', plus: 'Yes', premium: 'Yes' },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <item.icon className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-700 mb-2">{item.label}</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Free: {item.free}</p>
                  <p className="text-xs text-pink-600">Plus: {item.plus}</p>
                  <p className="text-xs text-purple-600">Premium: {item.premium}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Choose Payment Method</h3>
                <button onClick={() => setShowPaymentModal(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
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
                {Object.values(PaymentService.PAYMENT_METHODS).map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      selectedPaymentMethod === method.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-semibold text-gray-800">{method.name}</span>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-pink-600" />
                    )}
                  </button>
                ))}
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
                  <span>Confirm Payment</span>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment powered by Philippine payment gateways
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
