/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import { getTrainingIntegrationStatuses } from '@/modules/training/application/training-integrations';

describe('training integration statuses', () => {
  it('reports the active Intervals and WHOOP integrations', () => {
    const statuses = getTrainingIntegrationStatuses('live', {
      NODE_ENV: 'test',
      INTERVALS_ICU_API_KEY: 'intervals-key',
      INTERVALS_ICU_ATHLETE_ID: 'athlete-id',
    });

    expect(statuses.find((item) => item.id === 'intervals.icu')?.state).toBe(
      'live'
    );
    expect(statuses.find((item) => item.id === 'whoop')?.state).toBe(
      'not-configured'
    );
    expect(statuses.map((item) => item.id)).toEqual([
      'intervals.icu',
      'whoop',
    ]);
  });

  it('does not infer a WHOOP connection from environment secrets', () => {
    const statuses = getTrainingIntegrationStatuses('cached', {
      NODE_ENV: 'test',
      INTERVALS_ICU_API_KEY: 'intervals-key',
      INTERVALS_ICU_ATHLETE_ID: 'athlete-id',
      WHOOP_CLIENT_ID: 'whoop-id',
      WHOOP_CLIENT_SECRET: 'whoop-secret',
      WHOOP_REDIRECT_URI: 'http://localhost:3001/api/auth/whoop/callback',
      WHOOP_TOKEN_ENCRYPTION_KEY: 'a'.repeat(32),
      DATABASE_URL: 'postgresql://user:password@localhost/database',
    });

    expect(statuses.find((item) => item.id === 'intervals.icu')?.state).toBe(
      'cached'
    );
    expect(statuses.find((item) => item.id === 'whoop')?.state).toBe(
      'setup-required'
    );
  });
});
