// lib/error-monitor.ts - Simple error monitoring and logging system

interface ErrorEvent {
  timestamp: string;
  error: string;
  context?: any;
  url?: string;
  userAgent?: string;
  userId?: string;
}

interface PerformanceEvent {
  timestamp: string;
  route: string;
  duration: number;
  success: boolean;
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private webhookUrl: string;
  private isEnabled: boolean;

  constructor() {
    this.webhookUrl = process.env.LOG_WEBHOOK_URL || '';
    this.isEnabled = !!this.webhookUrl;
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  // Log errors with context
  async logError(error: Error | string, context?: any, request?: Request): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const errorEvent: ErrorEvent = {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : error,
        context,
        url: request?.url,
        userAgent: request?.headers.get('user-agent') || undefined,
      };

      // Add stack trace for Error objects
      if (error instanceof Error && error.stack) {
        (errorEvent as any).stack = error.stack;
      }

      await this.sendToWebhook({
        type: 'error',
        level: 'error',
        ...errorEvent
      });

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('🚨 Error Monitor:', errorEvent);
      }
    } catch (e) {
      // Fail silently - don't break the app if monitoring fails
      console.error('Error monitor failed:', e);
    }
  }

  // Log performance metrics
  async logPerformance(route: string, duration: number, success: boolean = true): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const perfEvent: PerformanceEvent = {
        timestamp: new Date().toISOString(),
        route,
        duration,
        success
      };

      await this.sendToWebhook({
        type: 'performance',
        level: 'info',
        ...perfEvent
      });
    } catch (e) {
      console.error('Performance logging failed:', e);
    }
  }

  // Log info events (API calls, user actions, etc.)
  async logInfo(message: string, data?: any): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.sendToWebhook({
        type: 'info',
        level: 'info',
        timestamp: new Date().toISOString(),
        message,
        data
      });
    } catch (e) {
      console.error('Info logging failed:', e);
    }
  }

  // Log critical system events (Strava token refresh, DB issues, etc.)
  async logCritical(message: string, data?: any): Promise<void> {
    if (!this.isEnabled) {
      console.error('🚨 CRITICAL:', message, data);
      return;
    }

    try {
      await this.sendToWebhook({
        type: 'critical',
        level: 'critical',
        timestamp: new Date().toISOString(),
        message,
        data,
        alert: true // Flag for alerting systems
      });

      // Always log critical events to console
      console.error('🚨 CRITICAL:', message, data);
    } catch (e) {
      console.error('Critical logging failed:', e);
    }
  }

  private async sendToWebhook(payload: any): Promise<void> {
    if (!this.webhookUrl) return;

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          service: 'summit-chronicles',
          environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown'
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }
    } catch (error) {
      // Don't throw - monitoring shouldn't break the app
      console.error('Webhook send failed:', error);
    }
  }
}

// Singleton instance
const errorMonitor = ErrorMonitor.getInstance();

// Convenience functions
export const logError = (error: Error | string, context?: any, request?: Request) => 
  errorMonitor.logError(error, context, request);

export const logPerformance = (route: string, duration: number, success?: boolean) => 
  errorMonitor.logPerformance(route, duration, success);

export const logInfo = (message: string, data?: any) => 
  errorMonitor.logInfo(message, data);

export const logCritical = (message: string, data?: any) => 
  errorMonitor.logCritical(message, data);

// Higher-order function to wrap API routes with error monitoring
export function withErrorMonitoring<T extends any[], R>(
  routeName: string,
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    
    try {
      const result = await handler(...args);
      const duration = Date.now() - startTime;
      
      // Log successful performance
      await logPerformance(routeName, duration, true);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log error and performance
      await logError(error instanceof Error ? error : String(error), { route: routeName });
      await logPerformance(routeName, duration, false);
      
      throw error; // Re-throw to maintain normal error handling
    }
  };
}

// React hook for client-side error reporting
export const useErrorReporting = () => {
  const reportError = (error: Error | string, context?: any) => {
    // Send to our API endpoint for server-side logging
    fetch('/api/error-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {}); // Fail silently
  };

  return { reportError };
};

export default errorMonitor;