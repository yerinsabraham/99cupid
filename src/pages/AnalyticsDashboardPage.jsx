import { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import AnalyticsService from '../services/AnalyticsService';
import { 
  TrendingUp, Users, Heart, MessageCircle, CreditCard, 
  Activity, Calendar, BarChart3, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [funnelMetrics, setFunnelMetrics] = useState(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState(null);
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    loadAnalytics();
    
    // Refresh real-time metrics every 30 seconds
    const interval = setInterval(loadRealTimeMetrics, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(dateRange));

    const [dashboard, funnel, realtime] = await Promise.all([
      AnalyticsService.getDashboardData(startDate, endDate),
      AnalyticsService.getFunnelMetrics(startDate, endDate),
      AnalyticsService.getRealTimeMetrics()
    ]);

    setDashboardData(dashboard);
    setFunnelMetrics(funnel);
    setRealTimeMetrics(realtime);
    setLoading(false);
  };

  const loadRealTimeMetrics = async () => {
    const realtime = await AnalyticsService.getRealTimeMetrics();
    setRealTimeMetrics(realtime);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-pulse text-pink-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const { totals } = dashboardData || { totals: {} };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Track your app performance and user engagement
              </p>
            </div>

            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          {/* Real-Time Metrics Banner */}
          {realTimeMetrics && (
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 animate-pulse" />
                <span className="font-semibold">Live Activity (Last 24 Hours)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-pink-100 text-sm mb-1">Active Users</p>
                  <p className="text-3xl font-bold">{realTimeMetrics.activeUsers || 0}</p>
                </div>
                <div>
                  <p className="text-pink-100 text-sm mb-1">New Signups</p>
                  <p className="text-3xl font-bold">{realTimeMetrics.newSignups || 0}</p>
                </div>
                <div>
                  <p className="text-pink-100 text-sm mb-1">Swipes</p>
                  <p className="text-3xl font-bold">{realTimeMetrics.totalSwipes || 0}</p>
                </div>
                <div>
                  <p className="text-pink-100 text-sm mb-1">Matches</p>
                  <p className="text-3xl font-bold">{realTimeMetrics.totalMatches || 0}</p>
                </div>
                <div>
                  <p className="text-pink-100 text-sm mb-1">Messages</p>
                  <p className="text-3xl font-bold">{realTimeMetrics.totalMessages || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={Users}
              title="Total Users"
              value={totals.totalUsers || 0}
              change="+12%"
              positive={true}
              color="blue"
            />
            <MetricCard
              icon={TrendingUp}
              title="New Signups"
              value={totals.totalSignups || 0}
              change="+8%"
              positive={true}
              color="green"
            />
            <MetricCard
              icon={Heart}
              title="Total Matches"
              value={totals.totalMatches || 0}
              change="+15%"
              positive={true}
              color="pink"
            />
            <MetricCard
              icon={CreditCard}
              title="Subscriptions"
              value={totals.totalSubscriptions || 0}
              change="+5%"
              positive={true}
              color="purple"
            />
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Swipes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totals.totalSwipes?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Average: {totals.totalUsers > 0 ? Math.round(totals.totalSwipes / totals.totalUsers) : 0} per user
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totals.totalMessages?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Average: {totals.totalMatches > 0 ? Math.round(totals.totalMessages / totals.totalMatches) : 0} per match
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totals.conversionRate || 0}%
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Subscriptions / Signups
              </div>
            </div>
          </div>

          {/* Funnel Analysis */}
          {funnelMetrics && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-pink-500" />
                User Journey Funnel
              </h2>
              
              <div className="space-y-4">
                <FunnelStep
                  label="Sign Up"
                  value={funnelMetrics.signups}
                  percentage={100}
                  dropoff={null}
                />
                <FunnelStep
                  label="Complete Profile"
                  value={funnelMetrics.profilesCompleted}
                  percentage={funnelMetrics.signups > 0 ? (funnelMetrics.profilesCompleted / funnelMetrics.signups * 100) : 0}
                  dropoff={funnelMetrics.dropoff.signupToProfile}
                />
                <FunnelStep
                  label="Start Swiping"
                  value={funnelMetrics.usersWhoSwiped}
                  percentage={funnelMetrics.signups > 0 ? (funnelMetrics.usersWhoSwiped / funnelMetrics.signups * 100) : 0}
                  dropoff={funnelMetrics.dropoff.profileToSwipe}
                />
                <FunnelStep
                  label="Get Matched"
                  value={funnelMetrics.usersWhoMatched}
                  percentage={funnelMetrics.signups > 0 ? (funnelMetrics.usersWhoMatched / funnelMetrics.signups * 100) : 0}
                  dropoff={funnelMetrics.dropoff.swipeToMatch}
                />
                <FunnelStep
                  label="Send Message"
                  value={funnelMetrics.usersWhoMessaged}
                  percentage={funnelMetrics.signups > 0 ? (funnelMetrics.usersWhoMessaged / funnelMetrics.signups * 100) : 0}
                  dropoff={funnelMetrics.dropoff.matchToMessage}
                />
              </div>
            </div>
          )}

          {/* Insights & Recommendations */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-600" />
              Key Insights
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Engagement Rate:</strong> {totals.engagementRate || 0}% of users are actively swiping
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Match Rate:</strong> {totals.totalSwipes > 0 ? ((totals.totalMatches / totals.totalSwipes) * 100).toFixed(2) : 0}% of swipes result in matches
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">
                  <strong>Message Rate:</strong> {totals.totalMatches > 0 ? ((totals.totalMessages / totals.totalMatches) * 100).toFixed(2) : 0}% of matches lead to conversations
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Metric Card Component
function MetricCard({ icon: Icon, title, value, change, positive, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    pink: 'bg-pink-100 text-pink-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  );
}

// Funnel Step Component
function FunnelStep({ label, value, percentage, dropoff }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-700 font-medium">{label}</span>
        <div className="flex items-center gap-4">
          <span className="text-gray-900 font-bold">{value.toLocaleString()}</span>
          <span className="text-gray-500 text-sm">{percentage.toFixed(1)}%</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 flex items-center justify-end px-3"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 20 && (
            <span className="text-white text-sm font-semibold">
              {value.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      
      {/* Dropoff indicator */}
      {dropoff && dropoff > 0 && (
        <div className="mt-1 text-xs text-red-600">
          ⚠️ {dropoff}% drop-off
        </div>
      )}
    </div>
  );
}
