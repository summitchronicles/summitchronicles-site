import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, RateLimitType, isAdminRequest } from './rate-limit';
import { logError, logInfo } from './error-monitor';

export interface APIProtectionConfig {
  rateLimitType?: RateLimitType;
  requireAuth?: boolean;
  adminOnly?: boolean;
  skipRateLimitForAdmin?: boolean;
  corsEnabled?: boolean;
  allowedOrigins?: string[];
  maxRequestSize?: number; // in bytes
  validateContentType?: string[];
}

export interface ProtectedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'owner' | 'user';
  };
  rateLimit?: {
    remaining: number;
    reset: Date;
  };
}

/**
 * Comprehensive API protection middleware
 */
export function withAPIProtection(
  config: APIProtectionConfig = {}
) {
  return function (handler: (request: ProtectedRequest) => Promise<Response>) {
    return async function (request: NextRequest): Promise<Response> {
      const startTime = Date.now();
      const endpoint = new URL(request.url).pathname;
      
      try {
        // 1. CORS Protection
        if (config.corsEnabled) {
          const corsResponse = await handleCORS(request, config.allowedOrigins);
          if (corsResponse) return corsResponse;
        }

        // 2. Request Size Validation
        if (config.maxRequestSize) {
          const contentLength = request.headers.get('content-length');
          if (contentLength && parseInt(contentLength) > config.maxRequestSize) {
            await logError('Request too large', {
              endpoint,
              size: contentLength,
              maxAllowed: config.maxRequestSize
            });
            
            return NextResponse.json(
              { error: 'Request entity too large' },
              { status: 413 }
            );
          }
        }

        // 3. Content Type Validation
        if (config.validateContentType && request.method !== 'GET') {
          const contentType = request.headers.get('content-type');
          const isValidContentType = config.validateContentType.some(type => 
            contentType?.includes(type)
          );
          
          if (!isValidContentType) {
            await logError('Invalid content type', {
              endpoint,
              contentType,
              expected: config.validateContentType
            });
            
            return NextResponse.json(
              { error: 'Unsupported content type' },
              { status: 415 }
            );
          }
        }

        // 4. Rate Limiting
        let rateLimitResult;
        const skipRateLimit = config.skipRateLimitForAdmin && isAdminRequest(request);
        
        if (config.rateLimitType && !skipRateLimit) {
          rateLimitResult = await checkRateLimit(request, config.rateLimitType);
          
          if (!rateLimitResult.success) {
            const resetTime = Math.round(rateLimitResult.reset.getTime() / 1000);
            
            await logInfo('Rate limit exceeded', {
              endpoint,
              type: config.rateLimitType,
              identifier: rateLimitResult.identifier
            });
            
            return NextResponse.json(
              {
                error: 'Rate limit exceeded',
                message: `Too many requests. Please wait until ${rateLimitResult.reset.toLocaleTimeString()}`,
                reset: resetTime,
                remaining: 0
              },
              {
                status: 429,
                headers: {
                  'X-RateLimit-Limit': getRateLimitString(config.rateLimitType),
                  'X-RateLimit-Remaining': '0',
                  'X-RateLimit-Reset': resetTime.toString(),
                  'Retry-After': Math.round((rateLimitResult.reset.getTime() - Date.now()) / 1000).toString(),
                },
              }
            );
          }
        }

        // 5. Authentication Check (if required)
        let user;
        if (config.requireAuth || config.adminOnly) {
          user = await authenticateRequest(request);
          
          if (!user) {
            await logError('Authentication required', { endpoint });
            return NextResponse.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }
          
          if (config.adminOnly && !['admin', 'owner'].includes(user.role)) {
            await logError('Admin access required', { 
              endpoint, 
              userRole: user.role 
            });
            return NextResponse.json(
              { error: 'Insufficient permissions' },
              { status: 403 }
            );
          }
        }

        // 6. Create protected request object
        const protectedRequest = request as ProtectedRequest;
        if (user) protectedRequest.user = user;
        if (rateLimitResult) {
          protectedRequest.rateLimit = {
            remaining: rateLimitResult.remaining,
            reset: rateLimitResult.reset
          };
        }

        // 7. Execute handler
        const response = await handler(protectedRequest);

        // 8. Add security headers to response
        addSecurityHeaders(response, rateLimitResult, config.rateLimitType);

        // 9. Log successful request
        const duration = Date.now() - startTime;
        await logInfo('API request completed', {
          endpoint,
          duration,
          statusCode: response.status,
          rateLimitRemaining: rateLimitResult?.remaining
        });

        return response;

      } catch (error: any) {
        const duration = Date.now() - startTime;
        
        await logError('API protection error', {
          endpoint,
          error: error.message,
          duration,
          stack: error.stack
        });

        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      }
    };
  };
}

/**
 * Handle CORS preflight and validation
 */
async function handleCORS(
  request: NextRequest, 
  allowedOrigins?: string[]
): Promise<Response | null> {
  const origin = request.headers.get('origin');
  const method = request.method;

  // Handle preflight requests
  if (method === 'OPTIONS') {
    const response = new Response(null, { status: 200 });
    
    if (allowedOrigins && origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }

  return null;
}

/**
 * Authenticate request and extract user info
 */
async function authenticateRequest(request: NextRequest): Promise<any | null> {
  try {
    // Check for admin/cron authentication
    if (isAdminRequest(request)) {
      return {
        id: 'system',
        email: 'system@summitchronicles.com',
        role: 'admin'
      };
    }

    // Check for NextAuth session (would need to be implemented)
    // This is a simplified version - in practice, you'd validate JWT tokens
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      // Validate JWT token here
      // Return user info if valid
    }

    // Check for API key authentication
    const apiKey = request.headers.get('x-api-key');
    if (apiKey) {
      // Validate API key and return associated user
    }

    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(
  response: Response, 
  rateLimitResult?: any, 
  rateLimitType?: RateLimitType
): void {
  // Rate limit headers
  if (rateLimitResult && rateLimitType) {
    const resetTime = Math.round(rateLimitResult.reset.getTime() / 1000);
    response.headers.set('X-RateLimit-Limit', getRateLimitString(rateLimitType));
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetTime.toString());
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // API-specific headers
  response.headers.set('X-API-Version', '1.0');
  response.headers.set('X-Response-Time', Date.now().toString());
}

/**
 * Get rate limit description string
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
 * Input validation and sanitization utilities
 */
export class InputValidator {
  static sanitizeString(input: string, maxLength: number = 1000): string {
    return input.trim().slice(0, maxLength);
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static sanitizeObject(obj: any, allowedKeys: string[]): any {
    const sanitized: any = {};
    for (const key of allowedKeys) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  }

  static validateQuestionInput(question: string): { valid: boolean; error?: string } {
    if (!question || typeof question !== 'string') {
      return { valid: false, error: 'Question must be a string' };
    }

    if (question.length < 3) {
      return { valid: false, error: 'Question must be at least 3 characters long' };
    }

    if (question.length > 500) {
      return { valid: false, error: 'Question must be less than 500 characters' };
    }

    // Check for potential spam patterns
    const spamPatterns = [
      /(.)\1{10,}/, // Repeated characters
      /https?:\/\/[^\s]+/gi, // URLs (might be spam)
      /<script|javascript:/i, // XSS attempts
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(question)) {
        return { valid: false, error: 'Question contains invalid content' };
      }
    }

    return { valid: true };
  }
}

/**
 * Pre-configured protection for common endpoint types
 */
export const protectionPresets = {
  aiEndpoint: withAPIProtection({
    rateLimitType: 'aiQuery',
    corsEnabled: true,
    maxRequestSize: 10000, // 10KB
    validateContentType: ['application/json'],
    skipRateLimitForAdmin: true
  }),

  apiEndpoint: withAPIProtection({
    rateLimitType: 'api',
    corsEnabled: true,
    maxRequestSize: 50000, // 50KB
    validateContentType: ['application/json']
  }),

  adminEndpoint: withAPIProtection({
    rateLimitType: 'admin',
    requireAuth: true,
    adminOnly: true,
    corsEnabled: false,
    maxRequestSize: 100000 // 100KB
  }),

  authEndpoint: withAPIProtection({
    rateLimitType: 'auth',
    corsEnabled: true,
    maxRequestSize: 5000, // 5KB
    validateContentType: ['application/json']
  }),

  publicEndpoint: withAPIProtection({
    rateLimitType: 'general',
    corsEnabled: true,
    maxRequestSize: 25000 // 25KB
  })
};