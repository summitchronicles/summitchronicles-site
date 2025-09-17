import { NextRequest, NextResponse } from 'next/server';

interface ErrorReport {
  id: string;
  type: 'javascript' | 'network' | 'performance' | 'security' | 'user';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context: {
    userId?: string;
    sessionId: string;
    url: string;
    userAgent: string;
    timestamp: string;
    buildVersion?: string;
    environment: 'development' | 'production' | 'staging';
  };
  metadata?: Record<string, any>;
  fingerprint: string;
}

interface PerformanceIssue {
  id: string;
  type: 'slow_load' | 'memory_leak' | 'large_bundle' | 'poor_lcp' | 'high_cls';
  metric: string;
  value: number;
  threshold: number;
  context: ErrorReport['context'];
}

interface MonitoringPayload {
  errors: ErrorReport[];
  performanceIssues: PerformanceIssue[];
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string): string {
  return `rate_limit:${ip}`;
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return false;
  }

  if (limit.count >= 100) {
    // 100 requests per minute
    return true;
  }

  limit.count++;
  return false;
}

function validateErrorReport(error: any): error is ErrorReport {
  return (
    typeof error === 'object' &&
    typeof error.id === 'string' &&
    typeof error.type === 'string' &&
    typeof error.severity === 'string' &&
    typeof error.message === 'string' &&
    typeof error.context === 'object' &&
    typeof error.fingerprint === 'string'
  );
}

function validatePerformanceIssue(issue: any): issue is PerformanceIssue {
  return (
    typeof issue === 'object' &&
    typeof issue.id === 'string' &&
    typeof issue.type === 'string' &&
    typeof issue.metric === 'string' &&
    typeof issue.value === 'number' &&
    typeof issue.threshold === 'number' &&
    typeof issue.context === 'object'
  );
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body: MonitoringPayload = await request.json();

    if (!body.errors || !Array.isArray(body.errors)) {
      return NextResponse.json(
        { error: 'Invalid payload: errors array required' },
        { status: 400 }
      );
    }

    if (!body.performanceIssues || !Array.isArray(body.performanceIssues)) {
      body.performanceIssues = [];
    }

    // Validate error reports
    const validErrors = body.errors.filter(validateErrorReport);
    const validPerformanceIssues = body.performanceIssues.filter(
      validatePerformanceIssue
    );

    if (validErrors.length === 0 && validPerformanceIssues.length === 0) {
      return NextResponse.json(
        { error: 'No valid errors or performance issues provided' },
        { status: 400 }
      );
    }

    // Process errors
    const processedData = {
      timestamp: new Date().toISOString(),
      clientIP: ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      errors: validErrors,
      performanceIssues: validPerformanceIssues,
      metadata: {
        totalErrors: validErrors.length,
        totalPerformanceIssues: validPerformanceIssues.length,
        errorTypes: [...new Set(validErrors.map((e) => e.type))],
        severityDistribution: validErrors.reduce(
          (acc, error) => {
            acc[error.severity] = (acc[error.severity] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      },
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Error monitoring data received:', processedData);
    }

    // In production, you would:
    // 1. Store in database
    // 2. Send to external monitoring service (Sentry, LogRocket, etc.)
    // 3. Trigger alerts for critical errors
    // 4. Update metrics dashboards

    if (process.env.NODE_ENV === 'production') {
      // Example: Send to external monitoring service
      await Promise.allSettled([
        sendToSentry(processedData),
        sendToAnalytics(processedData),
        checkForAlerts(processedData),
      ]);
    }

    return NextResponse.json({
      success: true,
      processed: {
        errors: validErrors.length,
        performanceIssues: validPerformanceIssues.length,
      },
    });
  } catch (error) {
    console.error('Error processing monitoring data:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Mock functions for external services (implement with real services)
async function sendToSentry(data: any): Promise<void> {
  // Example Sentry integration
  // const Sentry = require('@sentry/node')
  // data.errors.forEach(error => {
  //   Sentry.captureException(new Error(error.message), {
  //     extra: error.context,
  //     tags: {
  //       type: error.type,
  //       severity: error.severity,
  //       fingerprint: error.fingerprint
  //     }
  //   })
  // })

  console.log('Would send to Sentry:', data.errors.length, 'errors');
}

async function sendToAnalytics(data: any): Promise<void> {
  // Example Google Analytics integration
  // const { v4: uuidv4 } = require('uuid')
  // const fetch = require('node-fetch')

  // const payload = {
  //   client_id: uuidv4(),
  //   events: data.errors.map(error => ({
  //     name: 'error_report',
  //     params: {
  //       error_type: error.type,
  //       error_severity: error.severity,
  //       error_message: error.message.substring(0, 100)
  //     }
  //   }))
  // }

  // await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
  //   method: 'POST',
  //   body: JSON.stringify(payload)
  // })

  console.log('Would send to Analytics:', data.errors.length, 'errors');
}

async function checkForAlerts(data: any): Promise<void> {
  const criticalErrors = data.errors.filter(
    (error: ErrorReport) => error.severity === 'critical'
  );
  const highSeverityErrors = data.errors.filter(
    (error: ErrorReport) => error.severity === 'high'
  );

  if (criticalErrors.length > 0) {
    // Send immediate alert
    console.warn('🚨 CRITICAL ERRORS DETECTED:', criticalErrors.length);
    // await sendSlackAlert(`Critical errors detected: ${criticalErrors.length}`)
    // await sendEmailAlert(criticalErrors)
  }

  if (highSeverityErrors.length > 5) {
    // Send high volume alert
    console.warn('⚠️  HIGH ERROR VOLUME:', highSeverityErrors.length);
    // await sendSlackAlert(`High error volume: ${highSeverityErrors.length} high severity errors`)
  }

  const memoryLeaks = data.performanceIssues.filter(
    (issue: PerformanceIssue) => issue.type === 'memory_leak'
  );
  if (memoryLeaks.length > 0) {
    console.warn('🧠 MEMORY LEAKS DETECTED:', memoryLeaks.length);
    // await sendSlackAlert(`Memory leaks detected: ${memoryLeaks.length}`)
  }
}

// Health check endpoint
export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown',
    environment: process.env.NODE_ENV || 'unknown',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    rateLimitStore: {
      size: rateLimitStore.size,
      entries: rateLimitStore.size,
    },
  };

  return NextResponse.json(healthData);
}
