/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import {
  calculateTrainingMetrics,
  createDerivedTrainingWellness,
  getFallbackTrainingMetrics,
  normalizeTrainingActivities,
} from '@/modules/training/domain/training-metrics';
import { getTrainingMetricsResponse } from '@/modules/training/application/get-training-metrics';

const emptySnapshotStore = {
  async readSnapshot() {
    return null;
  },
  async writeSnapshot() {
    return undefined;
  },
};

describe('training metrics domain', () => {
  it('calculates elevation, trends, and recent activity ordering from normalized data', () => {
    const activities = normalizeTrainingActivities([
      {
        id: '2',
        name: 'Hill Repeats',
        start_date_local: '2026-03-07T06:00:00.000Z',
        distance: 12000,
        moving_time: 5400,
        total_elevation_gain: 900,
        average_heartrate: 150,
        type: 'Run',
        description: 'Steep repeats',
      },
      {
        id: '1',
        name: 'Long Run',
        start_date_local: '2026-03-01T06:00:00.000Z',
        distance: 18000,
        moving_time: 7200,
        total_elevation_gain: 1100,
        average_heartrate: 145,
        type: 'Run',
      },
    ]);

    const wellness = createDerivedTrainingWellness(
      {
        restingHR: 48,
        vo2max: 52,
        hrv: 71,
      },
      45
    );

    const metrics = calculateTrainingMetrics(activities, wellness, {
      now: new Date('2026-03-08T00:00:00.000Z'),
    });

    expect(metrics.currentStats.totalElevationThisYear.value).toBe('2.0K m');
    expect(metrics.currentStats.currentRestingHR.value).toBe('48 bpm');
    expect(metrics.recentTrends.monthlyActivities.value).toBe('2');
    expect(metrics.recentActivities[0].activityId).toBe('2');
    expect(metrics.recentActivities[1].activityId).toBe('1');
    expect(metrics.vo2Max).toBe(52);
  });

  it('returns the documented fallback payload when live data is unavailable', () => {
    const fallback = getFallbackTrainingMetrics();

    expect(fallback.currentStats.totalElevationThisYear.value).toBe('356K m');
    expect(fallback.trainingPhases[0].phase).toBe('Base Training');
    expect(fallback.recentActivities).toHaveLength(0);
  });
});

describe('getTrainingMetricsResponse', () => {
  it('returns a degraded response with fallback metrics when the client fails', async () => {
    const response = await getTrainingMetricsResponse({
      now: new Date('2026-03-08T00:00:00.000Z'),
      manualVo2Max: 45,
      store: emptySnapshotStore,
      client: {
        getWellness: async () => {
          throw new Error('Intervals API Error: Forbidden');
        },
        getActivities: async () => {
          throw new Error('Intervals API Error: Forbidden');
        },
      },
    });

    expect(response.success).toBe(false);
    expect(response.degraded).toBe(true);
    expect(response.source).toBe('fallback');
    expect(response.metrics.currentStats.totalElevationThisYear.value).toBe(
      '356K m'
    );
    expect(response.errors).toContain('Intervals API Error: Forbidden');
  });

  it('returns a live response when provider data is available', async () => {
    const response = await getTrainingMetricsResponse({
      now: new Date('2026-03-08T00:00:00.000Z'),
      manualVo2Max: 45,
      store: emptySnapshotStore,
      client: {
        getWellness: async () => [
          { date: '2026-03-08', restingHR: 47, vo2max: 53, hrv: 68 },
        ],
        getActivities: async () => [
          {
            id: '1',
            name: 'Summit Session',
            start_date_local: '2026-03-07T06:00:00.000Z',
            distance: 10000,
            moving_time: 3600,
            total_elevation_gain: 800,
            average_heartrate: 149,
            type: 'Run',
          },
        ],
      },
    });

    expect(response.success).toBe(true);
    expect(response.degraded).toBe(false);
    expect(response.source).toBe('intervals.icu');
    expect(response.metrics.currentStats.currentRestingHR.value).toBe('47 bpm');
    expect(response.metrics.currentStats.totalElevationThisYear.value).toBe('800 m');
    expect(response.errors).toHaveLength(0);
  });
});
