import { NextRequest, NextResponse } from 'next/server';
import {
  createMonitoringHealthResponse,
  handleMonitoringIngestion,
} from '@/modules/monitoring/application/monitoring-controller';
import { InMemoryWindowRateLimiter } from '@/modules/monitoring/infrastructure/in-memory-rate-limiter';
import { productionMonitoringSinks } from '@/modules/monitoring/infrastructure/monitoring-sinks';
import { getAllowedOrigins, getServerEnv } from '@/shared/env/server';
import { hasInternalApiAccess } from '@/shared/security/internal-api';

export const dynamic = 'force-dynamic';

const monitoringRateLimiter = new InMemoryWindowRateLimiter({
  limit: 100,
  windowMs: 60_000,
});

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') ?? 'unknown';
}

function parseContentLength(contentLength: string | null): number | null {
  if (!contentLength) {
    return null;
  }

  const parsed = Number(contentLength);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(request: NextRequest) {
  const env = getServerEnv();

  try {
    const body = await request.json();
    const response = await handleMonitoringIngestion(body, {
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      contentType: request.headers.get('content-type'),
      contentLength: parseContentLength(request.headers.get('content-length')),
      origin: request.headers.get('origin'),
      allowedOrigins: getAllowedOrigins(env),
      rateLimiter: monitoringRateLimiter,
      sinks: env.NODE_ENV === 'production' ? productionMonitoringSinks : [],
      isInternal: hasInternalApiAccess(request, env),
    });

    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    console.error('Error processing monitoring data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const env = getServerEnv();
  const response = createMonitoringHealthResponse({
    isInternal: hasInternalApiAccess(request, env),
    nodeEnv: env.NODE_ENV,
    buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION ?? 'unknown',
    uptimeSeconds: process.uptime(),
    memoryUsage: process.memoryUsage(),
    rateLimitStoreSize: monitoringRateLimiter.size(),
  });

  return NextResponse.json(response.body, { status: response.status });
}
