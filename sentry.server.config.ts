// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Server-side sampling - reduce in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment and release tracking
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
  release: process.env.npm_package_version || '1.0.0',

  // Enable logs to be sent to Sentry
  enableLogs: process.env.NODE_ENV === 'production',

  // Debug mode for development only
  debug: process.env.NODE_ENV === 'development',

  // Error filtering for production
  beforeSend(event, hint) {
    // Don't send development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    const error = hint.originalException;
    if (error instanceof Error) {
      // Filter out expected API errors
      if (error.message.includes('Rate limit') || 
          error.message.includes('validation') ||
          error.message.includes('Unauthorized')) {
        return null;
      }
    }
    
    return event;
  },

  // Server context
  initialScope: {
    tags: {
      runtime: 'nodejs',
      component: 'summit-chronicles-server'
    }
  },
});
