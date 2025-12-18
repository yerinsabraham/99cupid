import { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import SafetyService from '../../services/SafetyService';
import { useAuth } from '../../hooks/useAuth';

export default function ReportModal({ isOpen, onClose, reportedUser }) {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [blockUser, setBlockUser] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory || !description.trim()) {
      alert('Please select a category and provide details');
      return;
    }

    setSubmitting(true);

    try {
      // Submit report
      const result = await SafetyService.reportUser(
        currentUser.uid,
        reportedUser.id,
        selectedCategory,
        description,
        {
          reportedUserName: reportedUser.name,
          reportedAt: new Date().toISOString()
        }
      );

      if (result.success) {
        // Optionally block the user
        if (blockUser) {
          await SafetyService.blockUser(currentUser.uid, reportedUser.id);
        }

        setSubmitted(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setSelectedCategory('');
          setDescription('');
          setBlockUser(false);
          setSubmitted(false);
        }, 2000);
      } else {
        alert('Failed to submit report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = Object.values(SafetyService.REPORT_CATEGORIES);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {submitted ? (
          // Success state
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Report Submitted
            </h3>
            <p className="text-gray-600">
              Thank you for helping keep 99CUPID safe. We'll review your report shortly.
            </p>
          </div>
        ) : (
          // Report form
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Report User</h2>
                  <p className="text-sm text-gray-600">{reportedUser?.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Why are you reporting this user?
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCategory === category.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mt-1 text-pink-500 focus:ring-pink-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {category.label}
                          </span>
                          {category.severity === 'critical' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                              URGENT
                            </span>
                          )}
                          {category.severity === 'high' && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                              HIGH
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide specific details about what happened..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  The more details you provide, the better we can investigate.
                </p>
              </div>

              {/* Block User Option */}
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blockUser}
                  onChange={(e) => setBlockUser(e.target.checked)}
                  className="text-pink-500 focus:ring-pink-500"
                />
                <div>
                  <span className="font-semibold text-gray-900">Block this user</span>
                  <p className="text-sm text-gray-600">
                    You won't see each other anymore
                  </p>
                </div>
              </label>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Your privacy is protected:</strong> The user won't know who reported them.
                  Our team will review this report and take appropriate action.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedCategory || !description.trim() || submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
