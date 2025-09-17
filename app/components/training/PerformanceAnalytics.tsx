'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Activity,
  Zap,
  Timer,
  Mountain,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceData {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  category:
    | 'cardiovascular'
    | 'strength'
    | 'endurance'
    | 'recovery'
    | 'technical';
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  lastUpdated: string;
  benchmark?: number;
  recommendations?: string[];
}

interface AnalyticsInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

export function PerformanceAnalytics() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeframe, setTimeframe] = useState('30d');
  const [showInsights, setShowInsights] = useState(true);
  const [loading, setLoading] = useState(false);

  // Sample performance data
  const performanceData: PerformanceData[] = [
    {
      id: '1',
      name: 'VO2 Max',
      value: 58.2,
      previousValue: 56.1,
      unit: 'ml/kg/min',
      category: 'cardiovascular',
      trend: 'up',
      status: 'excellent',
      lastUpdated: '2024-12-15',
      benchmark: 55,
      recommendations: [
        'Maintain current training intensity',
        'Add high-altitude simulation sessions',
      ],
    },
    {
      id: '2',
      name: 'Resting Heart Rate',
      value: 42,
      previousValue: 45,
      unit: 'bpm',
      category: 'cardiovascular',
      trend: 'down',
      status: 'excellent',
      lastUpdated: '2024-12-15',
      benchmark: 50,
      recommendations: [
        'Excellent recovery capacity',
        'Continue current training load',
      ],
    },
    {
      id: '3',
      name: 'Power-to-Weight Ratio',
      value: 4.2,
      previousValue: 3.9,
      unit: 'W/kg',
      category: 'strength',
      trend: 'up',
      status: 'good',
      lastUpdated: '2024-12-14',
      benchmark: 4.5,
      recommendations: [
        'Add more strength training sessions',
        'Focus on functional power movements',
      ],
    },
    {
      id: '4',
      name: 'Lactate Threshold',
      value: 168,
      previousValue: 171,
      unit: 'bpm',
      category: 'endurance',
      trend: 'down',
      status: 'good',
      lastUpdated: '2024-12-14',
      benchmark: 165,
      recommendations: ['Threshold is improving', 'Add more tempo training'],
    },
    {
      id: '5',
      name: 'Recovery Score',
      value: 85,
      previousValue: 82,
      unit: '%',
      category: 'recovery',
      trend: 'up',
      status: 'good',
      lastUpdated: '2024-12-15',
      benchmark: 80,
      recommendations: ['Good recovery patterns', 'Maintain sleep quality'],
    },
    {
      id: '6',
      name: 'Technical Skill Score',
      value: 7.8,
      previousValue: 7.2,
      unit: '/10',
      category: 'technical',
      trend: 'up',
      status: 'good',
      lastUpdated: '2024-12-13',
      benchmark: 8.5,
      recommendations: [
        'Practice ice climbing techniques',
        'More altitude simulation needed',
      ],
    },
  ];

  const insights: AnalyticsInsight[] = [
    {
      id: '1',
      type: 'success',
      title: 'Cardiovascular Fitness Peak',
      description:
        'Your VO2 max has reached an excellent level for high-altitude performance',
      recommendation: 'Begin altitude-specific training protocols',
      impact: 'high',
      category: 'Cardiovascular',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Power Development Needed',
      description:
        'Power-to-weight ratio is below target for technical climbing sections',
      recommendation: 'Increase strength training frequency to 3x/week',
      impact: 'medium',
      category: 'Strength',
    },
    {
      id: '3',
      type: 'info',
      title: 'Recovery Optimization',
      description: 'Your recovery metrics show consistent improvement',
      recommendation: 'Continue current sleep and nutrition protocols',
      impact: 'medium',
      category: 'Recovery',
    },
    {
      id: '4',
      type: 'critical',
      title: 'Technical Skills Gap',
      description:
        'Ice climbing proficiency needs improvement before Everest attempt',
      recommendation: 'Schedule intensive ice climbing course within 2 months',
      impact: 'high',
      category: 'Technical',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: BarChart3 },
    { id: 'cardiovascular', name: 'Cardiovascular', icon: Heart },
    { id: 'strength', name: 'Strength', icon: Zap },
    { id: 'endurance', name: 'Endurance', icon: Activity },
    { id: 'recovery', name: 'Recovery', icon: Timer },
    { id: 'technical', name: 'Technical', icon: Mountain },
  ];

  const filteredData =
    selectedCategory === 'all'
      ? performanceData
      : performanceData.filter((item) => item.category === selectedCategory);

  const getStatusColor = (status: PerformanceData['status']) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: PerformanceData['trend']) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = (trend: PerformanceData['trend'], category: string) => {
    // For some metrics, down is better (like resting heart rate, lactate threshold)
    const downIsBetter = ['Resting Heart Rate', 'Lactate Threshold'].includes(
      category
    );

    if (trend === 'up') return downIsBetter ? 'text-red-600' : 'text-green-600';
    if (trend === 'down')
      return downIsBetter ? 'text-green-600' : 'text-red-600';
    return 'text-gray-600';
  };

  const getInsightIcon = (type: AnalyticsInsight['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'critical':
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getInsightColor = (type: AnalyticsInsight['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Performance Analytics
          </h3>
          <p className="text-gray-600 mt-1">
            Comprehensive analysis of your training metrics and progress
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            {['7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                  timeframe === period
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600'
                )}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={() => setLoading(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            <span className="text-sm">Sync</span>
          </button>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((metric, index) => {
          const TrendIcon = getTrendIcon(metric.trend);
          const changePercent = calculateChange(
            metric.value,
            metric.previousValue
          );

          return (
            <motion.div
              key={metric.id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {metric.name}
                  </h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {metric.category}
                  </p>
                </div>

                <div
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium border',
                    getStatusColor(metric.status)
                  )}
                >
                  {metric.status.replace('-', ' ')}
                </div>
              </div>

              {/* Value and Change */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                  <span className="text-lg text-gray-500">{metric.unit}</span>
                </div>

                <div className="flex items-center gap-2">
                  <TrendIcon
                    className={cn(
                      'w-4 h-4',
                      getTrendColor(metric.trend, metric.name)
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm font-medium',
                      getTrendColor(metric.trend, metric.name)
                    )}
                  >
                    {changePercent}% from previous
                  </span>
                </div>
              </div>

              {/* Benchmark Comparison */}
              {metric.benchmark && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>vs. Target</span>
                    <span>
                      {metric.benchmark} {metric.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        metric.value >= metric.benchmark
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      )}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((metric.value / metric.benchmark) * 100, 100)}%`,
                      }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              )}

              {/* Last Updated */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>
                  Updated {new Date(metric.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights Section */}
      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Performance Insights
                  </h3>
                  <p className="text-sm text-gray-600">
                    Automated analysis and recommendations
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInsights(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4">
              {insights.map((insight, index) => {
                const IconComponent = getInsightIcon(insight.type);

                return (
                  <motion.div
                    key={insight.id}
                    className={cn(
                      'p-4 rounded-lg border',
                      getInsightColor(insight.type)
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-white/50 rounded-full">
                              {insight.category}
                            </span>
                            <span
                              className={cn(
                                'text-xs px-2 py-1 rounded-full',
                                insight.impact === 'high'
                                  ? 'bg-red-100 text-red-800'
                                  : insight.impact === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                              )}
                            >
                              {insight.impact} impact
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-2">{insight.description}</p>
                        <p className="text-sm font-medium">
                          <strong>Recommendation:</strong>{' '}
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
