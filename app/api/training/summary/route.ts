import { NextRequest, NextResponse } from 'next/server';
import { getTrainingDashboardResponse } from '@/modules/training/application/get-training-dashboard';
import {
  checkRateLimit,
  createRateLimitResponse,
  getClientIp,
} from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const isAllowed = await checkRateLimit(clientIp);

  if (!isAllowed) {
    return createRateLimitResponse();
  }

  try {
    const response = await getTrainingDashboardResponse();
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

