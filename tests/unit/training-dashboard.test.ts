/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import { getTrainingDashboardResponse } from '@/modules/training/application/get-training-dashboard';

describe('getTrainingDashboardResponse', () => {
  it('builds the dashboard from a processed Intervals snapshot', async () => {
    const response = await getTrainingDashboardResponse({
      now: new Date('2026-03-03T08:00:00.000Z'),
      loadSnapshot: async () => ({
        status: 'live',
        source: 'intervals.icu',
        lastUpdated: '2026-03-03T08:00:00.000Z',
        wellnessData: [{ date: '2026-03-03', restingHR: 49, vo2max: 53 }],
        activitiesRaw: [
          {
            id: 'activity-1',
            name: 'Stair Session',
            start_date_local: '2026-03-03T06:00:00.000Z',
            distance: 0,
            moving_time: 3600,
            total_elevation_gain: 850,
            average_heartrate: 149,
            type: 'Stairs',
            description: 'Steady climbing volume',
            source: 'GARMIN',
          },
        ],
        missionLogs: [
          {
            weekStart: '2026-03-02',
            weekSummary: 'Volume is rebuilding cleanly.',
            focus: 'Rebuild volume',
            tip: 'Keep cadence high on the stairs.',
            updatedAt: '2026-03-03T07:00:00.000Z',
            activityCount: 1,
            totalDurationSeconds: 3600,
            totalDistanceKm: 0,
            totalElevationGain: 850,
            dominantActivityType: 'Stairs',
            source: 'intervals.icu',
          },
        ],
        errors: [],
      }),
    });

    expect(response.success).toBe(true);
    expect(response.summary.telemetry.isLive).toBe(true);
    expect(response.summary.latestMissionLog?.focus).toBe('Rebuild volume');
    expect(response.summary.missionLogs).toHaveLength(1);
    expect(response.summary.metrics.vo2Max).toBe(53);
    expect(response.summary.workoutStats?.total_workouts).toBe(1);
  });

  it('does not expose processed mission logs when no observed activity exists', async () => {
    const response = await getTrainingDashboardResponse({
      now: new Date('2026-03-03T08:00:00.000Z'),
      loadSnapshot: async () => ({
        status: 'degraded',
        lastUpdated: '2026-03-03T08:00:00.000Z',
        source: 'fallback',
        wellnessData: [],
        activitiesRaw: [],
        missionLogs: [],
        errors: ['No live telemetry'],
      }),
    });

    expect(response.summary.missionLogs).toEqual([]);
    expect(response.summary.latestMissionLog).toBeNull();
    expect(response.summary.workoutStats?.total_workouts).toBe(0);
  });
});
