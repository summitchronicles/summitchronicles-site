import { NextRequest, NextResponse } from 'next/server';
import { requireInternalApiAccess } from '@/shared/security/internal-api';
import { intervalsClient } from '@/modules/training/infrastructure/intervals-client';
import { loadTrainingSourceSnapshot } from '@/modules/training/application/training-snapshot-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const unauthorized = requireInternalApiAccess(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const snapshot = await loadTrainingSourceSnapshot(intervalsClient, {
      forceRefresh: true,
    });

    return NextResponse.json({
      success: snapshot.source === 'intervals.icu',
      status: snapshot.status,
      source: snapshot.source,
      lastUpdated: snapshot.lastUpdated,
      activities: snapshot.activitiesRaw.length,
      wellnessSamples: snapshot.wellnessData.length,
      missionLogs: snapshot.missionLogs.length,
      errors: snapshot.errors,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to ingest Intervals data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

