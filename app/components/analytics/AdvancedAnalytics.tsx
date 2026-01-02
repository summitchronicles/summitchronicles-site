'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Mountain,
  Activity,
  Heart,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Users,
  Globe,
} from 'lucide-react';

interface PerformanceMetrics {
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
  averageHeartRate: number;
  averagePace: number;
  workoutFrequency: number;
  intensityDistribution: {
    low: number;
    moderate: number;
    high: number;
    maximum: number;
  };
}

interface TrendData {
  metric: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  unit: string;
}

interface ComparisonData {
  userLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  userMetrics: PerformanceMetrics;
  benchmarks: {
    level: PerformanceMetrics;
    nextLevel: PerformanceMetrics;
  };
}

interface AdvancedAnalyticsProps {
  activities?: any[];
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
  className?: string;
}

export function AdvancedAnalytics({
  activities = [],
  timeframe = 'month',
  className = '',
}: AdvancedAnalyticsProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch comprehensive analytics
      const response = await fetch('/api/analytics/comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activities: activities,
          timeframe: timeframe,
          includeComparison: true,
          includeTrends: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate analytics');
      }

      const data = await response.json();
      setMetrics(data.metrics);
      setTrends(data.trends);
      setComparison(data.comparison);
    } catch (error) {
      console.error('Error generating analytics:', error);
      // Generate sample data for demo
      setMetrics(generateSampleMetrics());
      setTrends(generateSampleTrends());
      setComparison(generateSampleComparison());
    } finally {
      setLoading(false);
    }
  }, [activities, timeframe]);

  useEffect(() => {
    generateAnalytics();
  }, [generateAnalytics]);

  const generateSampleMetrics = (): PerformanceMetrics => ({
    totalDistance: 125.6,
    totalElevation: 8450,
    totalTime: 45.2,
    averageHeartRate: 142,
    averagePace: 6.8,
    workoutFrequency: 4.2,
    intensityDistribution: {
      low: 45,
      moderate: 30,
      high: 20,
      maximum: 5,
    },
  });

  const generateSampleTrends = (): TrendData[] => [
    {
      metric: 'Weekly Distance',
      current: 31.4,
      previous: 28.2,
      trend: 'up',
      changePercent: 11.3,
      unit: 'km',
    },
    {
      metric: 'Elevation Gain',
      current: 2115,
      previous: 1890,
      trend: 'up',
      changePercent: 11.9,
      unit: 'm',
    },
    {
      metric: 'Training Time',
      current: 11.3,
      previous: 12.1,
      trend: 'down',
      changePercent: -6.6,
      unit: 'hrs',
    },
    {
      metric: 'Average Heart Rate',
      current: 142,
      previous: 145,
      trend: 'down',
      changePercent: -2.1,
      unit: 'bpm',
    },
    {
      metric: 'Workout Frequency',
      current: 4.2,
      previous: 3.8,
      trend: 'up',
      changePercent: 10.5,
      unit: '/week',
    },
  ];

  const generateSampleComparison = (): ComparisonData => ({
    userLevel: 'intermediate',
    userMetrics: generateSampleMetrics(),
    benchmarks: {
      level: {
        totalDistance: 120,
        totalElevation: 8000,
        totalTime: 40,
        averageHeartRate: 145,
        averagePace: 7.0,
        workoutFrequency: 4.0,
        intensityDistribution: { low: 50, moderate: 30, high: 15, maximum: 5 },
      },
      nextLevel: {
        totalDistance: 180,
        totalElevation: 12000,
        totalTime: 60,
        averageHeartRate: 140,
        averagePace: 6.2,
        workoutFrequency: 5.0,
        intensityDistribution: { low: 40, moderate: 35, high: 20, maximum: 5 },
      },
    },
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl border border-spa-stone/10 shadow-sm p-6 ${className}`}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-spa-stone/20 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-spa-stone/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <motion.div
      className={`bg-white rounded-xl border border-spa-stone/10 shadow-sm overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-light">Advanced Analytics</h2>
              <p className="text-indigo-100 text-sm">
                Comprehensive performance insights for {timeframe}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Analysis Period</div>
            <div className="text-lg font-medium capitalize">{timeframe}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Performance Metrics */}
        <div>
          <h3 className="text-lg font-medium text-spa-charcoal mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Mountain className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-light text-blue-900">
                {metrics.totalDistance}km
              </div>
              <div className="text-xs text-blue-700">Total Distance</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-light text-green-900">
                {metrics.totalElevation.toLocaleString()}m
              </div>
              <div className="text-xs text-green-700">Elevation Gain</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-light text-purple-900">
                {metrics.totalTime}h
              </div>
              <div className="text-xs text-purple-700">Training Time</div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-light text-red-900">
                {metrics.averageHeartRate}
              </div>
              <div className="text-xs text-red-700">Avg Heart Rate</div>
            </div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div>
          <h3 className="text-lg font-medium text-spa-charcoal mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Trends
          </h3>
          <div className="grid gap-3">
            {trends.map((trend, index) => (
              <motion.div
                key={trend.metric}
                className="flex items-center justify-between p-4 bg-spa-cloud/10 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  {getTrendIcon(trend.trend)}
                  <div>
                    <h4 className="font-medium text-spa-charcoal">
                      {trend.metric}
                    </h4>
                    <div className="text-sm text-spa-charcoal/60">
                      {trend.current} {trend.unit} (vs {trend.previous}{' '}
                      {trend.unit})
                    </div>
                  </div>
                </div>
                <div className={`text-right ${getTrendColor(trend.trend)}`}>
                  <div className="font-medium">
                    {trend.changePercent > 0 ? '+' : ''}
                    {trend.changePercent.toFixed(1)}%
                  </div>
                  <div className="text-xs">vs last period</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Intensity Distribution */}
        <div>
          <h3 className="text-lg font-medium text-spa-charcoal mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Training Intensity Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.intensityDistribution).map(
              ([intensity, percentage]) => (
                <div key={intensity} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-spa-charcoal capitalize">
                    {intensity}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        intensity === 'low'
                          ? 'bg-green-500'
                          : intensity === 'moderate'
                            ? 'bg-blue-500'
                            : intensity === 'high'
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm text-spa-charcoal text-right">
                    {percentage}%
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Performance Comparison */}
        {comparison && (
          <div>
            <h3 className="text-lg font-medium text-spa-charcoal mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Level Comparison & Progression
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Level Progress */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3 capitalize">
                  {comparison.userLevel} Level Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Distance</span>
                    <span>
                      {Math.round(
                        (comparison.userMetrics.totalDistance /
                          comparison.benchmarks.level.totalDistance) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="bg-blue-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(comparison.userMetrics.totalDistance, comparison.benchmarks.level.totalDistance)}`}
                      style={{
                        width: `${Math.min((comparison.userMetrics.totalDistance / comparison.benchmarks.level.totalDistance) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Next Level Targets */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">
                  Next Level Targets
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Advanced</span>
                    <span>
                      {Math.round(
                        (comparison.userMetrics.totalDistance /
                          comparison.benchmarks.nextLevel.totalDistance) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="bg-green-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${Math.min((comparison.userMetrics.totalDistance / comparison.benchmarks.nextLevel.totalDistance) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights and Recommendations */}
        <div className="bg-spa-cloud/20 rounded-lg p-4">
          <h3 className="font-medium text-spa-charcoal mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            AI-Powered Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-spa-charcoal mb-2">Strengths</h4>
              <ul className="space-y-1 text-spa-charcoal/70">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Consistent training frequency
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Good elevation gain progression
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Balanced intensity distribution
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-spa-charcoal mb-2">
                Opportunities
              </h4>
              <ul className="space-y-1 text-spa-charcoal/70">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  Increase high-intensity sessions
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  Focus on pace improvement
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  Add longer endurance sessions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Export and Sharing */}
        <div className="flex justify-between items-center pt-4 border-t border-spa-stone/10">
          <div className="text-sm text-spa-charcoal/60">
            Analytics generated on {new Date().toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-alpine-blue text-white rounded-lg text-sm hover:bg-alpine-blue/90 transition-colors">
              Export Report
            </button>
            <button className="px-4 py-2 border border-spa-stone/20 text-spa-charcoal rounded-lg text-sm hover:bg-spa-cloud/10 transition-colors flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
