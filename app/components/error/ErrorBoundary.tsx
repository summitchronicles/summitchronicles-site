'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'section';
  name?: string;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  resetError: () => void;
  errorId: string;
  level: string;
  name?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({ errorInfo });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service
    this.reportError(error, errorInfo);

    // Auto-recovery for component-level errors
    if (this.props.level === 'component') {
      this.resetTimeoutId = window.setTimeout(() => {
        this.resetError();
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        level: this.props.level || 'component',
        name: this.props.name || 'Unknown',
      },
      errorId: this.state.errorId,
    };

    // Send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorReport })
      console.error('Error Report:', errorReport);
    }

    // Send to custom analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: this.props.level === 'page',
      });
    }
  };

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          errorInfo={this.state.errorInfo!}
          resetError={this.resetError}
          errorId={this.state.errorId}
          level={this.props.level || 'component'}
          name={this.props.name}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback components
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  errorId,
  level,
  name,
}) => {
  const isPageLevel = level === 'page';

  return (
    <div
      className={`${isPageLevel ? 'min-h-screen' : 'min-h-64'} flex items-center justify-center p-6`}
    >
      <div className="max-w-md w-full text-center">
        <div
          className={`mx-auto mb-4 ${isPageLevel ? 'w-16 h-16' : 'w-12 h-12'} text-red-500`}
        >
          <AlertTriangle className="w-full h-full" />
        </div>

        <h2
          className={`${isPageLevel ? 'text-2xl' : 'text-lg'} font-semibold text-spa-charcoal mb-2`}
        >
          {isPageLevel ? 'Something went wrong' : 'Component Error'}
        </h2>

        <p className="text-spa-charcoal/70 mb-6">
          {isPageLevel
            ? 'We encountered an unexpected error. Please try refreshing the page.'
            : 'This component failed to load. You can try again or continue using the page.'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-spa-charcoal mb-2">
              Error Details (Development)
            </summary>
            <div className="bg-red-50 border border-red-200 rounded p-3 text-xs">
              <div className="font-medium text-red-900 mb-1">
                {error.name}: {error.message}
              </div>
              {name && (
                <div className="text-red-700 mb-2">Component: {name}</div>
              )}
              <div className="text-red-600 text-xs">ID: {errorId}</div>
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetError}
            className="flex items-center justify-center gap-2 bg-alpine-blue text-white px-4 py-2 rounded-lg hover:bg-alpine-blue/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          {isPageLevel && (
            <button
              onClick={() => (window.location.href = '/')}
              className="flex items-center justify-center gap-2 border border-spa-stone/20 text-spa-charcoal px-4 py-2 rounded-lg hover:bg-spa-cloud/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>

        {isPageLevel && (
          <div className="mt-6 text-xs text-spa-charcoal/50">
            Error ID: {errorId}
          </div>
        )}
      </div>
    </div>
  );
};

// Specialized error fallbacks
const MinimalErrorFallback: React.FC<ErrorFallbackProps> = ({ resetError }) => (
  <div className="flex items-center justify-center p-4 text-center">
    <div>
      <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="text-sm text-spa-charcoal/70 mb-3">
        Component failed to load
      </p>
      <button
        onClick={resetError}
        className="text-xs bg-alpine-blue text-white px-3 py-1 rounded hover:bg-alpine-blue/90"
      >
        Retry
      </button>
    </div>
  </div>
);

const InlineErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => (
  <div className="bg-red-50 border border-red-200 rounded p-3">
    <div className="flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-800 font-medium">
          Error loading component
        </p>
        <p className="text-xs text-red-600 mt-1">{error.message}</p>
        <button
          onClick={resetError}
          className="text-xs text-red-700 hover:text-red-900 mt-2 underline"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
);

// Higher-order component for error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryConfig?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...(props as P)} {...(ref ? { ref } : {})} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Export error boundary components
export { ErrorBoundary, MinimalErrorFallback, InlineErrorFallback };
export default ErrorBoundary;
