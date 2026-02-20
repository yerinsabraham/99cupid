import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Shield, 
  Users, 
  BookOpen, 
  Phone, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

/**
 * InclusiveDatingPage - Educational resources for disability-inclusive dating
 */
export default function InclusiveDatingPage() {
  const navigate = useNavigate();

  const guidelines = [
    {
      title: 'Be Respectful',
      description: 'Treat everyone with dignity and respect, regardless of disability status. Remember that people with disabilities are individuals first.',
      icon: '🤝',
      color: 'purple'
    },
    {
      title: 'Ask, Don\'t Assume',
      description: 'If you\'re curious about someone\'s disability or how to be helpful, ask politely rather than making assumptions. Most people appreciate respectful questions.',
      icon: '💬',
      color: 'blue'
    },
    {
      title: 'Focus on the Person',
      description: 'Get to know the person beyond their disability. Everyone has unique interests, passions, and personality traits that make them who they are.',
      icon: '✨',
      color: 'pink'
    },
    {
      title: 'Accessible Communication',
      description: 'Use clear language, be patient, and adapt your communication style to their preferences. Some people prefer written chat, others video, voice messages, or sign language.',
      icon: '📱',
      color: 'green'
    },
    {
      title: 'Plan Accessible Dates',
      description: 'Consider accessibility when planning dates. Check venue accessibility beforehand, discuss transportation options, and be flexible with timing and activities.',
      icon: '🗓️',
      color: 'orange'
    },
    {
      title: 'It\'s Okay to Ask for Help',
      description: 'If you\'re unsure about something, it\'s perfectly fine to ask respectfully how you can help or accommodate. Communication is key to understanding each other\'s needs.',
      icon: '🙋',
      color: 'purple'
    }
  ];

  const commonMistakes = [
    'Talking to a companion instead of directly to the person with a disability',
    'Using outdated or offensive terminology (e.g., "handicapped", "wheelchair-bound")',
    'Making assumptions about what someone can or cannot do',
    'Treating adults with disabilities like children',
    'Focusing only on the disability in conversation',
    'Being afraid to use common expressions like "see you later" or "let\'s walk"',
    'Offering unsolicited help or advice',
    'Making decisions for someone without asking'
  ];

  const resources = [
    {
      title: 'Disability Rights Education',
      description: 'Learn about disability rights, etiquette, and inclusive practices',
      link: 'https://www.ada.gov/resources/disability-etiquette/',
      icon: BookOpen
    },
    {
      title: 'Accessible Date Ideas',
      description: 'Find venues, activities, and creative date ideas that work for everyone',
      link: '#accessible-dates',
      icon: Heart
    },
    {
      title: 'Disability Advocacy Organizations',
      description: 'Connect with support groups and advocacy communities',
      link: '#advocacy',
      icon: Users
    },
    {
      title: 'Communication Tips',
      description: 'Best practices for communicating with people with different disabilities',
      link: '#communication',
      icon: Phone
    }
  ];

  const emergencyContacts = [
    {
      name: 'Crisis Support Services',
      phone: '1-800-273-8255',
      description: 'National crisis hotline'
    },
    {
      name: 'Disability Rights Hotline',
      phone: '1-800-514-0301',
      description: 'For disability rights concerns'
    }
  ];

  const colorClasses = {
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
    pink: 'bg-pink-100 text-pink-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Inclusive Dating Guide</h1>
              <p className="text-gray-600 mt-1">Building connections with respect and understanding</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-purple-900 mb-2">Why This Matters</h3>
              <p className="text-purple-800 text-sm leading-relaxed">
                At 99Cupid, we believe everyone deserves love and connection. This guide helps create 
                a welcoming community where people of all abilities can date with confidence, respect, 
                and understanding. Whether you have a disability or are learning how to be a supportive 
                partner, these resources are here to help.
              </p>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidelines.map((guideline, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colorClasses[guideline.color]}`}>
                    {guideline.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">{guideline.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {guideline.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes to Avoid */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">Common Mistakes to Avoid</h2>
            </div>
            <div className="space-y-3">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 font-bold flex-shrink-0">✕</span>
                  <p className="text-sm text-red-900">{mistake}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <resource.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-2" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Phone className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-800">Need Support?</h2>
          </div>
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-1">{contact.name}</h3>
                <p className="text-2xl font-bold text-purple-600 mb-1">{contact.phone}</p>
                <p className="text-sm text-gray-600">{contact.description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4">
            If you're experiencing a crisis or need immediate support, please reach out to these resources.
          </p>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Have suggestions for this guide?{' '}
            <a href="mailto:support@99cupid.com" className="text-purple-600 hover:underline font-medium">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
