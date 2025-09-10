import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

// Initialize Redis client for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Define different rate limits for different endpoints
export const rateLimits = {
  // AI endpoints - more restrictive due to compute cost
  aiQuery: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
    prefix: "ratelimit:ai"
  }),
  
  // API endpoints - moderate restrictions
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 requests per minute
    analytics: true,
    prefix: "ratelimit:api"
  }),
  
  // Authentication endpoints - strict to prevent brute force
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 attempts per minute
    analytics: true,
    prefix: "ratelimit:auth"
  }),
  
  // Newsletter signup - prevent spam
  newsletter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 signups per hour
    analytics: true,
    prefix: "ratelimit:newsletter"
  }),
  
  // General endpoints - relaxed for normal usage
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 requests per minute
    analytics: true,
    prefix: "ratelimit:general"
  }),
  
  // Admin endpoints - moderate restrictions for legitimate admin use
  admin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 requests per minute
    analytics: true,
    prefix: "ratelimit:admin"
  }),
  
  // Strava endpoints - protect against API quota exhaustion
  strava: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
    prefix: "ratelimit:strava"
  })
};

// Fallback in-memory rate limiting when Redis is unavailable
class InMemoryRateLimit {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async check(identifier: string): Promise<{ success: boolean; remaining: number; reset: Date }> {
    const now = Date.now();
    const key = identifier;
    
    const existing = this.requests.get(key);
    
    if (!existing || now > existing.resetTime) {
      // New window or expired window
      this.requests.set(key, { count: 1, resetTime: now + this.windowMs });
      return {
        success: true,
        remaining: this.limit - 1,
        reset: new Date(now + this.windowMs)
      };
    }
    
    if (existing.count >= this.limit) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        reset: new Date(existing.resetTime)
      };
    }
    
    // Increment count
    existing.count++;
    this.requests.set(key, existing);
    
    return {
      success: true,
      remaining: this.limit - existing.count,
      reset: new Date(existing.resetTime)
    };
  }
}

// Fallback rate limiters
const fallbackLimits = {
  aiQuery: new InMemoryRateLimit(10, 60 * 1000), // 10 per minute
  api: new InMemoryRateLimit(30, 60 * 1000),     // 30 per minute
  auth: new InMemoryRateLimit(5, 60 * 1000),     // 5 per minute
  newsletter: new InMemoryRateLimit(3, 60 * 60 * 1000), // 3 per hour
  general: new InMemoryRateLimit(60, 60 * 1000),  // 60 per minute
  admin: new InMemoryRateLimit(20, 60 * 1000),    // 20 per minute
  strava: new InMemoryRateLimit(10, 60 * 1000)    // 10 per minute
};

export type RateLimitType = keyof typeof rateLimits;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: Date;
  identifier: string;
  type: RateLimitType;
}

/**
 * Check rate limit for a request
 */
export async function checkRateLimit(
  request: NextRequest,
  type: RateLimitType = 'general'
): Promise<RateLimitResult> {
  const identifier = getClientIdentifier(request);
  
  try {
    // Try Redis-based rate limiting first
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const rateLimit = rateLimits[type];
      const result = await rateLimit.limit(identifier);
      
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
        identifier,
        type
      };
    } else {
      // Fall back to in-memory rate limiting
      console.warn('Redis not configured, using in-memory rate limiting');
      const fallbackLimit = fallbackLimits[type];
      const result = await fallbackLimit.check(identifier);
      
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
        identifier,
        type
      };
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
    
    // On error, fall back to in-memory limiting
    const fallbackLimit = fallbackLimits[type];
    const result = await fallbackLimit.check(identifier);
    
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      identifier,
      type
    };
  }
}

/**
 * Generate client identifier for rate limiting
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP address from headers (Vercel specific)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  // Get IP address
  const ip = forwarded?.split(',')[0] || realIp || '127.0.0.1';
  
  // For authenticated requests, also include user session info
  const userAgent = request.headers.get('user-agent') || '';
  const authorization = request.headers.get('authorization');
  
  // Create a composite identifier
  if (authorization) {
    // For authenticated requests, combine IP and auth hash
    const authHash = Buffer.from(authorization).toString('base64').slice(0, 8);
    return `${ip}:${authHash}`;
  }
  
  // For anonymous requests, use IP + User Agent hash
  const uaHash = Buffer.from(userAgent).toString('base64').slice(0, 8);
  return `${ip}:${uaHash}`;
}

/**
 * Middleware wrapper for rate limiting
 */
export function withRateLimit<T extends any[], R>(
  type: RateLimitType,
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | Response> => {
    // Assume first argument is NextRequest
    const request = args[0] as NextRequest;
    
    const rateLimitResult = await checkRateLimit(request, type);
    
    if (!rateLimitResult.success) {
      // Rate limit exceeded
      const resetTime = Math.round(rateLimitResult.reset.getTime() / 1000);
      
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again after ${rateLimitResult.reset.toLocaleTimeString()}`,
          type: type,
          reset: resetTime,
          remaining: 0
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': getRateLimitString(type),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': resetTime.toString(),
            'Retry-After': Math.round((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    // Add rate limit headers to successful responses
    const result = await handler(...args);
    
    if (result instanceof Response) {
      const resetTime = Math.round(rateLimitResult.reset.getTime() / 1000);
      result.headers.set('X-RateLimit-Limit', getRateLimitString(type));
      result.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      result.headers.set('X-RateLimit-Reset', resetTime.toString());
    }
    
    return result;
  };
}

/**
 * Get human-readable rate limit string
 */
function getRateLimitString(type: RateLimitType): string {
  const limits = {
    aiQuery: '10 per minute',
    api: '30 per minute',
    auth: '5 per minute',
    newsletter: '3 per hour',
    general: '60 per minute',
    admin: '20 per minute',
    strava: '10 per minute'
  };
  
  return limits[type] || 'Unknown';
}

/**
 * Check if request is from admin/owner (bypass some limits)
 */
export function isAdminRequest(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET || 'default-secret';
  const authHeader = request.headers.get('authorization');
  
  // Check if it's a legitimate cron job
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }
  
  // Additional admin checks could be added here
  // (e.g., checking session tokens, API keys, etc.)
  
  return false;
}

/**
 * Analytics for rate limiting (store statistics)
 */
export async function logRateLimitEvent(
  result: RateLimitResult,
  request: NextRequest,
  endpoint: string
): Promise<void> {
  try {
    // This could be expanded to store in analytics database
    if (!result.success) {
      console.warn('Rate limit exceeded', {
        type: result.type,
        identifier: result.identifier,
        endpoint,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      });
      
      // Could also send to error monitoring system
      // await logError('Rate limit exceeded', { ... })
    }
  } catch (error) {
    console.error('Failed to log rate limit event:', error);
  }
}