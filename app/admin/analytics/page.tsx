"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  SparklesIcon,
  NewspaperIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from "@heroicons/react/24/outline";

interface AnalyticsData {
  pageViews: { current: number; previous: number; change: number };
  uniqueVisitors: { current: number; previous: number; change: number };
  aiQueries: { current: number; previous: number; change: number };
  newsletterSignups: { current: number; previous: number; change: number };
  avgSessionDuration: { current: string; previous: string; change: number };
  topPages: Array<{ page: string; views: number; change: number }>;
  topQuestions: Array<{ question: string; count: number }>;
  conversionRate: { current: number; previous: number; change: number };
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data for now - in production, this would call your analytics API
      const mockData: AnalyticsData = {
        pageViews: { current: 12457, previous: 10234, change: 21.7 },
        uniqueVisitors: { current: 3421, previous: 2987, change: 14.5 },
        aiQueries: { current: 847, previous: 623, change: 35.9 },
        newsletterSignups: { current: 89, previous: 67, change: 32.8 },
        avgSessionDuration: { current: "4m 32s", previous: "3m 58s", change: 14.2 },
        topPages: [
          { page: "/ask-sunith", views: 2341, change: 45.2 },
          { page: "/training", views: 1876, change: 23.1 },
          { page: "/blogs", views: 1654, change: 18.7 },
          { page: "/my-story", views: 1234, change: -5.2 },
          { page: "/the-journey", views: 987, change: 12.3 }
        ],
        topQuestions: [
          { question: "How do you train for high altitude?", count: 156 },
          { question: "What gear is essential for Everest?", count: 134 },
          { question: "How do you manage fear on mountains?", count: 98 },
          { question: "What's your typical training routine?", count: 87 },
          { question: "How much does climbing Everest cost?", count: 76 }
        ],
        conversionRate: { current: 2.6, previous: 2.2, change: 18.2 }
      };
      
      setData(mockData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
        {Math.abs(change).toFixed(1)}%
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-summitGold border-r-transparent"></div>
          <p className="mt-4 text-white/60">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-white/60">Monitor website performance and user engagement</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
              {(['7d', '30d', '90d'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    timeframe === period 
                      ? 'bg-summitGold text-black' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'Last 90 days'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {data && (
          <>
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {[
                { 
                  icon: EyeIcon, 
                  label: "Page Views", 
                  current: data.pageViews.current.toLocaleString(),
                  change: data.pageViews.change,
                  color: "from-blue-500/20 to-cyan-500/20"
                },
                { 
                  icon: UserGroupIcon, 
                  label: "Unique Visitors", 
                  current: data.uniqueVisitors.current.toLocaleString(),
                  change: data.uniqueVisitors.change,
                  color: "from-green-500/20 to-emerald-500/20"
                },
                { 
                  icon: SparklesIcon, 
                  label: "AI Queries", 
                  current: data.aiQueries.current.toLocaleString(),
                  change: data.aiQueries.change,
                  color: "from-purple-500/20 to-violet-500/20"
                },
                { 
                  icon: NewspaperIcon, 
                  label: "Newsletter Signups", 
                  current: data.newsletterSignups.current.toLocaleString(),
                  change: data.newsletterSignups.change,
                  color: "from-orange-500/20 to-red-500/20"
                }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${metric.color}`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    {formatChange(metric.change)}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.current}</div>
                  <div className="text-sm text-white/60">{metric.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Secondary Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-summitGold" />
                    <h3 className="text-lg font-semibold text-white">Avg. Session Duration</h3>
                  </div>
                  {formatChange(data.avgSessionDuration.change)}
                </div>
                <div className="text-3xl font-bold text-white">{data.avgSessionDuration.current}</div>
                <div className="text-sm text-white/60 mt-1">Previous: {data.avgSessionDuration.previous}</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ChartBarIcon className="w-5 h-5 text-summitGold" />
                    <h3 className="text-lg font-semibold text-white">Conversion Rate</h3>
                  </div>
                  {formatChange(data.conversionRate.change)}
                </div>
                <div className="text-3xl font-bold text-white">{data.conversionRate.current}%</div>
                <div className="text-sm text-white/60 mt-1">Newsletter signups per visitor</div>
              </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Top Pages */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Top Pages</h3>
                <div className="space-y-4">
                  {data.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{page.page}</div>
                        <div className="text-white/60 text-sm">{page.views.toLocaleString()} views</div>
                      </div>
                      {formatChange(page.change)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Questions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Top AI Questions</h3>
                <div className="space-y-4">
                  {data.topQuestions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="text-white text-sm leading-relaxed">{question.question}</div>
                      </div>
                      <div className="bg-summitGold/20 text-summitGold px-3 py-1 rounded-full text-sm font-medium">
                        {question.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}