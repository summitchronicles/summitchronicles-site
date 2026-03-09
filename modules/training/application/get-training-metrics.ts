import { getServerEnv } from '@/shared/env/server';
import { loadTrainingSourceSnapshot } from '@/modules/training/application/training-snapshot-service';
import { intervalsClient } from '@/modules/training/infrastructure/intervals-client';
import {
  calculateTrainingMetrics,
  createDerivedTrainingWellness,
  getFallbackTrainingMetrics,
  normalizeTrainingActivities,
  type TrainingMetricsPayload,
} from '@/modules/training/domain/training-metrics';
import type {
  TrainingSourceClient,
  TrainingSourceSnapshot,
} from '@/modules/training/application/training-snapshot-service';
import type { TrainingSnapshotStore } from '@/modules/training/infrastructure/training-snapshot-store';

export interface TrainingMetricsResponse {
  success: boolean;
  degraded: boolean;
  metrics: TrainingMetricsPayload;
  lastUpdated: string;
  telemetryState: 'live' | 'cached' | 'degraded';
  source: 'intervals.icu' | 'fallback';
  errors: string[];
}

interface TrainingMetricsOptions {
  now?: Date;
  client?: TrainingSourceClient;
  store?: TrainingSnapshotStore;
  manualVo2Max?: number;
  snapshot?: TrainingSourceSnapshot;
  forceRefresh?: boolean;
}

export async function getTrainingMetricsResponse(
  options: TrainingMetricsOptions = {}
): Promise<TrainingMetricsResponse> {
  const snapshot =
    options.snapshot ??
    (await loadTrainingSourceSnapshot(options.client ?? intervalsClient, {
      store: options.store,
      now: options.now,
      forceRefresh: options.forceRefresh,
    }));
  return buildTrainingMetricsResponseFromSnapshot(snapshot, options);
}

export function buildTrainingMetricsResponseFromSnapshot(
  snapshot: TrainingSourceSnapshot,
  options: Pick<TrainingMetricsOptions, 'now' | 'manualVo2Max'> = {}
): TrainingMetricsResponse {
  const env = getServerEnv();
  const manualVo2Max =
    options.manualVo2Max ?? Number(env.VO2_MAX_MANUAL || '45');

  const latestWellness = snapshot.wellnessData[0] || {};
  const wellness = createDerivedTrainingWellness(latestWellness, manualVo2Max);
  const activities = normalizeTrainingActivities(snapshot.activitiesRaw);

  const metrics =
    snapshot.status === 'live' || activities.length > 0 || snapshot.wellnessData.length > 0
      ? calculateTrainingMetrics(activities, wellness, { now: options.now })
      : getFallbackTrainingMetrics();
  const hasIntervalsData =
    snapshot.source === 'intervals.icu' &&
    (snapshot.activitiesRaw.length > 0 || snapshot.wellnessData.length > 0);
  const degraded = snapshot.status === 'degraded' || snapshot.errors.length > 0;

  return {
    success: hasIntervalsData,
    degraded,
    metrics,
    lastUpdated: snapshot.lastUpdated,
    telemetryState: snapshot.status,
    source: snapshot.source,
    errors: snapshot.errors,
  };
}
