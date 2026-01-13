import { RateLimiterMemory } from 'rate-limiter-flexible';

/**
 * Rate limiter configurations for different API endpoints
 */
const rateLimiters = {
  // Strict rate limiting for sensitive endpoints (Garmin credentials, training data)
  strict: new RateLimiterMemory({
    points: 10, // 10 requests
    duration: 60, // per 60 seconds (1 minute)
  }),

  // Standard rate limiting for general API endpoints
  standard: new RateLimiterMemory({
    points: 30, // 30 requests
    duration: 60, // per 60 seconds (1 minute)
  }),

  // Generous rate limiting for public endpoints (AI search, newsletter)
  generous: new RateLimiterMemory({
    points: 60, // 60 requests
    duration: 60, // per 60 seconds (1 minute)
  }),
};

/**
 * Rate limiter types
 */
export type RateLimiterType = keyof typeof rateLimiters;

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier (usually IP address)
 * @param type - Type of rate limiter to use ('strict' | 'standard' | 'generous')
 * @returns Promise<boolean> - true if request is allowed, false if rate limited
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimiterType = 'standard'
): Promise<boolean> {
  try {
    await rateLimiters[type].consume(identifier);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get client IP address from request headers
 * @param request - Next.js Request object
 * @returns IP address or 'unknown'
 */
export function getClientIp(request: Request): string {
  // Try x-forwarded-for first (most common in production)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Try x-real-ip
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback
  return 'unknown';
}

/**
 * Helper function to create a rate limit response
 * @returns Response object with 429 status and error message
 */
export function createRateLimitResponse(): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests. Please try again later.',
      retryAfter: 60, // seconds
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    }
  );
}
