// Monitoring system for Strava API rate limiting and system health

interface APIMetrics {
  totalRequests: number;
  successfulRequests: number;
  rateLimitedRequests: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  lastRequestTime: number;
  rateLimitReset: number;
  rateLimitRemaining: number;
}

interface MonitoringAlert {
  type: 'rate_limit' | 'error' | 'performance' | 'cache';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  data?: any;
}

class StravaAPIMonitor {
  private metrics: APIMetrics;
  private alerts: MonitoringAlert[] = [];
  private readonly STORAGE_KEY = 'strava_api_metrics';
  private readonly ALERTS_KEY = 'strava_api_alerts';

  constructor() {
    this.metrics = this.loadMetrics();
  }

  private loadMetrics(): APIMetrics {
    if (typeof window === 'undefined') {
      return this.getDefaultMetrics();
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...this.getDefaultMetrics(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load monitoring metrics:', error);
    }
    return this.getDefaultMetrics();
  }

  private getDefaultMetrics(): APIMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      rateLimitedRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      lastRequestTime: 0,
      rateLimitReset: 0,
      rateLimitRemaining: 600, // Strava default
    };
  }

  private saveMetrics(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save monitoring metrics:', error);
    }
  }

  private saveAlerts(): void {
    if (typeof window === 'undefined') return;

    try {
      // Keep only last 50 alerts
      const recentAlerts = this.alerts.slice(-50);
      localStorage.setItem(this.ALERTS_KEY, JSON.stringify(recentAlerts));
      this.alerts = recentAlerts;
    } catch (error) {
      console.warn('Failed to save monitoring alerts:', error);
    }
  }

  recordAPICall(
    response: Response | null,
    startTime: number,
    source: 'api' | 'cache' = 'api'
  ): void {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    this.metrics.totalRequests++;
    this.metrics.lastRequestTime = endTime;

    // Update average response time
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) /
      this.metrics.totalRequests;

    if (source === 'cache') {
      this.metrics.cacheHits++;
      this.saveMetrics();
      return;
    }

    this.metrics.cacheMisses++;

    if (response) {
      // Extract rate limit headers
      const rateLimitRemaining = response.headers.get('x-ratelimit-limit');
      const rateLimitReset = response.headers.get('x-ratelimit-usage');

      if (rateLimitRemaining) {
        this.metrics.rateLimitRemaining = parseInt(rateLimitRemaining);
      }

      if (rateLimitReset) {
        this.metrics.rateLimitReset = parseInt(rateLimitReset);
      }

      if (response.status === 200) {
        this.metrics.successfulRequests++;
      } else if (response.status === 429) {
        this.metrics.rateLimitedRequests++;
        this.addAlert({
          type: 'rate_limit',
          severity: 'high',
          message: `Rate limit hit. Remaining: ${this.metrics.rateLimitRemaining}`,
          timestamp: endTime,
          data: { responseTime, status: response.status }
        });
      } else {
        this.addAlert({
          type: 'error',
          severity: 'medium',
          message: `API request failed with status: ${response.status}`,
          timestamp: endTime,
          data: { responseTime, status: response.status }
        });
      }
    }

    // Performance alerts
    if (responseTime > 5000) {
      this.addAlert({
        type: 'performance',
        severity: 'medium',
        message: `Slow API response: ${responseTime}ms`,
        timestamp: endTime,
        data: { responseTime }
      });
    }

    // Rate limit warnings
    if (this.metrics.rateLimitRemaining < 100) {
      this.addAlert({
        type: 'rate_limit',
        severity: this.metrics.rateLimitRemaining < 50 ? 'critical' : 'high',
        message: `Low rate limit remaining: ${this.metrics.rateLimitRemaining}`,
        timestamp: endTime,
        data: { rateLimitRemaining: this.metrics.rateLimitRemaining }
      });
    }

    this.saveMetrics();
  }

  private addAlert(alert: MonitoringAlert): void {
    this.alerts.push(alert);
    this.saveAlerts();

    // Log critical alerts to console
    if (alert.severity === 'critical') {
      console.error('🚨 Critical Strava API Alert:', alert);
    } else if (alert.severity === 'high') {
      console.warn('⚠️  High Strava API Alert:', alert);
    }
  }

  getMetrics(): APIMetrics {
    return { ...this.metrics };
  }

  getAlerts(): MonitoringAlert[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.ALERTS_KEY);
      if (stored) {
        this.alerts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load alerts:', error);
    }

    return [...this.alerts];
  }

  getRecentAlerts(hours: number = 24): MonitoringAlert[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    return this.getAlerts().filter(alert => alert.timestamp > cutoff);
  }

  getCacheEfficiency(): number {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    if (total === 0) return 0;
    return (this.metrics.cacheHits / total) * 100;
  }

  getSuccessRate(): number {
    if (this.metrics.totalRequests === 0) return 100;
    return (this.metrics.successfulRequests / this.metrics.totalRequests) * 100;
  }

  getRateLimitStatus(): {
    remaining: number;
    resetTime: number;
    isNearLimit: boolean;
    isCritical: boolean;
  } {
    return {
      remaining: this.metrics.rateLimitRemaining,
      resetTime: this.metrics.rateLimitReset,
      isNearLimit: this.metrics.rateLimitRemaining < 200,
      isCritical: this.metrics.rateLimitRemaining < 100,
    };
  }

  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    const recentAlerts = this.getRecentAlerts(1); // Last hour
    const criticalAlerts = recentAlerts.filter(a => a.severity === 'critical');
    const highAlerts = recentAlerts.filter(a => a.severity === 'high');

    if (criticalAlerts.length > 0) {
      issues.push(`${criticalAlerts.length} critical alerts in the last hour`);
    }

    if (this.metrics.rateLimitRemaining < 100) {
      issues.push('Rate limit critically low');
      recommendations.push('Reduce API polling frequency');
    } else if (this.metrics.rateLimitRemaining < 200) {
      issues.push('Rate limit running low');
      recommendations.push('Monitor API usage closely');
    }

    const successRate = this.getSuccessRate();
    if (successRate < 90) {
      issues.push(`Low API success rate: ${successRate.toFixed(1)}%`);
      recommendations.push('Investigate API failures');
    }

    const cacheEfficiency = this.getCacheEfficiency();
    if (cacheEfficiency < 70) {
      issues.push(`Low cache efficiency: ${cacheEfficiency.toFixed(1)}%`);
      recommendations.push('Extend cache duration or improve cache strategy');
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (criticalAlerts.length > 0 || this.metrics.rateLimitRemaining < 50) {
      status = 'critical';
    } else if (issues.length > 0) {
      status = 'warning';
    }

    return { status, issues, recommendations };
  }

  clearOldData(olderThanDays: number = 7): void {
    const cutoff = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoff);
    this.saveAlerts();
  }

  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      alerts: this.getRecentAlerts(24),
      healthStatus: this.getHealthStatus(),
      exportTime: new Date().toISOString(),
    }, null, 2);
  }
}

// Singleton instance
export const stravaMonitor = new StravaAPIMonitor();

// Helper functions for monitoring API calls
export const monitoredFetch = async (url: string, options?: RequestInit) => {
  const startTime = Date.now();

  try {
    const response = await fetch(url, options);
    stravaMonitor.recordAPICall(response, startTime, 'api');
    return response;
  } catch (error) {
    stravaMonitor.recordAPICall(null, startTime, 'api');
    throw error;
  }
};

export const recordCacheHit = () => {
  stravaMonitor.recordAPICall(null, Date.now(), 'cache');
};

export { StravaAPIMonitor };
export type { APIMetrics, MonitoringAlert };