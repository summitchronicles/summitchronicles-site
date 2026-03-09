import { NextRequest, NextResponse } from 'next/server';
import {
  createComprehensiveAnalyticsResponse,
  createComprehensiveAnalyticsSampleResponse,
} from '@/modules/analytics/application/comprehensive-analytics';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = createComprehensiveAnalyticsResponse(body);
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON body',
        },
        { status: 400 }
      );
    }

    console.error('Comprehensive analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate comprehensive analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const response = createComprehensiveAnalyticsSampleResponse();
  return NextResponse.json(response.body, { status: response.status });
}
