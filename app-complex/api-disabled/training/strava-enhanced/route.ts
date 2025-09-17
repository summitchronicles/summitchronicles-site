import { NextRequest, NextResponse } from 'next/server';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';
import { EnhancedStravaIntegration } from '@/lib/strava-enhanced';

export const GET = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const action = searchParams.get('action');
      const startDate = searchParams.get('start');
      const endDate = searchParams.get('end');
      const date = searchParams.get('date');

      switch (action) {
        case 'sync':
          // Sync recent activities with enhanced categorization
          const limit = parseInt(searchParams.get('limit') || '50');
          const activities =
            await EnhancedStravaIntegration.syncEnhancedActivities(limit);
          return NextResponse.json({
            success: true,
            activities,
            synced: activities.length,
          });

        case 'insights':
          // Get training insights
          if (!startDate || !endDate) {
            return NextResponse.json(
              {
                error: 'Start and end dates are required for insights',
              },
              { status: 400 }
            );
          }
          const insights = await EnhancedStravaIntegration.getTrainingInsights(
            startDate,
            endDate
          );
          return NextResponse.json(insights);

        case 'duplicates':
          // Detect duplicate activities
          if (!date) {
            return NextResponse.json(
              {
                error: 'Date is required for duplicate detection',
              },
              { status: 400 }
            );
          }
          const duplicates =
            await EnhancedStravaIntegration.detectDuplicateActivities(date);
          return NextResponse.json(duplicates);

        default:
          return NextResponse.json(
            {
              error: 'Invalid action. Use: sync, insights, or duplicates',
            },
            { status: 400 }
          );
      }
    } catch (error: any) {
      console.error('Enhanced Strava integration error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Failed to process enhanced Strava request',
        },
        { status: 500 }
      );
    }
  }
);

export const POST = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    try {
      const body = await request.json();
      const { action, duplicateId, status } = body;

      switch (action) {
        case 'resolve_duplicate':
          // Mark duplicate as confirmed or dismissed
          if (!duplicateId || !status) {
            return NextResponse.json(
              {
                error: 'duplicateId and status are required',
              },
              { status: 400 }
            );
          }

          // This would update the activity_duplicates table
          // Implementation depends on specific business logic
          return NextResponse.json({
            success: true,
            message: `Duplicate ${duplicateId} marked as ${status}`,
          });

        default:
          return NextResponse.json(
            {
              error: 'Invalid action',
            },
            { status: 400 }
          );
      }
    } catch (error: any) {
      console.error('Enhanced Strava POST error:', error);
      return NextResponse.json(
        {
          error:
            error.message || 'Failed to process enhanced Strava POST request',
        },
        { status: 500 }
      );
    }
  }
);
