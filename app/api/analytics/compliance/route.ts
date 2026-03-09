import { NextRequest, NextResponse } from 'next/server';
import {
  createComplianceAnalyticsGetResponse,
  createComplianceAnalyticsPostResponse,
} from '@/modules/analytics/application/compliance-analytics';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const response = createComplianceAnalyticsGetResponse({
      timeframe: searchParams.get('timeframe'),
      includeAlerts: searchParams.get('alerts') === 'true',
      includeTrends: searchParams.get('trends') === 'true',
    });

    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('Compliance analytics error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate compliance analytics',
        code: 'ANALYTICS_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = createComplianceAnalyticsPostResponse(body);
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON body',
          code: 'INVALID_JSON',
        },
        { status: 400 }
      );
    }

    console.error('Compliance analytics POST error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process compliance analysis request',
        code: 'PROCESSING_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
