import { getServerEnv } from '@/shared/env/server';
import { intervalsClient } from '@/modules/training/infrastructure/intervals-client';
import { getTrainingDashboardResponse } from '@/modules/training/application/get-training-dashboard';
import { loadTrainingSourceSnapshot } from '@/modules/training/application/training-snapshot-service';
import type { TrainingMetricsResponse } from '@/modules/training/application/get-training-metrics';
import {
  calculateTrainingWorkoutStats,
  type TrainingDashboardResponse,
} from '@/modules/training/domain/training-dashboard';
import { getFallbackTrainingMetrics } from '@/modules/training/domain/training-metrics';
import type {
  TrainingSourceClient,
  TrainingSourceSnapshot,
} from '@/modules/training/application/training-snapshot-service';
import {
  getTrainingArtifactStore,
  type PersistedTrainingStatusArtifact,
  type PersistedTrainingSummaryArtifact,
  type TrainingArtifactStore,
} from '@/modules/training/infrastructure/training-snapshot-store';

interface TrainingArtifactDependencies {
  now?: Date;
  client?: TrainingSourceClient;
  store?: TrainingArtifactStore;
  manualVo2Max?: number;
  fallbackToLive?: boolean;
}

export interface TrainingIngestResult {
  snapshot: TrainingSourceSnapshot;
  dashboard: TrainingDashboardResponse;
  status: PersistedTrainingStatusArtifact;
  wroteSummary: boolean;
  backend: 'local' | 'r2';
}

export async function ingestTrainingArtifacts(
  dependencies: TrainingArtifactDependencies = {}
): Promise<TrainingIngestResult> {
  const now = dependencies.now ?? new Date();
  const store = dependencies.store ?? getTrainingArtifactStore();
  const snapshot = await loadTrainingSourceSnapshot(
    dependencies.client ?? intervalsClient,
    {
      store,
      now,
      forceRefresh: true,
    }
  );
  const dashboard = await getTrainingDashboardResponse({
    now,
    manualVo2Max: dependencies.manualVo2Max,
    loadSnapshot: async () => snapshot,
  });
  const status = buildTrainingStatusArtifact({
    snapshot,
    dashboard,
    backend: store.getBackend(),
    now,
  });
  const wroteSummary = shouldWriteSummaryArtifact(snapshot);

  if (wroteSummary) {
    await store.writeSummary(createSummaryArtifact(dashboard));
  }

  await store.writeStatus(status);

  return {
    snapshot,
    dashboard,
    status,
    wroteSummary,
    backend: store.getBackend(),
  };
}

export async function getPersistedTrainingDashboardResponse(
  dependencies: TrainingArtifactDependencies = {}
): Promise<TrainingDashboardResponse> {
  const now = dependencies.now ?? new Date();
  const store = dependencies.store ?? getTrainingArtifactStore();
  const [summaryArtifact, statusArtifact] = await Promise.all([
    store.readSummary(),
    store.readStatus(),
  ]);

  if (summaryArtifact) {
    return mergeSummaryWithStatus(summaryArtifact.response, statusArtifact);
  }

  const shouldFallbackToLive =
    dependencies.fallbackToLive ?? getServerEnv().NODE_ENV !== 'production';

  if (shouldFallbackToLive) {
    const ingested = await ingestTrainingArtifacts({
      ...dependencies,
      now,
      store,
    });

    return mergeSummaryWithStatus(ingested.dashboard, ingested.status);
  }

  return createUnavailableDashboardResponse(now, statusArtifact);
}

export async function getPersistedTrainingMetricsResponse(
  dependencies: TrainingArtifactDependencies = {}
): Promise<TrainingMetricsResponse> {
  const response = await getPersistedTrainingDashboardResponse(dependencies);

  return {
    success: response.success,
    degraded: response.degraded,
    metrics: response.summary.metrics,
    lastUpdated: response.lastUpdated,
    telemetryState: response.summary.telemetry.state,
    source: response.summary.telemetry.source,
    errors: response.errors,
  };
}

export function buildTrainingStatusArtifact({
  snapshot,
  dashboard,
  backend,
  now = new Date(),
}: {
  snapshot: TrainingSourceSnapshot;
  dashboard: TrainingDashboardResponse;
  backend: 'local' | 'r2';
  now?: Date;
}): PersistedTrainingStatusArtifact {
  const state = deriveStatusState(snapshot);
  const latestActivityAt =
    dashboard.summary.metrics.recentActivities[0]?.startTimeLocal ?? null;
  const lastSuccessAt =
    state === 'live' || state === 'degraded'
      ? dashboard.lastUpdated
      : snapshot.source === 'intervals.icu'
        ? snapshot.lastUpdated
        : null;

  return {
    version: 1,
    source: snapshot.source,
    state,
    lastAttemptAt: now.toISOString(),
    lastSuccessAt,
    latestActivityAt,
    lastError: snapshot.errors[0] ?? null,
    errors: snapshot.errors,
    backend,
  };
}

function shouldWriteSummaryArtifact(snapshot: TrainingSourceSnapshot) {
  return (
    snapshot.source === 'intervals.icu' &&
    snapshot.status !== 'cached' &&
    (snapshot.activitiesRaw.length > 0 || snapshot.wellnessData.length > 0)
  );
}

function createSummaryArtifact(
  response: TrainingDashboardResponse
): PersistedTrainingSummaryArtifact {
  return {
    version: 1,
    generatedAt: response.lastUpdated,
    response,
  };
}

function mergeSummaryWithStatus(
  response: TrainingDashboardResponse,
  status: PersistedTrainingStatusArtifact | null
): TrainingDashboardResponse {
  if (!status) {
    return response;
  }

  const telemetryState =
    status.state === 'live'
      ? 'live'
      : status.state === 'degraded'
        ? 'degraded'
        : 'cached';
  const errors = status.errors.length > 0 ? status.errors : response.errors;
  const lastUpdated = status.lastSuccessAt ?? response.lastUpdated;

  return {
    ...response,
    degraded: status.state !== 'live' || response.degraded,
    errors,
    lastUpdated,
    summary: {
      ...response.summary,
      telemetry: {
        ...response.summary.telemetry,
        isLive: status.state === 'live',
        state: telemetryState,
        lastUpdated,
        errors,
      },
    },
  };
}

function createUnavailableDashboardResponse(
  now: Date,
  status: PersistedTrainingStatusArtifact | null
): TrainingDashboardResponse {
  const errors =
    status?.errors.length && status.errors[0]
      ? status.errors
      : ['Training summary is not available yet. Run the ingest job first.'];
  const lastUpdated = status?.lastSuccessAt ?? now.toISOString();

  return {
    success: false,
    degraded: true,
    errors,
    lastUpdated,
    summary: {
      telemetry: {
        isLive: false,
        state: status?.state === 'degraded' ? 'degraded' : 'cached',
        source: status?.source ?? 'fallback',
        lastUpdated,
        errors,
      },
      metrics: getFallbackTrainingMetrics(),
      latestMissionLog: null,
      missionLogs: [],
      workoutStats: calculateTrainingWorkoutStats([]),
    },
  };
}

function deriveStatusState(
  snapshot: TrainingSourceSnapshot
): PersistedTrainingStatusArtifact['state'] {
  if (snapshot.errors.some(isAuthFailure)) {
    return 'auth_failed';
  }

  if (snapshot.status === 'cached') {
    return 'stale';
  }

  if (snapshot.status === 'degraded' || snapshot.errors.length > 0) {
    return 'degraded';
  }

  return 'live';
}

function isAuthFailure(error: string) {
  return /\b(401|403|unauthorized|access denied|forbidden)\b/i.test(error);
}
