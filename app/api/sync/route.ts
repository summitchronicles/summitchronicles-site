import { NextRequest, NextResponse } from 'next/server';
import { syncService } from '../../../lib/services/sync';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          data: syncService.getStatus(),
        });

      case 'start':
        syncService.start();
        return NextResponse.json({
          success: true,
          message: 'Sync service started',
          data: syncService.getStatus(),
        });

      case 'stop':
        syncService.stop();
        return NextResponse.json({
          success: true,
          message: 'Sync service stopped',
          data: syncService.getStatus(),
        });

      case 'sync':
        const syncResult = await syncService.performSync();
        return NextResponse.json({
          success: syncResult.success,
          data: syncResult,
          message: syncResult.success
            ? 'Manual sync completed'
            : 'Manual sync completed with errors',
        });

      default:
        return NextResponse.json({
          success: true,
          data: syncService.getStatus(),
          message: 'Sync service status',
        });
    }
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
  try {
    const body = await request.json();
    const { action, config } = body;

    switch (action) {
      case 'configure':
        // In a real app, you'd want to update the service configuration
        return NextResponse.json({
          success: true,
          message: 'Sync service configuration updated',
          data: { config },
        });

      case 'manual-sync':
        const syncResult = await syncService.performSync();
        return NextResponse.json({
          success: syncResult.success,
          data: syncResult,
          message: syncResult.success
            ? 'Manual sync completed'
            : 'Manual sync completed with errors',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }
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
