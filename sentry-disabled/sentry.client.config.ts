import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set sample rates
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Development settings
  debug: process.env.NODE_ENV === 'development',
  
  // Application context
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
  
  // Integration settings
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration({
      // Track navigation and interactions
      tracePropagationTargets: ['localhost', /^https:\/\/summitchronicles\.com\/api/],
    }),
  ],

  // Error filtering
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Filter out common non-actionable errors
    const error = hint.originalException;
    if (error instanceof Error) {
      // Network errors that we can't control
      if (error.message.includes('NetworkError') || 
          error.message.includes('fetch')) {
        return null;
      }
      
      // Browser extension errors
      if (error.stack?.includes('extension://') ||
          error.stack?.includes('chrome-extension://')) {
        return null;
      }
    }
    
    return event;
  },

  // Performance monitoring
  beforeSendTransaction(event) {
    // Only sample important transactions in production
    if (process.env.NODE_ENV === 'production' && Math.random() > 0.1) {
      return null;
    }
    return event;
  },

  // User context
  initialScope: {
    tags: {
      component: 'summit-chronicles',
      phase: 'production-launch'
    },
    contexts: {
      app: {
        name: 'Summit Chronicles',
        version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
      }
    }
  },
});