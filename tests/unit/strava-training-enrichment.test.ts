/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import {
  mapStravaActivity,
  mergeStravaActivities,
} from '@/modules/training/application/strava-training-enrichment';

describe('Strava training enrichment', () => {
  it('maps observed Strava values without inventing metrics', () => {
    const activity = mapStravaActivity({
      id: 42,
      name: 'Hill repeats',
      sport_type: 'TrailRun',
      start_date_local: '2026-07-13T06:30:00Z',
      moving_time: 3600,
      elapsed_time: 3900,
      distance: 12500,
      total_elevation_gain: 820,
      average_heartrate: 151,
    });

    expect(activity).toMatchObject({
      activityId: 'strava:42',
      activityName: 'Hill repeats',
      duration: 3600,
      distance: 12500,
      elevationGain: 820,
      averageHR: 151,
      source: 'strava',
      activityType: { typeKey: 'trailrun' },
    });
  });

  it('keeps the existing source when Strava reports the same session', () => {
    const merged = mergeStravaActivities(
      [
        {
          activityId: 'intervals:42',
          activityName: 'Hill repeats',
          startTimeLocal: '2026-07-13T06:30:00Z',
          duration: 3600,
          source: 'intervals.icu',
        },
      ],
      [
        {
          activityId: 'strava:42',
          activityName: 'Hill repeats',
          startTimeLocal: '2026-07-13T06:32:00Z',
          duration: 3600,
          source: 'strava',
        },
      ]
    );

    expect(merged).toHaveLength(1);
    expect(merged[0].source).toBe('intervals.icu');
  });
});
