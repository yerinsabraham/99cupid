import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Users, AlertTriangle, CheckCircle, Shield, BarChart3, Loader } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AdminService from '../services/AdminService';

export default function AdminPanelPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, reports, verifications
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        // Check if user is admin
        const adminStatus = await AdminService.isAdmin(currentUser.uid);
        if (!adminStatus) {
          navigate('/home');
          return;
        }

        setIsAdmin(true);
        loadAdminData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/home');
      }
    };

    if (currentUser) {
      checkAdminAndLoadData();
    }
  }, [currentUser, navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [usersResult, reportsResult, verificationsResult, statsResult] =
        await Promise.all([
          AdminService.getAllUsers(),
          AdminService.getAllReports(),
          AdminService.getVerificationRequests(),
          AdminService.getUserStats(),
        ]);

      if (usersResult.success) setUsers(usersResult.users);
      if (reportsResult.success) setReports(reportsResult.reports);
      if (verificationsResult.success)
        setVerifications(verificationsResult.verifications);
      if (statsResult.success) setStats(statsResult.stats);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVerification = async (verificationId, userId) => {
    try {
      const result = await AdminService.approveVerification(verificationId, userId);
      if (result.success) {
        // Reload verifications
        const verificationsResult = await AdminService.getVerificationRequests();
        if (verificationsResult.success) {
          setVerifications(verificationsResult.verifications);
        }
      }
    } catch (error) {
      console.error('Error approving verification:', error);
    }
  };

  const handleRejectVerification = async (verificationId) => {
    try {
      const result = await AdminService.rejectVerification(
        verificationId,
        '',
        'Rejected by admin'
      );
      if (result.success) {
        const verificationsResult = await AdminService.getVerificationRequests();
        if (verificationsResult.success) {
          setVerifications(verificationsResult.verifications);
        }
      }
    } catch (error) {
      console.error('Error rejecting verification:', error);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      const result = await AdminService.suspendUser(userId, 'Suspended by admin');
      if (result.success) {
        loadAdminData();
      }
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      const result = await AdminService.updateReportStatus(reportId, newStatus);
      if (result.success) {
        const reportsResult = await AdminService.getAllReports();
        if (reportsResult.success) {
          setReports(reportsResult.reports);
        }
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-24">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm md:text-base">Back to Home</span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-sm md:text-base text-gray-600 hidden sm:block">Manage users, reports, and verifications</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile Responsive */}
        <div className="flex overflow-x-auto space-x-2 md:space-x-4 mb-6 md:mb-8 border-b border-gray-200 scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'reports', label: 'Reports', icon: AlertTriangle },
            { id: 'verifications', label: 'Verifications', icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 py-3 md:py-4 font-medium flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-pink-600 text-pink-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-pink-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    label: 'Total Users',
                    value: stats.totalUsers,
                    color: 'bg-blue-100',
                    textColor: 'text-blue-600',
                  },
                  {
                    label: 'Active Users',
                    value: stats.activeUsers,
                    color: 'bg-green-100',
                    textColor: 'text-green-600',
                  },
                  {
                    label: 'Verified Users',
                    value: stats.verifiedUsers,
                    color: 'bg-purple-100',
                    textColor: 'text-purple-600',
                  },
                  {
                    label: 'Subscribed',
                    value: stats.subscribedUsers,
                    color: 'bg-pink-100',
                    textColor: 'text-pink-600',
                  },
                  {
                    label: 'Suspended',
                    value: stats.suspendedUsers,
                    color: 'bg-yellow-100',
                    textColor: 'text-yellow-600',
                  },
                  {
                    label: 'Deleted',
                    value: stats.deletedUsers,
                    color: 'bg-red-100',
                    textColor: 'text-red-600',
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.color} rounded-2xl p-6 shadow-lg`}
                  >
                    <p className="text-gray-600 mb-2">{stat.label}</p>
                    <p className={`text-4xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Verified
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {user.name || user.displayName || user.email?.split('@')[0] || 'No name'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.email || 'No email'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                (user.accountStatus || 'active') === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : (user.accountStatus || 'active') === 'suspended'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {user.accountStatus || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {user.verification?.isVerified || user.isVerified ? (
                              <span className="text-green-600 font-semibold">✓</span>
                            ) : (
                              <span className="text-gray-400">✗</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {(user.accountStatus || 'active') === 'active' ? (
                              <button
                                onClick={() => handleSuspendUser(user.id)}
                                className="text-red-600 hover:text-red-800 font-semibold"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  AdminService.unsuspendUser(user.id).then(() =>
                                    loadAdminData()
                                  )
                                }
                                className="text-green-600 hover:text-green-800 font-semibold"
                              >
                                Unsuspend
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y">
                  {users.map((user) => (
                    <div key={user.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{user.name || user.displayName || user.email?.split('@')[0] || 'No name'}</h3>
                          <p className="text-xs text-gray-600 truncate">{user.email || 'No email'}</p>
                        </div>
                        {(user.verification?.isVerified || user.isVerified) && (
                          <span className="text-green-600 font-semibold ml-2">✓</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            (user.accountStatus || 'active') === 'active'
                              ? 'bg-green-100 text-green-700'
                              : (user.accountStatus || 'active') === 'suspended'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {user.accountStatus || 'active'}
                        </span>
                        
                        {(user.accountStatus || 'active') === 'active' ? (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="px-3 py-1 text-xs text-red-600 hover:text-red-800 font-semibold"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              AdminService.unsuspendUser(user.id).then(() =>
                                loadAdminData()
                              )
                            }
                            className="px-3 py-1 text-xs text-green-600 hover:text-green-800 font-semibold"
                          >
                            Unsuspend
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No reports yet</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl shadow-lg p-4 md:p-6"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                        <div className="mb-3 sm:mb-0">
                          <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">
                            Report #{report.id.slice(0, 8)}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            Reason: <span className="font-semibold">{report.reason}</span>
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            report.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : report.status === 'under_review'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs md:text-sm text-gray-600 mb-2">Description:</p>
                        <p className="text-xs md:text-sm text-gray-800">{report.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {report.status === 'pending' && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateReportStatus(report.id, 'under_review')
                              }
                              className="flex-1 sm:flex-none px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-xs md:text-sm"
                            >
                              Review
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateReportStatus(report.id, 'resolved')
                              }
                              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-xs md:text-sm"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                        {report.status === 'under_review' && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateReportStatus(report.id, 'resolved')
                              }
                              className="flex-1 sm:flex-none px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold text-xs md:text-sm"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateReportStatus(report.id, 'pending')
                              }
                              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-xs md:text-sm"
                            >
                              Back to Pending
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Verifications Tab */}
            {activeTab === 'verifications' && (
              <div className="space-y-4">
                {verifications.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">All verifications are up to date!</p>
                  </div>
                ) : (
                  verifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="bg-white rounded-2xl shadow-lg p-4 md:p-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                          <h3 className="font-bold text-gray-800 mb-2 text-sm md:text-base">
                            Verification Request
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mb-4">
                            User ID: {verification.userId.slice(0, 12)}...
                          </p>

                          {verification.verificationImageUrl && (
                            <img
                              src={verification.verificationImageUrl}
                              alt="Verification"
                              className="w-full max-w-sm rounded-lg shadow-md mb-4"
                            />
                          )}
                        </div>

                        <div className="flex flex-col justify-between space-y-4">
                          <div>
                            <p className="text-xs md:text-sm text-gray-600 mb-2">
                              Submitted:{' '}
                              <span className="font-semibold">
                                {new Date(
                                  verification.createdAt?.toDate?.() ||
                                    verification.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">
                              Status:{' '}
                              <span className="font-semibold text-yellow-600">
                                {verification.status}
                              </span>
                            </p>
                          </div>

                          <div className="flex gap-2 md:gap-3">
                            <button
                              onClick={() =>
                                handleApproveVerification(
                                  verification.id,
                                  verification.userId
                                )
                              }
                              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-xs md:text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleRejectVerification(verification.id)
                              }
                              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-xs md:text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
