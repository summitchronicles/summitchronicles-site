import { NextRequest, NextResponse } from 'next/server';
import {
  getAiSystemStatusResponse,
  handleAiStatusActionResponse,
} from '@/modules/ai/application/ai-operations-controller';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const response = await getAiSystemStatusResponse();
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('AI Status API error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to check AI system status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const payload = await request.json();
    const response = await handleAiStatusActionResponse(payload);
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('AI Status API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform requested action' },
      { status: 500 }
    );
  }
}
