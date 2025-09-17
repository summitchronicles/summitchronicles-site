// Comprehensive error monitoring and logging system for Peak Performance Summit Chronicles
export interface ErrorContext {
  userId?: string
  sessionId: string
  url: string
  userAgent: string
  timestamp: string
  buildVersion?: string
  environment: 'development' | 'production' | 'staging'
}

export interface ErrorReport {
  id: string
  type: 'javascript' | 'network' | 'performance' | 'security' | 'user'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  stack?: string
  context: ErrorContext
  metadata?: Record<string, any>
  fingerprint: string
}

export interface PerformanceIssue {
  id: string
  type: 'slow_load' | 'memory_leak' | 'large_bundle' | 'poor_lcp' | 'high_cls'
  metric: string
  value: number
  threshold: number
  context: ErrorContext
}

// Error monitoring singleton
export class ErrorMonitor {
  private static instance: ErrorMonitor
  private errorQueue: ErrorReport[] = []
  private performanceQueue: PerformanceIssue[] = []
  private sessionId: string
  private isOnline: boolean = true
  private flushInterval: number | null = null

  static getInstance(): ErrorMonitor {
    if (!this.instance) {
      this.instance = new ErrorMonitor()
    }
    return this.instance
  }

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
    this.setupPerformanceMonitoring()
    this.setupNetworkMonitoring()
    this.startPeriodicFlush()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getContext(): ErrorContext {
    return {
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown',
      environment: (process.env.NODE_ENV as 'development' | 'production') || 'development'
    }
  }

  private createFingerprint(error: Error, context: ErrorContext): string {
    const key = `${error.name}:${error.message}:${context.url}`
    return btoa(key).substr(0, 16)
  }

  // Setup global error handlers
  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        type: 'javascript',
        severity: 'high',
        message: event.message || 'Unknown error',
        stack: event.error?.stack,
        context: {
          ...this.getContext(),
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        }
      })
    })

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: 'javascript',
        severity: 'high',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: this.getContext()
      })
    })

    // Network status
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushErrors()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Setup performance monitoring
  private setupPerformanceMonitoring(): void {
    if (typeof window === 'undefined') return

    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.handlePerformanceEntry(entry)
      }
    })

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] })
    } catch (e) {
      console.warn('Performance observer not supported:', e)
    }

    // Memory monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          this.capturePerformanceIssue({
            type: 'memory_leak',
            metric: 'usedJSHeapSize',
            value: memory.usedJSHeapSize,
            threshold: memory.jsHeapSizeLimit * 0.9
          })
        }
      }, 30000) // Check every 30 seconds
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming
        if (navEntry.loadEventEnd - navEntry.navigationStart > 3000) {
          this.capturePerformanceIssue({
            type: 'slow_load',
            metric: 'loadTime',
            value: navEntry.loadEventEnd - navEntry.navigationStart,
            threshold: 3000
          })
        }
        break

      case 'largest-contentful-paint':
        const lcpEntry = entry as PerformanceEntry & { startTime: number }
        if (lcpEntry.startTime > 2500) {
          this.capturePerformanceIssue({
            type: 'poor_lcp',
            metric: 'LCP',
            value: lcpEntry.startTime,
            threshold: 2500
          })
        }
        break

      case 'layout-shift':
        const clsEntry = entry as PerformanceEntry & { value: number }
        if (clsEntry.value > 0.1) {
          this.capturePerformanceIssue({
            type: 'high_cls',
            metric: 'CLS',
            value: clsEntry.value,
            threshold: 0.1
          })
        }
        break
    }
  }

  // Setup network monitoring
  private setupNetworkMonitoring(): void {
    if (typeof window === 'undefined') return

    // Monitor failed network requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args)
        if (!response.ok) {
          this.captureError({
            type: 'network',
            severity: response.status >= 500 ? 'high' : 'medium',
            message: `Network request failed: ${response.status} ${response.statusText}`,
            context: {
              ...this.getContext(),
              metadata: {
                url: args[0],
                status: response.status,
                statusText: response.statusText
              }
            }
          })
        }
        return response
      } catch (error) {
        this.captureError({
          type: 'network',
          severity: 'high',
          message: `Network request error: ${error}`,
          stack: (error as Error).stack,
          context: {
            ...this.getContext(),
            metadata: {
              url: args[0]
            }
          }
        })
        throw error
      }
    }
  }

  // Capture error manually
  captureError(errorData: Partial<ErrorReport>): void {
    const error: ErrorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: errorData.type || 'javascript',
      severity: errorData.severity || 'medium',
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      context: errorData.context || this.getContext(),
      metadata: errorData.metadata,
      fingerprint: errorData.fingerprint || ''
    }

    // Create fingerprint if not provided
    if (!error.fingerprint) {
      error.fingerprint = this.createFingerprint(
        { name: error.type, message: error.message, stack: error.stack } as Error,
        error.context
      )
    }

    this.errorQueue.push(error)

    // Immediate flush for critical errors
    if (error.severity === 'critical') {
      this.flushErrors()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', error)
    }
  }

  // Capture performance issue
  capturePerformanceIssue(issue: Omit<PerformanceIssue, 'id' | 'context'>): void {
    const performanceIssue: PerformanceIssue = {
      id: `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      context: this.getContext(),
      ...issue
    }

    this.performanceQueue.push(performanceIssue)

    if (process.env.NODE_ENV === 'development') {
      console.warn('Performance issue:', performanceIssue)
    }
  }

  // Flush errors to monitoring service
  private async flushErrors(): Promise<void> {
    if (!this.isOnline || (this.errorQueue.length === 0 && this.performanceQueue.length === 0)) {
      return
    }

    const errors = [...this.errorQueue]
    const performanceIssues = [...this.performanceQueue]
    
    this.errorQueue = []
    this.performanceQueue = []

    try {
      await this.sendToMonitoringService({ errors, performanceIssues })
    } catch (error) {
      // Put errors back in queue if sending failed
      this.errorQueue.unshift(...errors)
      this.performanceQueue.unshift(...performanceIssues)
      console.error('Failed to send errors to monitoring service:', error)
    }
  }

  private async sendToMonitoringService(data: {
    errors: ErrorReport[]
    performanceIssues: PerformanceIssue[]
  }): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      // In production, send to your monitoring service (e.g., Sentry, LogRocket, etc.)
      // Example:
      // await fetch('/api/monitoring/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      
      console.log('Would send to monitoring service:', data)
    } else {
      console.log('Error monitoring data:', data)
    }

    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      data.errors.forEach(error => {
        (window as any).gtag('event', 'exception', {
          description: error.message,
          fatal: error.severity === 'critical',
          error_type: error.type,
          error_fingerprint: error.fingerprint
        })
      })

      data.performanceIssues.forEach(issue => {
        (window as any).gtag('event', 'performance_issue', {
          metric_name: issue.metric,
          metric_value: issue.value,
          issue_type: issue.type
        })
      })
    }
  }

  private startPeriodicFlush(): void {
    this.flushInterval = window.setInterval(() => {
      this.flushErrors()
    }, 30000) // Flush every 30 seconds
  }

  // Get error statistics
  getErrorStats(): {
    totalErrors: number
    errorsByType: Record<string, number>
    errorsBySeverity: Record<string, number>
    recentErrors: ErrorReport[]
  } {
    const allErrors = [...this.errorQueue]
    
    return {
      totalErrors: allErrors.length,
      errorsByType: allErrors.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      errorsBySeverity: allErrors.reduce((acc, error) => {
        acc[error.severity] = (acc[error.severity] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentErrors: allErrors.slice(-10)
    }
  }

  // Cleanup
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushErrors() // Final flush
  }
}

// React hook for error monitoring
export const useErrorMonitoring = () => {
  const monitor = React.useMemo(() => ErrorMonitor.getInstance(), [])

  const captureError = React.useCallback((error: Error, context?: Record<string, any>) => {
    monitor.captureError({
      type: 'user',
      severity: 'medium',
      message: error.message,
      stack: error.stack,
      metadata: context
    })
  }, [monitor])

  const captureMessage = React.useCallback((message: string, level: 'low' | 'medium' | 'high' = 'low') => {
    monitor.captureError({
      type: 'user',
      severity: level,
      message
    })
  }, [monitor])

  return { captureError, captureMessage, monitor }
}

// Error boundary with monitoring integration
export const withErrorMonitoring = <P extends object>(
  Component: React.ComponentType<P>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const { captureError } = useErrorMonitoring()

    const ErrorBoundary = React.useMemo(() => {
      class MonitoredErrorBoundary extends React.Component<P, { hasError: boolean }> {
        constructor(props: P) {
          super(props)
          this.state = { hasError: false }
        }

        static getDerivedStateFromError() {
          return { hasError: true }
        }

        componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
          captureError(error, {
            componentStack: errorInfo.componentStack,
            errorBoundary: Component.displayName || Component.name
          })
        }

        render() {
          if (this.state.hasError) {
            return React.createElement('div', null, 'Something went wrong.')
          }

          return React.createElement(Component, { ...this.props, ref })
        }
      }
      MonitoredErrorBoundary.displayName = `ErrorBoundary(${Component.displayName || Component.name})`
      return MonitoredErrorBoundary
    }, [captureError])

    return React.createElement(ErrorBoundary, props)
  })
  
  WrappedComponent.displayName = `withErrorMonitoring(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Initialize error monitoring
export const initializeErrorMonitoring = (): ErrorMonitor => {
  return ErrorMonitor.getInstance()
}

// Export the singleton instance
export const errorMonitor = ErrorMonitor.getInstance()

// React import
import React from 'react'