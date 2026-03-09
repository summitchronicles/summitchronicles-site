/**
 * @jest-environment node
 */

import { describe, expect, it, jest } from '@jest/globals';
import {
  createMonitoringHealthResponse,
  handleMonitoringIngestion,
} from '@/modules/monitoring/application/monitoring-controller';
import { InMemoryWindowRateLimiter } from '@/modules/monitoring/infrastructure/in-memory-rate-limiter';
import type { MonitoringSink } from '@/modules/monitoring/application/monitoring-controller';

describe('handleMonitoringIngestion', () => {
  it('accepts valid monitoring payloads and reports processed counts', async () => {
    const sink: MonitoringSink = {
      send: jest.fn(async () => undefined),
    };

    const response = await handleMonitoringIngestion(
      {
        errors: [
          {
            id: 'error_1',
            type: 'javascript',
            severity: 'high',
            message: 'Unhandled exception in dashboard',
            fingerprint: 'fp_1',
            context: {
              sessionId: 'session_1',
              url: 'https://summitchronicles.com/dashboard',
              userAgent: 'jest',
              timestamp: '2026-03-08T12:00:00.000Z',
              environment: 'production',
            },
          },
        ],
        performanceIssues: [
          {
            id: 'perf_1',
            type: 'poor_lcp',
            metric: 'LCP',
            value: 4100,
            threshold: 2500,
            context: {
              sessionId: 'session_1',
              url: 'https://summitchronicles.com/dashboard',
              userAgent: 'jest',
              timestamp: '2026-03-08T12:00:00.000Z',
              environment: 'production',
            },
          },
        ],
      },
      {
        ip: '203.0.113.10',
        userAgent: 'jest',
        contentType: 'application/json',
        contentLength: 512,
        origin: 'https://summitchronicles.com',
        allowedOrigins: ['https://summitchronicles.com'],
        rateLimiter: new InMemoryWindowRateLimiter({ limit: 10, windowMs: 60_000 }),
        sinks: [sink],
      }
    );

    const processed = response.body.processed as {
      errors: number;
      performanceIssues: number;
    };

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(processed.errors).toBe(1);
    expect(processed.performanceIssues).toBe(1);
    expect((sink.send as jest.Mock)).toHaveBeenCalledTimes(1);
  });

  it('rejects requests from disallowed origins', async () => {
    const response = await handleMonitoringIngestion(
      { errors: [], performanceIssues: [] },
      {
        ip: '203.0.113.10',
        userAgent: 'jest',
        contentType: 'application/json',
        contentLength: 64,
        origin: 'https://evil.example',
        allowedOrigins: ['https://summitchronicles.com'],
        rateLimiter: new InMemoryWindowRateLimiter({ limit: 10, windowMs: 60_000 }),
      }
    );

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Origin not allowed');
  });

  it('applies rate limiting before payload processing', async () => {
    const rateLimiter = new InMemoryWindowRateLimiter({ limit: 1, windowMs: 60_000 });
    const request = {
      ip: '203.0.113.10',
      userAgent: 'jest',
      contentType: 'application/json',
      contentLength: 256,
      origin: 'https://summitchronicles.com',
      allowedOrigins: ['https://summitchronicles.com'],
      rateLimiter,
    };

    await handleMonitoringIngestion(
      {
        errors: [
          {
            id: 'error_1',
            type: 'network',
            severity: 'medium',
            message: 'first',
            fingerprint: 'fp_1',
            context: {
              sessionId: 'session_1',
              url: 'https://summitchronicles.com',
              userAgent: 'jest',
              timestamp: '2026-03-08T12:00:00.000Z',
              environment: 'production',
            },
          },
        ],
      },
      request
    );

    const response = await handleMonitoringIngestion(
      {
        errors: [
          {
            id: 'error_2',
            type: 'network',
            severity: 'medium',
            message: 'second',
            fingerprint: 'fp_2',
            context: {
              sessionId: 'session_1',
              url: 'https://summitchronicles.com',
              userAgent: 'jest',
              timestamp: '2026-03-08T12:00:00.000Z',
              environment: 'production',
            },
          },
        ],
      },
      request
    );

    expect(response.status).toBe(429);
    expect(response.body.error).toBe('Rate limit exceeded');
  });

  it('rejects payloads without any valid monitoring entries', async () => {
    const response = await handleMonitoringIngestion(
      {
        errors: [
          {
            id: 'bad',
            message: 'missing required fields',
          },
        ],
      },
      {
        ip: '203.0.113.10',
        userAgent: 'jest',
        contentType: 'application/json',
        contentLength: 256,
        origin: 'https://summitchronicles.com',
        allowedOrigins: ['https://summitchronicles.com'],
        rateLimiter: new InMemoryWindowRateLimiter({ limit: 10, windowMs: 60_000 }),
      }
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No valid errors or performance issues provided');
  });
});

describe('createMonitoringHealthResponse', () => {
  it('returns a minimal public health payload', () => {
    const response = createMonitoringHealthResponse({
      isInternal: false,
      now: new Date('2026-03-08T12:00:00.000Z'),
      nodeEnv: 'production',
      buildVersion: 'build-123',
      uptimeSeconds: 600,
      memoryUsage: { rss: 1 },
      rateLimitStoreSize: 4,
    });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.version).toBe('build-123');
    expect(response.body).not.toHaveProperty('memory');
    expect(response.body).not.toHaveProperty('rateLimitStore');
  });

  it('returns internal diagnostics when explicitly authorized', () => {
    const response = createMonitoringHealthResponse({
      isInternal: true,
      now: new Date('2026-03-08T12:00:00.000Z'),
      nodeEnv: 'production',
      buildVersion: 'build-123',
      uptimeSeconds: 600,
      memoryUsage: { rss: 1 },
      rateLimitStoreSize: 4,
    });

    expect(response.status).toBe(200);
    expect(response.body.memory).toEqual({ rss: 1 });
    expect(response.body.rateLimitStore).toEqual({
      size: 4,
      entries: 4,
    });
  });
});
