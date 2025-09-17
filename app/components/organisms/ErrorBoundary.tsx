'use client';

import React from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { H2, Body } from '../atoms/Typography';
import { Card } from '../molecules/Card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            retry={this.handleRetry}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error!}
          retry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  retry,
}) => (
  <div className="min-h-screen bg-spa-stone flex items-center justify-center px-4">
    <Card
      variant="elevated"
      padding="lg"
      className="max-w-lg w-full text-center space-y-6"
    >
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
          <Icon name="AlertTriangle" size="xl" className="text-red-600" />
        </div>
      </div>

      <div className="space-y-3">
        <H2 className="text-spa-charcoal">Something went wrong</H2>
        <Body className="text-spa-slate">
          We encountered an unexpected error. This has been logged and we're
          working to fix it.
        </Body>
      </div>

      <div className="space-y-3">
        <Button onClick={retry} variant="primary" className="w-full">
          <Icon name="RefreshCw" size="sm" />
          Try Again
        </Button>

        <Button
          onClick={() => (window.location.href = '/')}
          variant="ghost"
          className="w-full"
        >
          <Icon name="Home" size="sm" />
          Return Home
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm text-spa-slate hover:text-alpine-blue">
            Error Details (Development)
          </summary>
          <pre className="mt-3 p-3 bg-spa-mist rounded text-xs overflow-auto text-spa-charcoal">
            {error.message}
            {error.stack}
          </pre>
        </details>
      )}
    </Card>
  </div>
);

// Specialized error components
const NetworkErrorFallback: React.FC<ErrorFallbackProps> = ({ retry }) => (
  <div className="min-h-screen bg-spa-stone flex items-center justify-center px-4">
    <Card
      variant="elevated"
      padding="lg"
      className="max-w-lg w-full text-center space-y-6"
    >
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
          <Icon name="Wifi" size="xl" className="text-alpine-blue" />
        </div>
      </div>

      <div className="space-y-3">
        <H2 className="text-spa-charcoal">Connection Issue</H2>
        <Body className="text-spa-slate">
          Unable to connect to our servers. Please check your internet
          connection and try again.
        </Body>
      </div>

      <Button onClick={retry} variant="primary" className="w-full">
        <Icon name="RefreshCw" size="sm" />
        Retry Connection
      </Button>
    </Card>
  </div>
);

export { ErrorBoundary, DefaultErrorFallback, NetworkErrorFallback };
export type { ErrorBoundaryProps, ErrorFallbackProps };
