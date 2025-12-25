import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import DeleteAccountModal from '../components/modals/DeleteAccountModal';
import UserAccountService from '../services/UserAccountService';
import { 
  Settings, 
  Trash2, 
  Download, 
  Shield, 
  Bell, 
  Eye, 
  Lock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

/**
 * SettingsPage - User account settings and preferences
 */
export default function SettingsPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = async (password) => {
    setIsDeleting(true);
    setDeleteError('');

    try {
      const result = await UserAccountService.deleteAccount(password);
      
      if (result.success) {
        // Account deleted successfully - user is automatically logged out
        // Firebase Auth deleteUser() removes the session
        alert('Your account has been permanently deleted. We\'re sorry to see you go!');
        navigate('/login');
        return { success: true };
      } else {
        setDeleteError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Delete account error:', error);
      const errorMessage = error.message || 'Failed to delete account. Please try again.';
      setDeleteError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Export user data (GDPR compliance)
   */
  const handleExportData = async () => {
    setExportLoading(true);
    
    try {
      const result = await UserAccountService.exportUserData();
      
      if (result.success) {
        // Download data as JSON file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cupid-data-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Your data has been downloaded successfully!');
      } else {
        alert(result.error || 'Failed to export data. Please try again.');
      }
    } catch (error) {
      console.error('Export data error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-pink-600" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          {/* Account Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-gray-600" />
                Account
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => navigate('/verification')}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Verification</p>
                    <p className="text-sm text-gray-500">Verify your account for safety</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                onClick={handleExportData}
                disabled={exportLoading}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center">
                  <Download className="w-5 h-5 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Download Your Data</p>
                    <p className="text-sm text-gray-500">Export all your personal information</p>
                  </div>
                </div>
                {exportLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-600"></div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Privacy & Safety Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-gray-600" />
                Privacy & Safety
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => navigate('/safety')}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Safety Center</p>
                    <p className="text-sm text-gray-500">Report, block, and safety tips</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-indigo-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Privacy Settings</p>
                    <p className="text-sm text-gray-500">Control who can see your profile</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-gray-600" />
                Notifications
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-orange-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">New matches and messages</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-2xl border-2 border-red-200">
            <div className="p-4 border-b border-red-200">
              <h2 className="font-semibold text-red-900 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Danger Zone
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-red-700">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete My Account</span>
              </button>
              {deleteError && (
                <p className="text-sm text-red-700 bg-red-100 p-3 rounded-xl">
                  {deleteError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Info Footer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl text-center">
          <p className="text-sm text-gray-600">
            Logged in as <span className="font-medium">{currentUser?.email}</span>
          </p>
          <button
            onClick={logout}
            className="mt-2 text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />
    </AppLayout>
  );
}
