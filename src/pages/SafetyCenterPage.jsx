import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import SafetyService from '../services/SafetyService';
import { useAuth } from '../hooks/useAuth';
import { 
  Shield, AlertTriangle, Phone, Book, Heart, 
  Lock, UserX, FileText, ExternalLink, ChevronRight
} from 'lucide-react';

export default function SafetyCenterPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guidelines, setGuidelines] = useState(null);

  useEffect(() => {
    loadSafetyData();
  }, [currentUser]);

  const loadSafetyData = async () => {
    if (!currentUser) return;

    setLoading(true);
    const [blocked, guidelinesData] = await Promise.all([
      SafetyService.getBlockedUsers(currentUser.uid),
      Promise.resolve(SafetyService.getSafetyGuidelines())
    ]);

    setBlockedUsers(blocked);
    setGuidelines(guidelinesData);
    setLoading(false);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Shield className="w-12 h-12 animate-pulse text-pink-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading Safety Center...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Safety Center
            </h1>
            <p className="text-gray-600">
              Your safety is our priority. Learn how to stay safe and get help when you need it.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => navigate('/settings?tab=blocked')}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <UserX className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Blocked Users</h3>
                    <p className="text-sm text-gray-600">
                      {blockedUsers.length} user{blockedUsers.length !== 1 ? 's' : ''} blocked
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500" />
              </div>
            </button>

            <button
              onClick={() => window.scrollTo({ top: document.getElementById('emergency')?.offsetTop - 100, behavior: 'smooth' })}
              className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Emergency Help</h3>
                    <p className="text-sm text-white/80">
                      Get immediate assistance
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/80 group-hover:text-white" />
              </div>
            </button>
          </div>

          {/* Community Guidelines */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Book className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-bold text-gray-900">Community Guidelines</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guidelines?.communityGuidelines.map((guideline, index) => (
                <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4">
                  <div className="text-3xl mb-2">{guideline.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{guideline.title}</h3>
                  <p className="text-sm text-gray-600">{guideline.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900">Safety Tips</h2>
            </div>
            
            <div className="space-y-3">
              {guidelines?.safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Heart className="w-3 h-3 text-purple-600" />
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Resources */}
          <div id="emergency" className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Emergency Resources</h2>
            </div>
            
            <div className="space-y-4">
              {guidelines?.emergencyResources.map((resource, index) => (
                <div key={index} className="bg-white rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{resource.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      <a 
                        href={`tel:${resource.number.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700"
                      >
                        <Phone className="w-4 h-4" />
                        {resource.number}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>⚠️ In case of immediate danger:</strong> Call 911 or go to the nearest police station.
              </p>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Additional Resources</h2>
            </div>
            
            <div className="space-y-3">
              <a
                href="https://privacy.gov.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">National Privacy Commission</h3>
                  <p className="text-sm text-gray-600">Learn about your data privacy rights</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>

              <a
                href="https://pnp.gov.ph/cyber-crime"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">PNP Anti-Cybercrime Group</h3>
                  <p className="text-sm text-gray-600">Report cybercrime and online threats</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>

              <button
                onClick={() => navigate('/contact')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg hover:from-pink-100 hover:to-purple-100 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Contact 99CUPID Support</h3>
                  <p className="text-sm text-gray-600">Get help from our safety team</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">
              Your safety and well-being matter to us.
            </p>
            <p className="text-sm text-gray-500">
              If you're experiencing any issues or concerns, please don't hesitate to reach out.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
