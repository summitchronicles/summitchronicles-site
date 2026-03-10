import { NextRequest, NextResponse } from 'next/server';
import { getPersistedTrainingDashboardResponse } from '@/modules/training/application/training-artifact-service';
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIp,
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
    const response = await getPersistedTrainingDashboardResponse();
    return NextResponse.json(response);
  } catch (error) {
    console.error('Training summary error:', error);

    return NextResponse.json(
      {
        success: false,
        degraded: true,
        error: 'Failed to build training summary',
      },
      { status: 500 }
    );
  }
}
