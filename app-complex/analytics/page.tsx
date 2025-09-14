"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ChartBarIcon,
  UsersIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  EyeIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from "@heroicons/react/24/outline";

interface AnalyticsData {
  visitors?: any;
  ai?: any;
  content?: any;
  realtime?: any;
}

const timeRanges = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' }
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h');
  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics/dashboard?metric=${activeTab}&timeRange=${timeRange}`);
        if (!response.ok) throw new Error('Failed to fetch analytics data');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh every 30 seconds for real-time data
    if (activeTab === 'realtime') {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, timeRange]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'visitors', label: 'Visitors', icon: UsersIcon },
    { id: 'ai', label: 'AI Usage', icon: ChatBubbleBottomCenterTextIcon },
    { id: 'content', label: 'Content', icon: DocumentTextIcon },
    { id: 'realtime', label: 'Real-time', icon: EyeIcon }
  ];

  const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-successGreen" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-successGreen' : 'text-red-400'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-alpineBlue/20 to-glacierBlue/20 rounded-xl">
          <Icon className="w-6 h-6 text-alpineBlue" />
        </div>
      </div>
    </motion.div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Visitors"
          value={data.visitors?.totalVisitors || '0'}
          change="+12%"
          trend="up"
          icon={UsersIcon}
        />
        <MetricCard
          title="AI Queries"
          value={data.ai?.totalQueries || '0'}
          change="+8%"
          trend="up"
          icon={ChatBubbleBottomCenterTextIcon}
        />
        <MetricCard
          title="Page Views"
          value={data.content?.totalViews || '0'}
          change="+15%"
          trend="up"
          icon={EyeIcon}
        />
        <MetricCard
          title="Avg Response Time"
          value={data.ai?.avgResponseTime ? `${Math.round(data.ai.avgResponseTime)}ms` : '0ms'}
          change="-5%"
          trend="down"
          icon={ClockIcon}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitor Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Visitor Trends</h3>
          <div className="h-64 flex items-center justify-center text-white/60">
            <ChartBarIcon className="w-12 h-12 mb-2" />
            <p>Chart visualization coming soon</p>
          </div>
        </motion.div>

        {/* AI Usage Patterns */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">AI Usage Patterns</h3>
          <div className="h-64 flex items-center justify-center text-white/60">
            <SparklesIcon className="w-12 h-12 mb-2" />
            <p>AI analytics visualization</p>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const VisitorsTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Unique Visitors"
          value={data.visitors?.length || '0'}
          icon={UsersIcon}
        />
        <MetricCard
          title="Bounce Rate"
          value="65%"
          icon={ArrowTrendingDownIcon}
        />
        <MetricCard
          title="Avg Session Duration"
          value="4:32"
          icon={ClockIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <GlobeAltIcon className="w-5 h-5" />
            Geographic Distribution
          </h3>
          <div className="space-y-3">
            {data.visitors && data.visitors.length > 0 ? (
              data.visitors.slice(0, 5).map((country: any, index: number) => (
                <div key={`${country.country}-${index}`} className="flex justify-between items-center">
                  <span className="text-white/80">{country.country || 'Unknown'}</span>
                  <span className="text-summitGold font-medium">{country.count || 0}</span>
                </div>
              ))
            ) : (
              <div className="text-white/60 text-center py-8">
                No geographic data available yet
              </div>
            )}
          </div>
        </motion.div>

        {/* Device Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-5 h-5" />
            Device Types
          </h3>
          <div className="space-y-3">
            {data.visitors && data.visitors.length > 0 ? (
              data.visitors.slice(0, 5).map((device: any, index: number) => (
                <div key={`${device.device_type}-${device.browser}-${index}`} className="flex justify-between items-center">
                  <span className="text-white/80">
                    {device.device_type || 'Unknown'} - {device.browser || 'Unknown'}
                  </span>
                  <span className="text-summitGold font-medium">{device.count || 0}</span>
                </div>
              ))
            ) : (
              <div className="text-white/60 text-center py-8">
                No device data available yet
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const AITab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Questions"
          value={data.ai?.length || '0'}
          icon={ChatBubbleBottomCenterTextIcon}
        />
        <MetricCard
          title="Avg Rating"
          value="4.2/5"
          icon={SparklesIcon}
        />
        <MetricCard
          title="Success Rate"
          value="94%"
          icon={ArrowTrendingUpIcon}
        />
        <MetricCard
          title="Avg Response Time"
          value="2.1s"
          icon={ClockIcon}
        />
      </div>

      {/* Popular Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Popular Topics</h3>
        <div className="space-y-4">
          {data.ai?.slice(0, 8).map((topic: any, index: number) => (
            <div key={topic.topic_name} className="flex items-center justify-between">
              <div>
                <span className="text-white font-medium">{topic.topic_name}</span>
                <span className="text-white/60 text-sm ml-2">({topic.category})</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-summitGold font-medium">{topic.total_questions} questions</span>
                <div className="w-32 bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-alpineBlue to-glacierBlue h-2 rounded-full"
                    style={{ width: `${Math.min(topic.total_questions * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const ContentTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Page Views"
          value={data.content?.reduce((acc: number, page: any) => acc + page.total_views, 0) || '0'}
          icon={EyeIcon}
        />
        <MetricCard
          title="Avg Time on Page"
          value="3:45"
          icon={ClockIcon}
        />
        <MetricCard
          title="Popular Pages"
          value={data.content?.length || '0'}
          icon={DocumentTextIcon}
        />
      </div>

      {/* Top Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Pages</h3>
        <div className="space-y-4">
          {data.content?.slice(0, 10).map((page: any, index: number) => (
            <div key={page.page_url} className="flex items-center justify-between">
              <div>
                <span className="text-white font-medium">{page.page_title || page.page_url}</span>
                <span className="text-white/60 text-sm block">{page.page_url}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-summitGold font-medium">{page.total_views} views</span>
                <span className="text-white/60 text-sm">{Math.round(page.avg_time_on_page / 60)}m avg</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const RealtimeTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={data.realtime?.active_users || '0'}
          icon={UsersIcon}
        />
        <MetricCard
          title="Current AI Queries"
          value="3"
          icon={ChatBubbleBottomCenterTextIcon}
        />
        <MetricCard
          title="Pages/Min"
          value="24"
          icon={EyeIcon}
        />
        <MetricCard
          title="Response Time"
          value={data.realtime?.avg_ai_response_time ? `${Math.round(data.realtime.avg_ai_response_time)}ms` : '0ms'}
          icon={ClockIcon}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Active Sessions</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.realtime?.activeSessions?.map((session: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div>
                  <span className="text-white/80 text-sm">{session.current_page}</span>
                  <span className="text-white/60 text-xs block">{session.device_type} • {session.country}</span>
                </div>
                <span className="text-summitGold text-xs">
                  {Math.round((Date.now() - new Date(session.last_activity).getTime()) / 60000)}m ago
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.realtime?.recentActivity?.map((activity: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="text-white/80 text-sm">{activity.page_url}</span>
                <span className="text-white/60 text-xs">
                  {Math.round((Date.now() - new Date(activity.created_at).getTime()) / 60000)}m ago
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Analytics Dashboard</h1>
          <p className="text-white/60 text-lg">Track visitor engagement, AI usage, and content performance</p>
        </motion.div>

        {/* Time Range Selector */}
        {activeTab !== 'realtime' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    timeRange === range.value
                      ? 'bg-summitGold text-black font-medium'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-alpineBlue to-glacierBlue text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-summitGold border-t-transparent rounded-full"
            />
            <span className="text-white/60 ml-3">Loading analytics...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'visitors' && <VisitorsTab />}
            {activeTab === 'ai' && <AITab />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'realtime' && <RealtimeTab />}
          </>
        )}
      </div>
    </main>
  );
}