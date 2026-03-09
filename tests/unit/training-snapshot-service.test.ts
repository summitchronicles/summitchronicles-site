/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import type { TrainingInsight } from '@/modules/training/domain/training-dashboard';
import { loadTrainingSourceSnapshot } from '@/modules/training/application/training-snapshot-service';
import type {
  PersistedTrainingSnapshot,
  TrainingSnapshotStore,
} from '@/modules/training/infrastructure/training-snapshot-store';

function createMemoryStore(
  initialSnapshot: PersistedTrainingSnapshot | null = null
): TrainingSnapshotStore & {
  getSnapshot(): PersistedTrainingSnapshot | null;
} {
  let snapshot = initialSnapshot;

  return {
    async readSnapshot() {
      return snapshot;
    },
    async writeSnapshot(nextSnapshot) {
      snapshot = nextSnapshot;
    },
    getSnapshot() {
      return snapshot;
    },
  };
}

function createPersistedSnapshot(
  overrides: Partial<PersistedTrainingSnapshot> = {}
): PersistedTrainingSnapshot {
  const missionLogs: TrainingInsight[] = [
    {
      weekStart: '2026-03-02',
      weekSummary: '2 sessions logged • 2.0 hrs total.',
      focus: 'Run emphasis',
      tip: 'Keep the easy work easy.',
      updatedAt: '2026-03-08T09:00:00.000Z',
      activityCount: 2,
      totalDurationSeconds: 7200,
      totalDistanceKm: 12,
      totalElevationGain: 640,
      dominantActivityType: 'Run',
      source: 'intervals.icu',
    },
  ];

  return {
    version: 1,
    source: 'intervals.icu',
    ingestedAt: '2026-03-08T09:00:00.000Z',
    wellnessData: [{ date: '2026-03-08', restingHR: 50 }],
    activitiesRaw: [
      {
        id: 'activity-1',
        start_date_local: '2026-03-03T06:00:00.000Z',
        name: 'Hill Repeats',
        type: 'Run',
        moving_time: 3600,
        distance: 10000,
        total_elevation_gain: 500,
        average_heartrate: 150,
        source: 'GARMIN',
      },
    ],
    missionLogs,
    errors: [],
    ...overrides,
  };
}

describe('loadTrainingSourceSnapshot', () => {
  it('persists processed mission logs when Intervals ingestion succeeds', async () => {
    const store = createMemoryStore();

    const snapshot = await loadTrainingSourceSnapshot(
      {
        getWellness: async () => [{ date: '2026-03-08', restingHR: 50 }],
        getActivities: async () => [
          {
            id: 'activity-1',
            start_date_local: '2026-03-03T06:00:00.000Z',
            name: 'Hill Repeats',
            type: 'Run',
            moving_time: 3600,
            distance: 10000,
            total_elevation_gain: 500,
            average_heartrate: 150,
            source: 'GARMIN',
          },
        ],
      },
      {
        store,
        now: new Date('2026-03-08T10:00:00.000Z'),
      }
    );

    expect(snapshot.status).toBe('live');
    expect(snapshot.source).toBe('intervals.icu');
    expect(snapshot.missionLogs).toHaveLength(1);
    expect(snapshot.missionLogs[0].weekStart).toBe('2026-03-02');
    expect(snapshot.missionLogs[0].activityCount).toBe(1);
    expect(snapshot.missionLogs[0].source).toBe('intervals.icu');
    expect(store.getSnapshot()?.missionLogs).toHaveLength(1);
  });

  it('serves the cached processed snapshot when a refresh fails', async () => {
    const store = createMemoryStore(createPersistedSnapshot());

    const snapshot = await loadTrainingSourceSnapshot(
      {
        getWellness: async () => {
          throw new Error('Intervals API Error: Forbidden');
        },
        getActivities: async () => {
          throw new Error('Intervals API Error: Forbidden');
        },
      },
      {
        store,
        now: new Date('2026-03-08T12:00:00.000Z'),
        forceRefresh: true,
      }
    );

    expect(snapshot.status).toBe('cached');
    expect(snapshot.source).toBe('intervals.icu');
    expect(snapshot.missionLogs).toHaveLength(1);
    expect(snapshot.errors).toContain('Intervals API Error: Forbidden');
    expect(snapshot.lastUpdated).toBe('2026-03-08T09:00:00.000Z');
  });

  it('persists mission logs even when only wellness fetch fails', async () => {
    const store = createMemoryStore();

    const snapshot = await loadTrainingSourceSnapshot(
      {
        getWellness: async () => {
          throw new Error('Intervals wellness unavailable');
        },
        getActivities: async () => [
          {
            id: 'activity-1',
            start_date_local: '2026-03-03T06:00:00.000Z',
            name: 'Hill Repeats',
            type: 'Run',
            moving_time: 3600,
            distance: 10000,
            total_elevation_gain: 500,
            average_heartrate: 150,
            source: 'GARMIN',
          },
        ],
      },
      {
        store,
        now: new Date('2026-03-08T10:00:00.000Z'),
      }
    );

    expect(snapshot.status).toBe('degraded');
    expect(snapshot.source).toBe('intervals.icu');
    expect(snapshot.missionLogs).toHaveLength(1);
    expect(store.getSnapshot()?.missionLogs).toHaveLength(1);
  });

  it('returns a degraded snapshot when the provider fails and no cache exists', async () => {
    const snapshot = await loadTrainingSourceSnapshot(
      {
        getWellness: async () => {
          throw new Error('Intervals API Error: Forbidden');
        },
        getActivities: async () => {
          throw new Error('Intervals API Error: Forbidden');
        },
      },
      {
        store: createMemoryStore(),
        forceRefresh: true,
      }
    );

    expect(snapshot.status).toBe('degraded');
    expect(snapshot.source).toBe('fallback');
    expect(snapshot.missionLogs).toHaveLength(0);
    expect(snapshot.errors).toContain('Intervals API Error: Forbidden');
  });
});
