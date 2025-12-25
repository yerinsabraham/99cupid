import { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

/**
 * DeleteAccountModal - Confirmation modal for account deletion
 * Requires password re-authentication and explicit confirmation
 */
export default function DeleteAccountModal({ isOpen, onClose, onConfirm, isLoading }) {
  const [password, setPassword] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (!confirmChecked) {
      setError('Please confirm you understand this action is permanent');
      return;
    }

    // Call parent confirm handler
    const result = await onConfirm(password);
    
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPassword('');
      setConfirmChecked(false);
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Account</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <h3 className="font-semibold text-red-900 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              This action is permanent!
            </h3>
            <ul className="text-sm text-red-700 space-y-1 ml-7">
              <li>• Your profile will be permanently deleted</li>
              <li>• All matches and conversations will be removed</li>
              <li>• Your photos and personal data will be erased</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm your password to continue
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              disabled={isLoading}
              className="mt-1 h-4 w-4 text-red-600 rounded focus:ring-red-500 disabled:opacity-50"
              required
            />
            <label htmlFor="confirm" className="ml-3 text-sm text-gray-700">
              I understand that deleting my account is <span className="font-semibold">permanent and irreversible</span>. 
              All my data will be permanently removed from Cupid.
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password || !confirmChecked}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            Need help? Contact support at <a href="mailto:support@99cupid.com" className="text-pink-600 hover:underline">support@99cupid.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
