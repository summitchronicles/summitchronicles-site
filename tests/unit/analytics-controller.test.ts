/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import {
  createComprehensiveAnalyticsResponse,
  createComprehensiveAnalyticsSampleResponse,
} from '@/modules/analytics/application/comprehensive-analytics';
import {
  createComplianceAnalyticsGetResponse,
  createComplianceAnalyticsPostResponse,
} from '@/modules/analytics/application/compliance-analytics';

describe('comprehensive analytics', () => {
  it('calculates deterministic metrics, trends, and comparisons for provided activities', () => {
    const response = createComprehensiveAnalyticsResponse(
      {
        activities: [
          {
            distance: 12000,
            total_elevation_gain: 700,
            moving_time: 3600,
            average_heartrate: 145,
            type: 'Run',
            start_date: '2026-03-07T06:00:00.000Z',
          },
          {
            distance: 18000,
            total_elevation_gain: 1200,
            moving_time: 7200,
            average_heartrate: 152,
            type: 'Run',
            start_date: '2026-03-01T06:00:00.000Z',
          },
        ],
        timeframe: 'month',
        includeComparison: true,
        includeTrends: true,
      },
      {
        now: new Date('2026-03-08T00:00:00.000Z'),
      }
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.metrics.totalDistance).toBe(30);
    expect(response.body.metrics.totalElevation).toBe(1900);
    expect(response.body.metrics.averageHeartRate).toBe(149);
    expect(response.body.trends).toHaveLength(5);
    expect(response.body.comparison?.userLevel).toBeDefined();
  });

  it('returns a stable sample payload for GET consumers', () => {
    const response = createComprehensiveAnalyticsSampleResponse(
      new Date('2026-03-08T00:00:00.000Z')
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.meta.isSampleData).toBe(true);
    expect(response.body.comparison?.userLevel).toBe('intermediate');
  });
});

describe('compliance analytics', () => {
  it('returns relative-time sample analytics with alerts and trends', () => {
    const response = createComplianceAnalyticsGetResponse({
      timeframe: 'month',
      includeAlerts: true,
      includeTrends: true,
      now: new Date('2026-03-08T00:00:00.000Z'),
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.dataPoints).toBeGreaterThan(0);
    expect(response.body.analytics.totalWorkouts).toBeGreaterThan(0);
    expect(Array.isArray(response.body.alerts)).toBe(true);
    expect(Array.isArray(response.body.trends?.complianceHistory)).toBe(true);
  });

  it('rejects invalid compliance actions', () => {
    const response = createComplianceAnalyticsPostResponse({
      action: 'invalid',
      activities: [],
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid action parameter');
  });
});
