/**
 * @jest-environment node
 */

import { describe, expect, it } from '@jest/globals';
import { hasInternalApiAccess } from '@/shared/security/internal-api';

describe('hasInternalApiAccess', () => {
  it('allows local development when no internal key is configured', () => {
    const request = new Request('http://localhost/api/publish', {
      method: 'POST',
    });

    expect(
      hasInternalApiAccess(request, {
        NODE_ENV: 'development',
        INTERNAL_API_KEY: undefined,
      })
    ).toBe(true);
  });

  it('denies production requests without a valid internal key', () => {
    const request = new Request('https://example.com/api/publish', {
      method: 'POST',
    });

    expect(
      hasInternalApiAccess(request, {
        NODE_ENV: 'production',
        INTERNAL_API_KEY: 'super-secret-key',
      })
    ).toBe(false);
  });

  it('accepts bearer token authentication', () => {
    const request = new Request('https://example.com/api/publish', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer super-secret-key',
      },
    });

    expect(
      hasInternalApiAccess(request, {
        NODE_ENV: 'production',
        INTERNAL_API_KEY: 'super-secret-key',
      })
    ).toBe(true);
  });

  it('accepts x-internal-api-key authentication', () => {
    const request = new Request('https://example.com/api/publish', {
      method: 'POST',
      headers: {
        'x-internal-api-key': 'super-secret-key',
      },
    });

    expect(
      hasInternalApiAccess(request, {
        NODE_ENV: 'production',
        INTERNAL_API_KEY: 'super-secret-key',
      })
    ).toBe(true);
  });
});
