import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import emailjs from '@emailjs/browser';
import { Heart, Shield, MessageCircle, Sparkles, Check, X, Loader, Mail, Users, Lock } from 'lucide-react';
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
      setEarlyUsersCount(snapshot.size);
    } catch (err) {
      console.error('Error loading count:', err);
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
      // Check if user will be founding member (first 500)
      const isFounder = earlyUsersCount < 500;
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
            ? 'You are one of the first 500 founding members and will receive free premium access for 6 months when we launch!' 
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
          {/* Close button */}
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({ email: '', name: '', role: 'interested-user', referral: '' });
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

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
                Congratulations! You're one of our first 500 founding members 🚀
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
          <div className="flex flex-col gap-3">
            {/* Copy Link Button */}
            <button
              onClick={copyLink}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Copy Link to Share
                </>
              )}
            </button>
            
            {/* Share hint */}
            <p className="text-xs text-gray-500">
              Share on WhatsApp, Facebook, Twitter, or anywhere!
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (submitted) {
    return <SuccessModal />;
  }

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
            <div className="inline-block px-4 py-2 bg-pink-100 rounded-full mb-4">
              <span className="text-pink-700 font-semibold text-sm">
                🎉 First 500 get 3 months free + Founding Member status!
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              99Cupid —{' '}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Find love across borders
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-4">
              Browse profiles for free. Message and connect for just <strong className="text-pink-600">$0.99/month</strong>.
            </p>
            
            <p className="text-lg text-gray-700 font-semibold">
              🎉 First 500 early users get 3 months full access for free and receive Founding Member status.
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
                      Joining...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get Early Access
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
                <span><strong>{Math.max(0, 500 - earlyUsersCount)}</strong> founding spots left</span>
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join Early?</h2>
          <p className="text-xl text-gray-600">Be part of something special from day one</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Early Access</h3>
            <p className="text-gray-600">
              Be among the first to experience 99Cupid. Shape the future of cross-border dating.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Free Browsing</h3>
            <p className="text-gray-600">
              Browse profiles for free. Unlock messaging and full engagement features for just $0.99/month.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Founding Member Status</h3>
            <p className="text-gray-600">
              First 500 users get <strong>3 months free full access</strong> and a special Founding Member badge on their profile.
            </p>
          </div>
        </div>
      </section>

      {/* Founding Members Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 relative">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Founding Members Program
          </h2>
          <p className="text-xl mb-6 text-pink-100">
            First <strong>500</strong> early users become Founding Members
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <p className="text-lg mb-3">
              <strong>Your benefits:</strong>
            </p>
            <ul className="text-left space-y-2">
              <li>✓ 3 months of free full access (worth $2.97)</li>
              <li>✓ Exclusive Founding Member badge on your profile</li>
              <li>✓ Recognition as a founding supporter of 99Cupid</li>
            </ul>
          </div>
          <p className="text-pink-100">
            <strong>{Math.max(0, 500 - earlyUsersCount)}</strong> founding spots remaining
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Love?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join now and secure your founding member benefits
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={!isValid || loading}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? 'Joining...' : 'Get Started'}
              </button>
            </div>
          </form>
        </div>
      </section>

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
                <a href="mailto:99Cupidlove@gmail.com" className="hover:text-white transition-colors">
                  99Cupidlove@gmail.com
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
