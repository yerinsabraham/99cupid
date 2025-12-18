import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import SafetyService from '../services/SafetyService';
import { useAuth } from '../hooks/useAuth';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, 
  Clock, Eye, User, Calendar, Filter
} from 'lucide-react';

export default function SafetyModerationPage() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    const [reportsData, statsData] = await Promise.all([
      SafetyService.getAllReports(filter === 'all' ? null : filter),
      SafetyService.getSafetyStats()
    ]);

    setReports(reportsData);
    setStats(statsData);
    setLoading(false);
  };

  const handleReviewReport = async (reportId, action, actionReason) => {
    const result = await SafetyService.updateReport(reportId, currentUser.uid, {
      status: action === SafetyService.SAFETY_ACTIONS.NO_ACTION 
        ? SafetyService.REPORT_STATUS.DISMISSED 
        : SafetyService.REPORT_STATUS.ACTION_TAKEN,
      action,
      actionReason
    });

    if (result.success) {
      loadData();
      setSelectedReport(null);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'under_review': return <Eye className="w-5 h-5 text-blue-600" />;
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'dismissed': return <XCircle className="w-5 h-5 text-gray-600" />;
      case 'action_taken': return <Shield className="w-5 h-5 text-purple-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Shield className="w-12 h-12 animate-pulse text-pink-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading moderation queue...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-pink-500" />
              Safety Moderation
            </h1>
            <p className="text-gray-600">
              Review and take action on user reports
            </p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <p className="text-gray-600 text-sm mb-1">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-200">
                <p className="text-yellow-800 text-sm mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pendingReports}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
                <p className="text-green-800 text-sm mb-1">Resolved</p>
                <p className="text-3xl font-bold text-green-900">{stats.resolvedReports}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
                <p className="text-red-800 text-sm mb-1">Total Blocks</p>
                <p className="text-3xl font-bold text-red-900">{stats.totalBlocks}</p>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-200 mb-6 flex gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending ({stats?.pendingReports || 0})
            </button>
            <button
              onClick={() => setFilter('under_review')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'under_review'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Under Review
            </button>
            <button
              onClick={() => setFilter('action_taken')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'action_taken'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Action Taken
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Reports
            </button>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  All Clear!
                </h3>
                <p className="text-gray-600">
                  No reports in this category
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                              report.severity
                            )}`}
                          >
                            {report.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {SafetyService.REPORT_CATEGORIES[report.category]?.label}
                          </span>
                        </div>
                        <p className="text-gray-900 font-semibold mb-1">
                          Reported User ID: {report.reportedUserId}
                        </p>
                        <p className="text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {report.createdAt?.toDate
                              ? new Date(report.createdAt.toDate()).toLocaleDateString()
                              : 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            {report.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {report.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() =>
                          handleReviewReport(
                            report.id,
                            SafetyService.SAFETY_ACTIONS.WARNING,
                            'First warning issued'
                          )
                        }
                        className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-200 transition-colors"
                      >
                        Warning
                      </button>
                      <button
                        onClick={() =>
                          handleReviewReport(
                            report.id,
                            SafetyService.SAFETY_ACTIONS.SUSPEND_24H,
                            '24-hour suspension'
                          )
                        }
                        className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg font-semibold hover:bg-orange-200 transition-colors"
                      >
                        Suspend 24h
                      </button>
                      <button
                        onClick={() =>
                          handleReviewReport(
                            report.id,
                            SafetyService.SAFETY_ACTIONS.BAN_PERMANENT,
                            'Permanent ban for violation'
                          )
                        }
                        className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                      >
                        Ban
                      </button>
                      <button
                        onClick={() =>
                          handleReviewReport(
                            report.id,
                            SafetyService.SAFETY_ACTIONS.NO_ACTION,
                            'No violation found'
                          )
                        }
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {/* Show action taken */}
                  {report.action && report.action !== SafetyService.SAFETY_ACTIONS.NO_ACTION && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Action Taken:</strong> {report.action.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        {report.actionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
