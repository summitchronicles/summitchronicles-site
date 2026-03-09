import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './lib/rate-limiter';
import { getAllowedOrigins, getServerEnv } from '@/shared/env/server';
import { hasInternalApiAccess } from '@/shared/security/internal-api';

// Security proxy for Peak Performance Summit Chronicles
export async function proxy(request: NextRequest) {
  const env = getServerEnv();
  const ip =
    request.ip ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1';
  const response = NextResponse.next();
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins(env);
  const resolvedCorsOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://ssl.google-analytics.com',
  ];

  if (env.NODE_ENV !== 'production') {
    scriptSources.push("'unsafe-eval'");
  }

  // Security Headers
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-DNS-Prefetch-Control': 'on',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Origin-Agent-Cluster': '?1',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src ${scriptSources.join(' ')}`,
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

  // API route specific security
  if (request.nextUrl.pathname.startsWith('/api/')) {
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

    response.headers.set('X-API-Version', '1.0');
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Access-Control-Allow-Origin', resolvedCorsOrigin);
    response.headers.set('Vary', 'Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': resolvedCorsOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Internal-Api-Key',
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
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    if (!hasInternalApiAccess(request, env) && env.NODE_ENV === 'production') {
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
  if (env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/api/')) {
    console.log('Security event:', {
      type: 'request',
      ip,
      path: request.nextUrl.pathname,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }

  return response;
}

// Configure which routes the proxy should run on
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
