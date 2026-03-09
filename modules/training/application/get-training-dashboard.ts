import {
  calculateTrainingWorkoutStats,
  findLatestTrainingInsight,
  type TrainingDashboardResponse,
} from '@/modules/training/domain/training-dashboard';
import {
  buildTrainingMetricsResponseFromSnapshot,
  type TrainingMetricsResponse,
} from '@/modules/training/application/get-training-metrics';
import { loadTrainingSourceSnapshot } from '@/modules/training/application/training-snapshot-service';
import { intervalsClient } from '@/modules/training/infrastructure/intervals-client';
import { normalizeTrainingActivities } from '@/modules/training/domain/training-metrics';
import type {
  TrainingSourceClient,
  TrainingSourceSnapshot,
} from '@/modules/training/application/training-snapshot-service';
import type { TrainingSnapshotStore } from '@/modules/training/infrastructure/training-snapshot-store';

interface TrainingDashboardDependencies {
  now?: Date;
  client?: TrainingSourceClient;
  store?: TrainingSnapshotStore;
  manualVo2Max?: number;
  loadSnapshot?: () => Promise<TrainingSourceSnapshot>;
  forceRefresh?: boolean;
}

export async function getTrainingDashboardResponse(
  dependencies: TrainingDashboardDependencies = {}
): Promise<TrainingDashboardResponse> {
  const now = dependencies.now ?? new Date();
  const snapshot =
    dependencies.loadSnapshot?.() ??
    loadTrainingSourceSnapshot(dependencies.client ?? intervalsClient, {
      store: dependencies.store,
      now,
      forceRefresh: dependencies.forceRefresh,
    });
  const resolvedSnapshot = await snapshot;
  const metricsResponse: TrainingMetricsResponse =
    buildTrainingMetricsResponseFromSnapshot(resolvedSnapshot, {
      now,
      manualVo2Max: dependencies.manualVo2Max,
    });
  const normalizedActivities = normalizeTrainingActivities(
    resolvedSnapshot.activitiesRaw
  );
  const workoutStats = calculateTrainingWorkoutStats(normalizedActivities);
  const latestMissionLog = findLatestTrainingInsight(
    resolvedSnapshot.missionLogs,
    now
  );

  return {
    success: metricsResponse.success,
    degraded: metricsResponse.degraded,
    errors: metricsResponse.errors,
    lastUpdated: metricsResponse.lastUpdated,
    summary: {
      telemetry: {
        isLive: metricsResponse.telemetryState === 'live',
        state: metricsResponse.telemetryState,
        source: metricsResponse.source,
        lastUpdated: metricsResponse.lastUpdated,
        errors: metricsResponse.errors,
      },
      metrics: metricsResponse.metrics,
      latestMissionLog,
      missionLogs: resolvedSnapshot.missionLogs,
      workoutStats,
    },
  };
}

