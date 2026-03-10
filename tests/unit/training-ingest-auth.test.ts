/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import { hasTrainingIngestAccess } from '@/shared/security/training-ingest';

describe('hasTrainingIngestAccess', () => {
  it('accepts the dedicated ingest secret in production', () => {
    const request = new Request('https://example.com/api/training/ingest', {
      method: 'POST',
      headers: {
        'x-training-ingest-secret': 'ingest-secret',
      },
    });

    expect(
      hasTrainingIngestAccess(request, {
        NODE_ENV: 'production',
        INTERNAL_API_KEY: undefined,
        TRAINING_INGEST_SECRET: 'ingest-secret',
      })
    ).toBe(true);
  });

  it('accepts the shared internal API key in production', () => {
    const request = new Request('https://example.com/api/training/ingest', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer internal-secret',
      },
    });

    expect(
      hasTrainingIngestAccess(request, {
        NODE_ENV: 'production',
        INTERNAL_API_KEY: 'internal-secret',
        TRAINING_INGEST_SECRET: 'ingest-secret',
      })
    ).toBe(true);
  });

  it('denies production requests without either valid secret', () => {
    const request = new Request('https://example.com/api/training/ingest', {
      method: 'POST',
    });

    expect(
      hasTrainingIngestAccess(request, {
        NODE_ENV: 'production',
        INTERNAL_API_KEY: 'internal-secret',
        TRAINING_INGEST_SECRET: 'ingest-secret',
      })
    ).toBe(false);
  });
});
