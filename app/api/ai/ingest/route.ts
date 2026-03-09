import { NextRequest, NextResponse } from 'next/server';
import {
  getAiIngestOverviewResponse,
  handleAiIngestResponse,
} from '@/modules/ai/application/ai-operations-controller';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { searchParams } = new URL(request.url);
    const response = await handleAiIngestResponse(searchParams.get('action'));
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('Content ingestion API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform content ingestion',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const response = getAiIngestOverviewResponse();
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('AI system status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get AI system status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
