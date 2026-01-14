import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './lib/rate-limiter';

// Security middleware for Peak Performance Summit Chronicles
export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const response = NextResponse.next();

  // Security Headers
  const securityHeaders = {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Control framing (prevent clickjacking)
    'X-Frame-Options': 'DENY',

    // Force HTTPS
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // DNS prefetch control
    'X-DNS-Prefetch-Control': 'on',

    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "media-src 'self' https:",
      "connect-src 'self' https://www.google-analytics.com https://api.sanity.io wss://api.sanity.io",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; '),

    // Permissions Policy (formerly Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
    ].join(', '),
  };

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate limiting headers (basic implementation)
  // const ip is already defined at top scope
  const userIp = ip; // Alias if needed, or just use ip

  // Add rate limiting info to headers (for monitoring)
  response.headers.set('X-Client-IP', ip);
  response.headers.set('X-Request-Time', new Date().toISOString());

  // API route specific security
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Rate Limiting
    try {
      const rateLimitResult = await checkRateLimit(ip);

      if (!rateLimitResult.allowed) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': '60',
            'Content-Type': 'text/plain',
          },
        });
      }
    } catch (error) {
      // Fail open if rate limiter errors (e.g. import issues in edge)
      console.error('Rate limit check failed:', error);
    }

    // Additional API security headers
    response.headers.set('X-API-Version', '1.0');
    response.headers.set('Cache-Control', 'no-store, must-revalidate');

    // CORS for API routes
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin':
            process.env.NODE_ENV === 'production'
              ? 'https://summit-chronicles.netlify.app'
              : 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
          ...securityHeaders,
        },
      });
    }
  }

  // Admin route protection
  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/studio')
  ) {
    // Additional security for admin routes
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    // Simple authentication check using API key or session cookie
    const authCookie = request.cookies.get('admin_session');
    const apiKey = request.headers.get('x-admin-key');
    const adminKey = process.env.INTERNAL_API_KEY;

    // Check if user is authenticated via cookie or API key
    const isAuthenticated =
      (authCookie && authCookie.value === adminKey) ||
      (apiKey && apiKey === adminKey);

    // Protect admin routes in production
    if (!isAuthenticated && process.env.NODE_ENV === 'production') {
      console.warn('Unauthorized admin access attempt:', {
        ip,
        path: request.nextUrl.pathname,
        timestamp: new Date().toISOString(),
      });

      // Return 401 Unauthorized
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Bearer realm="Admin Area"',
        },
      });
    }
  }

  // Bot protection
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousBots = [
    'scrapy',
    'crawler',
    'spider',
    'bot',
    'curl',
    'wget',
    'python-requests',
  ];

  const isSuspiciousBot = suspiciousBots.some((bot) =>
    userAgent.toLowerCase().includes(bot)
  );

  if (isSuspiciousBot && !request.nextUrl.pathname.startsWith('/api/robots')) {
    // Allow legitimate bots but rate limit suspicious ones
    response.headers.set('X-Bot-Detection', 'suspicious');

    // You could implement more sophisticated bot protection here
    if (process.env.NODE_ENV === 'production') {
      // Log suspicious activity
      console.warn('Suspicious bot detected:', {
        userAgent,
        ip,
        path: request.nextUrl.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Monitoring and logging
  if (process.env.NODE_ENV === 'production') {
    // Log security events
    const securityEvent = {
      type: 'request',
      ip,
      userAgent,
      path: request.nextUrl.pathname,
      method: request.method,
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(request.headers.entries()),
    };

    // You would send this to your monitoring service
    console.log('Security event:', securityEvent);
  }

  return response;
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
