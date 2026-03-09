/**
 * @jest-environment node
 */

import { describe, expect, it, jest } from '@jest/globals';
import {
  handleSyncGetAction,
  handleSyncPostAction,
} from '@/modules/sync/application/sync-controller';
import type {
  SyncExecutionResult,
  SyncRuntimeConfig,
  SyncServicePort,
  SyncStatusSnapshot,
} from '@/modules/sync/domain/sync';

function createStatus(
  overrides: Partial<SyncStatusSnapshot> = {}
): SyncStatusSnapshot {
  return {
    isRunning: false,
    cacheSize: 0,
    lastSync: null,
    config: {
      intervalMinutes: 60,
      enableWeather: true,
      enableCache: true,
      enableAI: true,
    },
    ...overrides,
  };
}

function createService(
  overrides: Partial<SyncServicePort> = {}
): jest.Mocked<SyncServicePort> {
  let status = createStatus();

  return {
    start: jest.fn(() => {
      status = { ...status, isRunning: true };
    }),
    stop: jest.fn(() => {
      status = { ...status, isRunning: false };
    }),
    performSync: jest.fn(async () => ({
      success: true,
      synced: ['weather', 'ai-knowledge', 'cache-cleanup'],
      errors: [],
      completedAt: '2026-03-08T10:00:00.000Z',
    })),
    updateConfig: jest.fn((patch: Partial<SyncRuntimeConfig>) => {
      status = {
        ...status,
        config: {
          ...status.config,
          ...patch,
        },
      };

      return status.config;
    }),
    getStatus: jest.fn(() => status),
    ...overrides,
  } as jest.Mocked<SyncServicePort>;
}

describe('handleSyncGetAction', () => {
  it('returns status for the default view', async () => {
    const service = createService();

    const response = await handleSyncGetAction(null, service);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Sync service status');
    expect(response.body.data).toEqual(service.getStatus());
  });

  it('starts the service and returns the updated status', async () => {
    const service = createService();

    const response = await handleSyncGetAction('start', service);

    expect(service.start).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Sync service started');
    expect((response.body.data as SyncStatusSnapshot).isRunning).toBe(true);
  });

  it('runs a manual sync through the service port', async () => {
    const service = createService();

    const response = await handleSyncGetAction('sync', service);

    expect(service.performSync).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Manual sync completed');
    expect((response.body.data as SyncExecutionResult).synced).toContain('weather');
  });
});

describe('handleSyncPostAction', () => {
  it('applies a validated config patch and returns the updated status', async () => {
    const service = createService();

    const response = await handleSyncPostAction(
      {
        action: 'configure',
        config: {
          intervalMinutes: 15,
          enableAI: false,
        },
      },
      service
    );

    expect(service.updateConfig).toHaveBeenCalledWith({
      intervalMinutes: 15,
      enableAI: false,
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Sync service configuration updated');
    expect((response.body.data as SyncStatusSnapshot).config.intervalMinutes).toBe(15);
    expect((response.body.data as SyncStatusSnapshot).config.enableAI).toBe(false);
  });

  it('rejects an invalid config patch', async () => {
    const service = createService();

    const response = await handleSyncPostAction(
      {
        action: 'configure',
        config: {
          intervalMinutes: 0,
        },
      },
      service
    );

    expect(service.updateConfig).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid sync configuration');
  });

  it('rejects unknown post actions', async () => {
    const service = createService();

    const response = await handleSyncPostAction(
      {
        action: 'unknown',
      },
      service
    );

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Invalid action specified');
  });
});
