'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  TrendingUp,
  Zap,
  RefreshCw,
  Download,
} from 'lucide-react';
import { stravaMonitor } from '@/lib/monitoring';
import type { APIMetrics, MonitoringAlert } from '@/lib/monitoring';

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<APIMetrics | null>(null);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = () => {
    setRefreshing(true);
    setMetrics(stravaMonitor.getMetrics());
    setAlerts(stravaMonitor.getRecentAlerts(24));
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const healthStatus = metrics ? stravaMonitor.getHealthStatus() : null;
  const cacheEfficiency = metrics ? stravaMonitor.getCacheEfficiency() : 0;
  const successRate = metrics ? stravaMonitor.getSuccessRate() : 0;
  const rateLimitStatus = metrics ? stravaMonitor.getRateLimitStatus() : null;

  const exportData = () => {
    const data = stravaMonitor.exportMetrics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strava-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!metrics) {
    return (
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-white animate-spin mr-2" />
          <span className="text-white">Loading monitoring data...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-900/30 border-green-700/30';
      case 'warning': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700/30';
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-700/30';
      default: return 'text-gray-400 bg-gray-700 border-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-white mb-2">
            API Monitoring Dashboard
          </h2>
          <p className="text-gray-400">
            Real-time monitoring of Strava API rate limiting and system health
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Health Status */}
      {healthStatus && (
        <div className={`p-6 rounded-lg border ${getStatusColor(healthStatus.status)}`}>
          <div className="flex items-center gap-3 mb-4">
            {healthStatus.status === 'healthy' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
            <h3 className="text-xl font-light">
              System Status: {healthStatus.status.toUpperCase()}
            </h3>
          </div>

          {healthStatus.issues.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Current Issues:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {healthStatus.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {healthStatus.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {healthStatus.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-light text-white">
                {metrics.totalRequests}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Total Requests
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Success rate: {successRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              rateLimitStatus?.isCritical ? 'bg-red-900/30' :
              rateLimitStatus?.isNearLimit ? 'bg-yellow-900/30' : 'bg-green-900/30'
            }`}>
              <Zap className={`w-5 h-5 ${
                rateLimitStatus?.isCritical ? 'text-red-400' :
                rateLimitStatus?.isNearLimit ? 'text-yellow-400' : 'text-green-400'
              }`} />
            </div>
            <div>
              <div className="text-2xl font-light text-white">
                {rateLimitStatus?.remaining || 0}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Rate Limit Left
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            429 errors: {metrics.rateLimitedRequests}
          </div>
        </div>

        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-light text-white">
                {cacheEfficiency.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Cache Efficiency
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Hits: {metrics.cacheHits} | Misses: {metrics.cacheMisses}
          </div>
        </div>

        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-light text-white">
                {Math.round(metrics.averageResponseTime)}ms
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                Avg Response Time
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Last: {metrics.lastRequestTime ?
              new Date(metrics.lastRequestTime).toLocaleTimeString() : 'Never'
            }
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-white" />
          <h3 className="text-xl font-light tracking-wide text-white">
            Recent Alerts (24 hours)
          </h3>
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No alerts in the last 24 hours</p>
            <p className="text-sm">System running smoothly</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(-10).reverse().map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-600/50 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'critical' ? 'bg-red-400' :
                  alert.severity === 'high' ? 'bg-orange-400' :
                  alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {alert.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monitoring Footer */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            Monitoring active since {new Date().toLocaleDateString()}
          </div>
          <div className="flex items-center gap-4">
            <span>Auto-refresh: 30s</span>
            <span>•</span>
            <span>Data retention: 7 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}