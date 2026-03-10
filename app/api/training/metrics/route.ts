import { NextRequest, NextResponse } from 'next/server';
import { getPersistedTrainingMetricsResponse } from '@/modules/training/application/training-artifact-service';
import { getFallbackTrainingMetrics } from '@/modules/training/domain/training-metrics';
import {
  checkRateLimit,
  getClientIp,
  createRateLimitResponse,
} from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const isAllowed = await checkRateLimit(clientIp);

  if (!isAllowed) {
    return createRateLimitResponse();
  }

  try {
    const response = await getPersistedTrainingMetricsResponse();
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching Intervals metrics:', error);

    return NextResponse.json(
      {
        success: false,
        degraded: true,
        metrics: getFallbackTrainingMetrics(),
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
        errors: [error instanceof Error ? error.message : String(error)],
      },
      { status: 500 }
    );
  }
}
