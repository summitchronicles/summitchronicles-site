/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import {
  getPersistedTrainingDashboardResponse,
  ingestTrainingArtifacts,
} from '@/modules/training/application/training-artifact-service';
import type { TrainingDashboardResponse } from '@/modules/training/domain/training-dashboard';
import type {
  PersistedTrainingSnapshot,
  PersistedTrainingStatusArtifact,
  PersistedTrainingSummaryArtifact,
  TrainingArtifactStore,
} from '@/modules/training/infrastructure/training-snapshot-store';

function createMemoryArtifactStore(initial?: {
  snapshot?: PersistedTrainingSnapshot | null;
  summary?: PersistedTrainingSummaryArtifact | null;
  status?: PersistedTrainingStatusArtifact | null;
}): TrainingArtifactStore & {
  getSnapshot(): PersistedTrainingSnapshot | null;
  getSummary(): PersistedTrainingSummaryArtifact | null;
  getStatus(): PersistedTrainingStatusArtifact | null;
} {
  let snapshot = initial?.snapshot ?? null;
  let summary = initial?.summary ?? null;
  let status = initial?.status ?? null;

  return {
    getBackend() {
      return 'local';
    },
    async readSnapshot() {
      return snapshot;
    },
    async writeSnapshot(nextSnapshot) {
      snapshot = nextSnapshot;
    },
    async readSummary() {
      return summary;
    },
    async writeSummary(nextSummary) {
      summary = nextSummary;
    },
    async readStatus() {
      return status;
    },
    async writeStatus(nextStatus) {
      status = nextStatus;
    },
    getSnapshot() {
      return snapshot;
    },
    getSummary() {
      return summary;
    },
    getStatus() {
      return status;
    },
  };
}

function createPersistedSnapshot(
  overrides: Partial<PersistedTrainingSnapshot> = {}
): PersistedTrainingSnapshot {
  return {
    version: 1,
    source: 'intervals.icu',
    ingestedAt: '2026-03-09T06:30:00.000Z',
    wellnessData: [{ date: '2026-03-09', restingHR: 57 }],
    activitiesRaw: [
      {
        id: 'activity-1',
        name: 'Morning Strength',
        start_date_local: '2026-03-09T06:00:00.000Z',
        moving_time: 1800,
        average_heartrate: 128,
        type: 'Strength',
      },
    ],
    missionLogs: [
      {
        weekStart: '2026-03-09',
        weekSummary: '1 session logged • 0.5 hrs total.',
        focus: 'Strength emphasis',
        tip: 'Keep the block controlled.',
        updatedAt: '2026-03-09T06:30:00.000Z',
        activityCount: 1,
        totalDurationSeconds: 1800,
        totalDistanceKm: 0,
        totalElevationGain: 0,
        dominantActivityType: 'Strength',
        source: 'intervals.icu',
      },
    ],
    errors: [],
    ...overrides,
  };
}

function createSummaryArtifact(
  responseOverrides: Partial<TrainingDashboardResponse> = {}
): PersistedTrainingSummaryArtifact {
  const response: TrainingDashboardResponse = {
    success: true,
    degraded: false,
    errors: [],
    lastUpdated: '2026-03-09T06:30:00.000Z',
    summary: {
      telemetry: {
        isLive: true,
        state: 'live',
        source: 'intervals.icu',
        lastUpdated: '2026-03-09T06:30:00.000Z',
        errors: [],
      },
      metrics: {
        currentStats: {
          sevenSummitsCompleted: {
            value: '4/7',
            description: 'done',
            trend: 'up',
          },
          trainingYears: {
            value: '11',
            description: 'years',
            trend: 'up',
          },
          totalElevationThisYear: {
            value: '0 m',
            description: 'elev',
            trend: 'up',
          },
          currentRestingHR: {
            value: '57 bpm',
            description: 'resting',
            trend: 'down',
          },
        },
        trainingPhases: [],
        recentTrends: {
          weeklyVolume: { value: '1 hr', description: 'week', trend: 'up' },
          monthlyActivities: { value: '1', description: 'month', trend: 'up' },
          elevationThisWeek: { value: '0 m', description: 'week', trend: 'up' },
          currentFitness: { value: '10/100', description: 'fitness', trend: 'up' },
        },
        expeditionProgress: {
          completed: [],
          upcoming: [],
          progressPercentage: 0,
        },
        advancedPerformance: {
          vo2Max: { value: 45, change: 0, unit: 'ml/kg/min', trend: 'stable' },
          powerOutput: { value: 0, change: 0, unit: 'w', trend: 'stable' },
          lactateThreshold: { value: 0, change: 0, unit: 'bpm', trend: 'stable' },
          recoveryRate: { value: 0, change: 0, unit: '%', trend: 'stable' },
        },
        predictions: [],
        bodyBattery: 0,
        bodyBatteryTimeline: [],
        stressScore: 43,
        hrvStatus: 'N/A',
        vo2Max: 45,
        recentActivities: [
          {
            activityId: 'activity-1',
            activityName: 'Morning Strength',
            startTimeLocal: '2026-03-09T06:00:00.000Z',
            duration: 1800,
            averageHR: 128,
            activityType: { typeKey: 'strength' },
            description: '',
          },
        ],
      },
      latestMissionLog: {
        weekStart: '2026-03-09',
        weekSummary: '1 session logged • 0.5 hrs total.',
        focus: 'Strength emphasis',
        tip: 'Keep the block controlled.',
        updatedAt: '2026-03-09T06:30:00.000Z',
        activityCount: 1,
        totalDurationSeconds: 1800,
        totalDistanceKm: 0,
        totalElevationGain: 0,
        dominantActivityType: 'Strength',
        source: 'intervals.icu',
      },
      missionLogs: [],
      workoutStats: {
        total_workouts: 1,
        total_duration_hours: 0.5,
        total_distance_km: 0,
        total_elevation_m: 0,
        avg_heart_rate: 128,
        avg_intensity: 0,
        by_type: { strength: 1 },
        by_source: { historical: 0, garmin: 0, intervals: 1 },
      },
    },
    ...responseOverrides,
  };

  return {
    version: 1,
    generatedAt: response.lastUpdated,
    response,
  };
}

describe('training artifact service', () => {
  it('writes a summary artifact on a successful live ingest', async () => {
    const store = createMemoryArtifactStore();

    const result = await ingestTrainingArtifacts({
      now: new Date('2026-03-09T06:30:00.000Z'),
      store,
      client: {
        getWellness: async () => [{ date: '2026-03-09', restingHR: 57 }],
        getActivities: async () => [
          {
            id: 'activity-1',
            name: 'Morning Strength',
            start_date_local: '2026-03-09T06:00:00.000Z',
            moving_time: 1800,
            average_heartrate: 128,
            type: 'Strength',
          },
        ],
      },
    });

    expect(result.wroteSummary).toBe(true);
    expect(store.getSummary()).not.toBeNull();
    expect(store.getStatus()?.state).toBe('live');
  });

  it('keeps the last good summary when a refresh fails with auth errors', async () => {
    const existingSummary = createSummaryArtifact();
    const store = createMemoryArtifactStore({
      snapshot: createPersistedSnapshot(),
      summary: existingSummary,
    });

    const result = await ingestTrainingArtifacts({
      now: new Date('2026-03-09T08:00:00.000Z'),
      store,
      client: {
        getWellness: async () => {
          throw new Error('Intervals API Error: Unauthorized');
        },
        getActivities: async () => {
          throw new Error('Intervals API Error: Unauthorized');
        },
      },
    });

    expect(result.wroteSummary).toBe(false);
    expect(store.getSummary()).toEqual(existingSummary);
    expect(store.getStatus()?.state).toBe('auth_failed');
  });

  it('merges persisted status over the last good summary', async () => {
    const response = await getPersistedTrainingDashboardResponse({
      fallbackToLive: false,
      store: createMemoryArtifactStore({
        summary: createSummaryArtifact(),
        status: {
          version: 1,
          source: 'intervals.icu',
          state: 'auth_failed',
          lastAttemptAt: '2026-03-09T08:00:00.000Z',
          lastSuccessAt: '2026-03-09T06:30:00.000Z',
          latestActivityAt: '2026-03-09T06:00:00.000Z',
          lastError: 'Intervals API Error: Unauthorized',
          errors: ['Intervals API Error: Unauthorized'],
          backend: 'local',
        },
      }),
    });

    expect(response.degraded).toBe(true);
    expect(response.summary.telemetry.state).toBe('cached');
    expect(response.errors).toContain('Intervals API Error: Unauthorized');
    expect(response.summary.metrics.recentActivities[0]?.startTimeLocal).toBe(
      '2026-03-09T06:00:00.000Z'
    );
  });
});
