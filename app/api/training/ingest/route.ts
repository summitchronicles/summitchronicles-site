import { NextRequest, NextResponse } from 'next/server';
import { ingestTrainingArtifacts } from '@/modules/training/application/training-artifact-service';
import { requireTrainingIngestAccess } from '@/shared/security/training-ingest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const unauthorized = requireTrainingIngestAccess(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const result = await ingestTrainingArtifacts();

    return NextResponse.json({
      success: result.dashboard.success,
      status: result.status.state,
      source: result.status.source,
      lastUpdated: result.status.lastSuccessAt ?? result.status.lastAttemptAt,
      latestActivityAt: result.status.latestActivityAt,
      activities: result.snapshot.activitiesRaw.length,
      wellnessSamples: result.snapshot.wellnessData.length,
      missionLogs: result.dashboard.summary.missionLogs.length,
      errors: result.status.errors,
      backend: result.backend,
      wroteSummary: result.wroteSummary,
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
