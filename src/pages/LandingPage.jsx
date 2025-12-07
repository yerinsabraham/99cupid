import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import emailjs from '@emailjs/browser';
import { Heart, Shield, MessageCircle, Sparkles, Check, X, Loader, Mail, Users, Lock, Globe, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'interested-user',
    referral: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [earlyUsersCount, setEarlyUsersCount] = useState(0);
  const [isFoundingMember, setIsFoundingMember] = useState(false);

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init('4dLv5uTZcYW3SmMYn');
    
    // Get current count of early users
    loadEarlyUsersCount();
  }, []);

  const loadEarlyUsersCount = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'earlyUsers'));
      // Start count at 525 and add actual signups from database
      setEarlyUsersCount(525 + snapshot.size);
    } catch (err) {
      console.error('Error loading count:', err);
      // If error, just show 525 as baseline
      setEarlyUsersCount(525);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Check if user will be founding member (first 1000)
      const isFounder = earlyUsersCount < 1000;
      setIsFoundingMember(isFounder);

      // Save to Firestore
      const docData = {
        email: formData.email.toLowerCase().trim(),
        name: formData.name.trim() || '',
        role: formData.role,
        referral: formData.referral.trim() || '',
        founderCandidate: isFounder,
        submittedAt: serverTimestamp(),
        source: 'landing',
      };

      await addDoc(collection(db, 'earlyUsers'), docData);

      // Send confirmation email via EmailJS (non-blocking)
      try {
        const templateParams = {
          to_name: formData.name || 'there',
          to_email: formData.email,
          founding_status: isFounder ? 'Founding Member' : 'Early Access',
          founding_benefit: isFounder 
            ? 'You are one of the first 1000 founding members and will receive free premium access for 6 months when we launch!' 
            : 'Join early to secure your spot!',
        };

        await emailjs.send(
          'service_ccv3mn3',
          'template_sm7bz89',
          templateParams
        );
      } catch (emailError) {
        console.error('Email sending failed (non-critical):', emailError);
        // Don't block user success - email failure is non-critical
      }

      setSubmitted(true);
      setEarlyUsersCount(prev => prev + 1);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValid = validateEmail(formData.email);

  // Success Modal Component
  const SuccessModal = () => {
    const [copied, setCopied] = useState(false);

    const copyLink = () => {
      navigator.clipboard.writeText('https://cupid-e5874.web.app/landing');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center relative animate-scaleIn">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {isFoundingMember ? '🎉 Welcome, Founding Member!' : '✨ Thank You!'}
          </h2>

          {/* Message */}
          {isFoundingMember ? (
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-300 rounded-2xl p-6 mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                Congratulations! You're one of our first 1000 founding members 🚀
              </p>
              <p className="text-gray-700">
                You'll receive <strong>3 months of free full access</strong> and a special <strong>Founding Member badge</strong> on your profile when we launch!
              </p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-lg text-gray-700 mb-3">
                Your email has been received successfully!
              </p>
              <p className="text-gray-600">
                We've added you to our early access list. Check your inbox for a confirmation email.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-pink-800">
              <strong>Quick reminder:</strong> Browse profiles for free. Messaging and full engagement features available for just <strong>$0.99/month</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Copy Link Button */}
            <button
              onClick={copyLink}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
            >
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
            
            {/* Close Button */}
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ email: '', name: '', role: 'interested-user', referral: '' });
              }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
          
          {/* Share hint */}
          <p className="text-xs text-gray-500 mt-3">
            Share on WhatsApp, Facebook, Twitter, or anywhere!
          </p>
        </div>
      </div>
    );
  };

  if (submitted) {
    return <SuccessModal />;
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <img src="/applogo.png" alt="99Cupid" className="h-10" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Dating for{' '}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                99¢ per month.
              </span>
              {' '}Yes, really.
            </h1>

            <p className="text-xl text-gray-600">
              Full access, no upsells, no games, just genuine connections at a price everyone can afford.
            </p>

            <p className="text-lg text-gray-700">
              Get launch updates
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors text-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Notify Me
                    </>
                  )}
                </button>
              </div>

              {/* Optional Fields */}
              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-medium hover:text-pink-600">
                  Optional: Tell us more
                </summary>
                <div className="mt-4 space-y-3 pl-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                  >
                    <option value="interested-user">Interested User</option>
                    <option value="potential-cofounder">Potential Co-founder</option>
                  </select>
                  <input
                    type="text"
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                    placeholder="How did you hear about us? (optional)"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
              </details>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
                  <X className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-xs text-gray-500">
                By joining, you agree to our{' '}
                <a href="#" className="text-pink-600 hover:underline">Terms</a>
                {' & '}
                <a href="#" className="text-pink-600 hover:underline">Privacy Policy</a>
              </p>
            </form>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-600" />
                <span><strong>{earlyUsersCount}</strong> early members</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span><strong>{Math.max(0, 1000 - earlyUsersCount)}</strong> founding spots left</span>
              </div>
            </div>
          </div>

          {/* Hero Image - Hidden on mobile */}
          <div className="relative hidden md:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/newFrame 57.jpg.png"
                alt="99Cupid App"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Only $0.99/mo</p>
                  <p className="text-xs text-gray-600">Full access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section - Below Hero */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Full Access Card */}
          <button
            onClick={() => scrollToSection('full-access-section')}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-left hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Full Access</h3>
            <p className="text-sm text-gray-600">Chat, swipe, and match included</p>
          </button>

          {/* Safety First Card */}
          <button
            onClick={() => scrollToSection('safety-section')}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-left hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Safety First</h3>
            <p className="text-sm text-gray-600">Verification and reporting</p>
          </button>

          {/* Global Card */}
          <button
            onClick={() => scrollToSection('global-section')}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-left hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
              <Globe className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Global</h3>
            <p className="text-sm text-gray-600">Filipino Canadian story, global reach</p>
          </button>

          {/* Customer Service Card */}
          <button
            onClick={() => scrollToSection('customer-service-section')}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-left hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Customer Service</h3>
            <p className="text-sm text-gray-600">Support when you need it</p>
          </button>

          {/* No Upsells Card */}
          <button
            onClick={() => scrollToSection('no-upsells-section')}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all text-left hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">No Upsells</h3>
            <p className="text-sm text-gray-600">One price, no surprises</p>
          </button>
        </div>
      </section>

      {/* Full Access Section */}
      <section id="full-access-section" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-pink-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Full Access Included</h2>
            <p className="text-xl text-gray-600 mb-6">
              Everything you need to find love, all for one simple price.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <span><strong>Unlimited swipes</strong> - Browse profiles without restrictions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <span><strong>Unlimited messaging</strong> - Chat with all your matches</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <span><strong>See who likes you</strong> - Know who's interested</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                <span><strong>Advanced filters</strong> - Find exactly what you're looking for</span>
              </li>
            </ul>
          </div>
          <div className="hidden md:block relative">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 shadow-xl">
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="text-5xl font-bold text-pink-600 mb-2">$0.99</div>
                <p className="text-gray-600">per month</p>
                <p className="text-sm text-gray-500 mt-4">No hidden fees, no surprises</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section id="safety-section" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 hidden md:block">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 shadow-xl">
              <Shield className="w-20 h-20 text-purple-600 mx-auto" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Safety First</h2>
            <p className="text-xl text-gray-600 mb-6">
              Your safety and security are our top priorities.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <span><strong>Photo verification</strong> - Verified profiles you can trust</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <span><strong>Report & block</strong> - Easy tools to stay safe</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <span><strong>24/7 moderation</strong> - Real people reviewing reports</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <span><strong>Privacy controls</strong> - You decide what to share</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Global Section */}
      <section id="global-section" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Connections</h2>
            <p className="text-xl text-gray-600 mb-6">
              Born from a Filipino-Canadian love story, built for the world.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <span><strong>Cross-border dating</strong> - Connect across countries and cultures</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <span><strong>Cultural celebration</strong> - Embrace diverse backgrounds</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <span><strong>International community</strong> - Meet people from around the world</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <span><strong>Language support</strong> - Connect in your native tongue</span>
              </li>
            </ul>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl p-12 shadow-xl">
              <Globe className="w-20 h-20 text-teal-600 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Customer Service Section */}
      <section id="customer-service-section" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Customer Service</h2>
            <p className="text-xl text-gray-600 mb-6">
              We're here to help you every step of the way.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <span><strong>Fast response times</strong> - Get help when you need it</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <span><strong>Friendly support team</strong> - Real people who care</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <span><strong>Multiple contact options</strong> - Email, in-app chat, or help center</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <span><strong>Account assistance</strong> - Help with profile, billing, or technical issues</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Contact us:</strong> <a href="mailto:info@cupid.com" className="underline hover:text-blue-900">info@cupid.com</a>
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-12 shadow-xl">
              <Mail className="w-20 h-20 text-blue-600 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* No Upsells Section */}
      <section id="no-upsells-section" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 hidden md:block">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-12 shadow-xl">
              <DollarSign className="w-20 h-20 text-green-600 mx-auto" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">No Hidden Costs</h2>
            <p className="text-xl text-gray-600 mb-6">
              One simple price. No tricks, no traps, no surprise charges.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Transparent pricing</strong> - $0.99/month, that's it</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>No premium tiers</strong> - Everyone gets the same features</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>Cancel anytime</strong> - No commitment, no penalties</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span><strong>No in-app purchases</strong> - Everything's included</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/applogo.png" alt="99Cupid" className="h-8 mb-4" />
              <p className="text-gray-400 text-sm">
                Find love across borders for just $0.99/month
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@cupid.com" className="hover:text-white transition-colors">
                  info@cupid.com
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 99Cupid. All rights reserved. Made with ❤️ for finding love.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
