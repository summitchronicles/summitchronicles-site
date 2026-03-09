import type { MonitoringSink } from '@/modules/monitoring/application/monitoring-controller';
import type { MonitoringEnvelope } from '@/modules/monitoring/application/monitoring-controller';

export const sentryMonitoringSink: MonitoringSink = {
  async send(payload: MonitoringEnvelope): Promise<void> {
    console.log('Would send to Sentry:', payload.errors.length, 'errors');
  },
};

export const analyticsMonitoringSink: MonitoringSink = {
  async send(payload: MonitoringEnvelope): Promise<void> {
    console.log('Would send to Analytics:', payload.errors.length, 'errors');
  },
};

export const alertMonitoringSink: MonitoringSink = {
  async send(payload: MonitoringEnvelope): Promise<void> {
    const criticalErrors = payload.errors.filter(
      (error) => error.severity === 'critical'
    );
    const highSeverityErrors = payload.errors.filter(
      (error) => error.severity === 'high'
    );
    const memoryLeaks = payload.performanceIssues.filter(
      (issue) => issue.type === 'memory_leak'
    );

    if (criticalErrors.length > 0) {
      console.warn('CRITICAL ERRORS DETECTED:', criticalErrors.length);
    }

    if (highSeverityErrors.length > 5) {
      console.warn('HIGH ERROR VOLUME:', highSeverityErrors.length);
    }

    if (memoryLeaks.length > 0) {
      console.warn('MEMORY LEAKS DETECTED:', memoryLeaks.length);
    }
  },
};

export const productionMonitoringSinks: MonitoringSink[] = [
  sentryMonitoringSink,
  analyticsMonitoringSink,
  alertMonitoringSink,
];
