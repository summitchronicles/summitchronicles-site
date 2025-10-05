import { RateLimiterMemory } from 'rate-limiter-flexible';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

// Rate limiting configurations
const rateLimiters = {
  // Per IP address
  perIP: new RateLimiterMemory({
    keyPrefix: 'ai_limit_ip',
    points: 50, // 50 requests
    duration: 3600, // per hour
    blockDuration: 3600, // block for 1 hour if exceeded
  }),

  // Per user session (stricter for ask AI)
  askAI: new RateLimiterMemory({
    keyPrefix: 'ai_limit_ask',
    points: 10, // 10 AI questions
    duration: 3600, // per hour
    blockDuration: 1800, // block for 30 minutes if exceeded
  }),

  // Per Excel upload (prevent spam uploads)
  excelUpload: new RateLimiterMemory({
    keyPrefix: 'ai_limit_excel',
    points: 5, // 5 uploads
    duration: 3600, // per hour
    blockDuration: 7200, // block for 2 hours if exceeded
  }),

  // Training insights generation
  trainingInsights: new RateLimiterMemory({
    keyPrefix: 'ai_limit_insights',
    points: 20, // 20 insight generations
    duration: 3600, // per hour
    blockDuration: 1800, // block for 30 minutes if exceeded
  }),
};

// Abuse detection patterns
const ABUSE_PATTERNS = {
  spam: [
    /(.)\1{10,}/, // Repeated characters
    /\b(buy|sell|crypto|bitcoin|investment|offer|deal|money|cash|cheap|free|click|visit|www\.|http)\b/gi,
    /[!@#$%^&*]{5,}/, // Excessive symbols
  ],
  toxicity: [
    /\b(fuck|shit|damn|hell|bitch|asshole|idiot|stupid|hate|kill|die|murder)\b/gi,
    /[A-Z]{20,}/, // Excessive caps
  ],
  irrelevant: [
    /\b(cooking|recipes|cars|politics|sports|music|movies|games|shopping|fashion)\b/gi,
  ],
};

// Content filtering interface
export interface ContentFilter {
  isSpam: boolean;
  isToxic: boolean;
  isIrrelevant: boolean;
  sentimentScore: number;
  confidence: number;
  flags: string[];
}

// Rate limiting result
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  blockReason?: string;
}

// IP tracking for suspicious behavior
const suspiciousIPs = new Map<string, {
  violations: number;
  firstViolation: Date;
  lastViolation: Date;
  blocked: boolean;
}>();

/**
 * Check rate limits for different AI operations
 */
export async function checkRateLimit(
  identifier: string,
  operation: 'perIP' | 'askAI' | 'excelUpload' | 'trainingInsights'
): Promise<RateLimitResult> {
  const limiter = rateLimiters[operation];

  try {
    const result = await limiter.consume(identifier);

    return {
      allowed: true,
      remaining: result.remainingPoints,
      resetTime: new Date(Date.now() + result.msBeforeNext),
    };
  } catch (rejRes: any) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(Date.now() + rejRes.msBeforeNext),
      blockReason: `Rate limit exceeded for ${operation}. Try again later.`,
    };
  }
}

/**
 * Filter and analyze content for abuse
 */
export function filterContent(content: string): ContentFilter {
  const flags: string[] = [];
  let isSpam = false;
  let isToxic = false;
  let isIrrelevant = false;

  // Spam detection
  for (const pattern of ABUSE_PATTERNS.spam) {
    if (pattern.test(content)) {
      isSpam = true;
      flags.push('spam');
      break;
    }
  }

  // Toxicity detection
  for (const pattern of ABUSE_PATTERNS.toxicity) {
    if (pattern.test(content)) {
      isToxic = true;
      flags.push('toxicity');
      break;
    }
  }

  // Relevance detection (mountaineering/training context)
  if (!isMountaineeringRelated(content)) {
    isIrrelevant = true;
    flags.push('irrelevant');
  }

  // Sentiment analysis
  const sentimentResult = sentiment.analyze(content);
  const sentimentScore = sentimentResult.score;

  // Calculate confidence based on content length and clarity
  const confidence = calculateConfidence(content, flags.length);

  return {
    isSpam,
    isToxic,
    isIrrelevant,
    sentimentScore,
    confidence,
    flags,
  };
}

/**
 * Check if content is mountaineering/training related
 */
function isMountaineeringRelated(content: string): boolean {
  const mountaineeringKeywords = [
    'mountain', 'climbing', 'expedition', 'summit', 'training', 'workout',
    'altitude', 'hiking', 'trekking', 'fitness', 'exercise', 'preparation',
    'gear', 'equipment', 'route', 'ascent', 'descent', 'rope', 'harness',
    'crampon', 'ice', 'snow', 'weather', 'acclimatization', 'endurance',
    'strength', 'cardio', 'everest', 'kilimanjaro', 'denali', 'aconcagua',
    'elbrus', 'vinson', 'carstensz', 'seven summits', 'alpine', 'rock',
    'bouldering', 'belay', 'anchor', 'pitch', 'lead', 'follow', 'rappel',
    'abseil', 'camp', 'base camp', 'high camp', 'sherpa', 'guide',
  ];

  const irrelevantKeywords = ABUSE_PATTERNS.irrelevant[0];

  // Check for mountaineering keywords
  const hasRelevantKeywords = mountaineeringKeywords.some(keyword =>
    content.toLowerCase().includes(keyword)
  );

  // Check for irrelevant keywords
  const hasIrrelevantKeywords = irrelevantKeywords.test(content);

  // Content is relevant if it has mountaineering keywords and no irrelevant ones
  // OR if it's a general question that could apply to training
  return hasRelevantKeywords || (!hasIrrelevantKeywords && content.length > 10);
}

/**
 * Calculate confidence score for content filtering
 */
function calculateConfidence(content: string, flagCount: number): number {
  let confidence = 0.5; // Base confidence

  // Length factor
  if (content.length > 50) confidence += 0.2;
  if (content.length > 200) confidence += 0.1;

  // Clear structure (questions, sentences)
  if (content.includes('?')) confidence += 0.1;
  if (content.split('.').length > 1) confidence += 0.1;

  // Flag penalty
  confidence -= flagCount * 0.15;

  // Ensure 0-1 range
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Track suspicious IP behavior
 */
export function trackSuspiciousIP(ip: string, violationType: string): boolean {
  const now = new Date();
  const existing = suspiciousIPs.get(ip);

  if (existing) {
    existing.violations += 1;
    existing.lastViolation = now;

    // Block if too many violations in short time
    if (existing.violations >= 5 &&
        (now.getTime() - existing.firstViolation.getTime()) < 24 * 60 * 60 * 1000) {
      existing.blocked = true;
      return true; // IP should be blocked
    }
  } else {
    suspiciousIPs.set(ip, {
      violations: 1,
      firstViolation: now,
      lastViolation: now,
      blocked: false,
    });
  }

  return false;
}

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip: string): boolean {
  const record = suspiciousIPs.get(ip);
  if (!record) return false;

  // Unblock after 24 hours
  if (record.blocked &&
      (Date.now() - record.lastViolation.getTime()) > 24 * 60 * 60 * 1000) {
    record.blocked = false;
    record.violations = 0;
  }

  return record.blocked;
}

/**
 * Comprehensive abuse check for AI requests
 */
export async function checkAIAbuse(
  ip: string,
  content: string,
  operation: 'askAI' | 'excelUpload' | 'trainingInsights'
): Promise<{
  allowed: boolean;
  reason?: string;
  contentFilter?: ContentFilter;
  rateLimit?: RateLimitResult;
}> {
  // Check if IP is blocked
  if (isIPBlocked(ip)) {
    return {
      allowed: false,
      reason: 'IP address is temporarily blocked due to suspicious activity',
    };
  }

  // Check rate limits
  const ipRateLimit = await checkRateLimit(ip, 'perIP');
  const operationRateLimit = await checkRateLimit(ip, operation);

  if (!ipRateLimit.allowed) {
    trackSuspiciousIP(ip, 'rate_limit_ip');
    return {
      allowed: false,
      reason: ipRateLimit.blockReason,
      rateLimit: ipRateLimit,
    };
  }

  if (!operationRateLimit.allowed) {
    trackSuspiciousIP(ip, `rate_limit_${operation}`);
    return {
      allowed: false,
      reason: operationRateLimit.blockReason,
      rateLimit: operationRateLimit,
    };
  }

  // Filter content
  const contentFilter = filterContent(content);

  // Block if content is problematic
  if (contentFilter.isSpam || contentFilter.isToxic) {
    trackSuspiciousIP(ip, contentFilter.isSpam ? 'spam' : 'toxicity');
    return {
      allowed: false,
      reason: `Content filtered: ${contentFilter.flags.join(', ')}`,
      contentFilter,
    };
  }

  // Warn about irrelevant content but allow (for now)
  if (contentFilter.isIrrelevant && operation === 'askAI') {
    return {
      allowed: true,
      contentFilter,
      rateLimit: operationRateLimit,
    };
  }

  return {
    allowed: true,
    contentFilter,
    rateLimit: operationRateLimit,
  };
}

/**
 * Get abuse prevention statistics
 */
export function getAbuseStats(): {
  blockedIPs: number;
  totalViolations: number;
  recentViolations: number;
} {
  const now = new Date();
  const oneDayAgo = now.getTime() - 24 * 60 * 60 * 1000;

  let blockedIPs = 0;
  let totalViolations = 0;
  let recentViolations = 0;

  for (const [ip, record] of suspiciousIPs.entries()) {
    if (record.blocked) blockedIPs++;
    totalViolations += record.violations;
    if (record.lastViolation.getTime() > oneDayAgo) {
      recentViolations += record.violations;
    }
  }

  return {
    blockedIPs,
    totalViolations,
    recentViolations,
  };
}

/**
 * Reset rate limits (admin function)
 */
export async function resetRateLimits(identifier?: string): Promise<void> {
  if (identifier) {
    // Reset specific identifier
    for (const limiter of Object.values(rateLimiters)) {
      await limiter.delete(identifier);
    }
  } else {
    // Reset all (use with caution)
    for (const limiter of Object.values(rateLimiters)) {
      // Note: rate-limiter-flexible doesn't have a clear all method
      // This would need to be implemented with a proper database backend
    }
  }
}

/**
 * Middleware wrapper for Next.js API routes
 */
export function withAbuseProtection(
  operation: 'askAI' | 'excelUpload' | 'trainingInsights'
) {
  return function(handler: Function) {
    return async function(req: any, res: any) {
      const ip = req.headers['x-forwarded-for'] ||
                 req.headers['x-real-ip'] ||
                 req.connection.remoteAddress ||
                 '127.0.0.1';

      const content = req.body?.question ||
                     req.body?.content ||
                     req.body?.query ||
                     '';

      const abuseCheck = await checkAIAbuse(ip, content, operation);

      if (!abuseCheck.allowed) {
        return res.status(429).json({
          error: abuseCheck.reason,
          retryAfter: abuseCheck.rateLimit?.resetTime,
        });
      }

      // Add abuse check results to request for logging
      req.abuseCheck = abuseCheck;

      return handler(req, res);
    };
  };
}