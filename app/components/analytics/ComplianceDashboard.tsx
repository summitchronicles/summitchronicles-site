'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Heart,
  Award,
  AlertCircle
} from 'lucide-react';

interface ComplianceMetrics {
  durationMatch: number;
  intensityMatch: number;
  distanceMatch: number;
  overallScore: number;
  completed: boolean;
  notes: string[];
}

interface PerformanceAnalytics {
  weeklyCompliance: number;
  monthlyCompliance: number;
  totalWorkouts: number;
  completedWorkouts: number;
  skippedWorkouts: number;
  averageDuration: number;
  averageIntensity: number;
  improvementTrend: 'improving' | 'declining' | 'stable';
  riskFactors: string[];
  recommendations: string[];
}

interface ComplianceAlert {
  type: 'missed_workout' | 'declining_performance' | 'goal_at_risk' | 'improvement_opportunity';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  actionItems: string[];
}

interface ComplianceDashboardProps {
  className?: string;
}

export function ComplianceDashboard({ className = '' }: ComplianceDashboardProps) {
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/compliance?timeframe=${timeframe}&alerts=true&trends=true`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
        setAlerts(data.alerts || []);
      } else {
        setError(data.error || 'Failed to load analytics');
      }
    } catch (err) {
      console.error('Analytics loading error:', err);
      setError('Error loading compliance analytics');
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-900/20 border-green-700';
    if (score >= 60) return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
    return 'text-red-400 bg-red-900/20 border-red-700';
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-600 bg-red-900/20';
      case 'medium':
        return 'border-yellow-600 bg-yellow-900/20';
      default:
        return 'border-blue-600 bg-blue-900/20';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'missed_workout':
        return <Calendar className="w-5 h-5 text-red-400" />;
      case 'declining_performance':
        return <TrendingDown className="w-5 h-5 text-orange-400" />;
      case 'goal_at_risk':
        return <Target className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>Error loading analytics: {error}</span>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-6 ${className}`}>
        <div className="text-gray-400 text-center">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-white" />
            <h2 className="text-xl font-light tracking-wide text-white">
              COMPLIANCE ANALYTICS
            </h2>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeframe === period
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border ${getComplianceColor(analytics.weeklyCompliance)}`}>
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-2xl font-light">{analytics.weeklyCompliance}%</span>
            </div>
            <h3 className="font-medium tracking-wide text-sm">WEEKLY COMPLIANCE</h3>
            <p className="text-xs opacity-75 mt-1">Last 7 days</p>
          </div>

          <div className={`p-4 rounded-lg border ${getComplianceColor(analytics.monthlyCompliance)}`}>
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5" />
              <span className="text-2xl font-light">{analytics.monthlyCompliance}%</span>
            </div>
            <h3 className="font-medium tracking-wide text-sm">MONTHLY COMPLIANCE</h3>
            <p className="text-xs opacity-75 mt-1">Last 30 days</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-600 bg-gray-700/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-light text-white">{analytics.completedWorkouts}/{analytics.totalWorkouts}</span>
            </div>
            <h3 className="font-medium tracking-wide text-sm text-white">COMPLETION RATE</h3>
            <p className="text-xs text-gray-400 mt-1">Activities completed</p>
          </div>

          <div className="p-4 rounded-lg border border-gray-600 bg-gray-700/20">
            <div className="flex items-center justify-between mb-2">
              {getTrendIcon(analytics.improvementTrend)}
              <span className="text-2xl font-light text-white">{analytics.averageDuration}min</span>
            </div>
            <h3 className="font-medium tracking-wide text-sm text-white">AVG DURATION</h3>
            <p className="text-xs text-gray-400 mt-1 capitalize">{analytics.improvementTrend} trend</p>
          </div>
        </div>
      </div>

      {/* Performance Details */}
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-light tracking-wide text-white mb-4">PERFORMANCE BREAKDOWN</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Workout Statistics */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Workout Statistics</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Completed Workouts</span>
                </div>
                <span className="text-sm font-medium text-white">{analytics.completedWorkouts}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-gray-300">Skipped Workouts</span>
                </div>
                <span className="text-sm font-medium text-white">{analytics.skippedWorkouts}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Average Duration</span>
                </div>
                <span className="text-sm font-medium text-white">{analytics.averageDuration} min</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Average Intensity</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {analytics.averageIntensity.toFixed(1)}/3.0
                </span>
              </div>
            </div>
          </div>

          {/* Risk Factors & Recommendations */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Insights</h4>

            {analytics.riskFactors.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-red-400 uppercase">Risk Factors</h5>
                {analytics.riskFactors.slice(0, 3).map((risk, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-300">{risk}</span>
                  </div>
                ))}
              </div>
            )}

            {analytics.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-green-400 uppercase">Recommendations</h5>
                {analytics.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-light tracking-wide text-white mb-4">ACTIVE ALERTS</h3>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{alert.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full uppercase tracking-wide ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-3">{alert.message}</p>

                    {alert.actionItems.length > 0 && (
                      <div className="space-y-1">
                        <h5 className="text-xs font-medium text-gray-400 uppercase">Action Items:</h5>
                        {alert.actionItems.slice(0, 2).map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-xs text-gray-400">{action}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
