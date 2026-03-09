import { NextRequest, NextResponse } from 'next/server';
import { getTrainingMetricsResponse } from '@/modules/training/application/get-training-metrics';
import { getFallbackTrainingMetrics } from '@/modules/training/domain/training-metrics';
import {
  checkRateLimit,
  getClientIp,
  createRateLimitResponse,
} from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const isAllowed = await checkRateLimit(clientIp);

  if (!isAllowed) {
    return createRateLimitResponse();
  }

  try {
    const response = await getTrainingMetricsResponse();
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
