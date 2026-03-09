import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '../../../lib/services/sync';
import {
  handleSyncGetAction,
  handleSyncPostAction,
} from '@/modules/sync/application/sync-controller';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { searchParams } = new URL(request.url);
    const response = await handleSyncGetAction(
      searchParams.get('action'),
      syncService
    );
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform sync operation',
        details: error instanceof Error ? error.message : 'Unknown error',
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
    const body = await request.json();
    const response = await handleSyncPostAction(body, syncService);
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('Sync POST API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process sync request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
