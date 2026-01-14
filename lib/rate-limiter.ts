/**
 * Simple Token Bucket Rate Limiter for Edge Runtime
 * No external dependencies to ensure compatibility with Vercel Middleware.
 */

interface RateLimitData {
  tokens: number;
  lastRefill: number;
}

const WINDOW_SIZE = 60 * 1000; // 60 seconds
const MAX_TOKENS = 20; // 20 requests per window
const store = new Map<string, RateLimitData>();

/**
 * Check if a request should be rate limited
 * @param ip - IP address of the requester
 * @returns Promise that resolves if allowed, rejects if blocked
 */
export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean }> {
  const now = Date.now();
  let data = store.get(ip);

  // Initialize if new
  if (!data) {
    data = { tokens: MAX_TOKENS, lastRefill: now };
    store.set(ip, data);
  }

  // Refill tokens based on time passed
  const timePassed = now - data.lastRefill;
  if (timePassed > WINDOW_SIZE) {
    // Reset window
    data.tokens = MAX_TOKENS;
    data.lastRefill = now;
  }

  // Consume token
  if (data.tokens > 0) {
    data.tokens--;
    return { allowed: true };
  } else {
    // Rate limited
    return { allowed: false };
  }
}

/**
 * Helper to get client IP from request
 */
export function getClientIp(request: any): string {
  // Handle NextRequest or standard Request with headers
  if (request.ip) return request.ip;
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return '127.0.0.1';
}

/**
 * Helper to create standard rate limit response
 */
export function createRateLimitResponse(): Response {
  return new Response('Too Many Requests', {
    status: 429,
    headers: {
      'Retry-After': '60',
      'Content-Type': 'text/plain',
    },
  });
}
