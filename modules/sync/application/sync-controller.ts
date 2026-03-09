import {
  normalizeSyncConfigPatch,
  type SyncExecutionResult,
  type SyncServicePort,
  type SyncStatusSnapshot,
} from '@/modules/sync/domain/sync';

type SyncResponseData = SyncStatusSnapshot | SyncExecutionResult;

export interface SyncApiResponseBody {
  success: boolean;
  message?: string;
  error?: string;
  details?: string[];
  data?: SyncResponseData;
}

export interface SyncApiResponse {
  status: number;
  body: SyncApiResponseBody;
}

function createSuccessResponse(
  message: string,
  data: SyncResponseData,
  success = true
): SyncApiResponse {
  return {
    status: 200,
    body: {
      success,
      message,
      data,
    },
  };
}

function createErrorResponse(
  status: number,
  error: string,
  details?: string[]
): SyncApiResponse {
  return {
    status,
    body: {
      success: false,
      error,
      details,
    },
  };
}

export async function handleSyncGetAction(
  action: string | null | undefined,
  service: SyncServicePort
): Promise<SyncApiResponse> {
  switch (action ?? 'status') {
    case 'status':
      return createSuccessResponse('Sync service status', service.getStatus());

    case 'start':
      service.start();
      return createSuccessResponse('Sync service started', service.getStatus());

    case 'stop':
      service.stop();
      return createSuccessResponse('Sync service stopped', service.getStatus());

    case 'sync': {
      const syncResult = await service.performSync();
      return createSuccessResponse(
        syncResult.success
          ? 'Manual sync completed'
          : 'Manual sync completed with errors',
        syncResult,
        syncResult.success
      );
    }

    default:
      return createErrorResponse(400, 'Invalid action specified');
  }
}

export async function handleSyncPostAction(
  input: unknown,
  service: SyncServicePort
): Promise<SyncApiResponse> {
  const action =
    typeof input === 'object' && input !== null && 'action' in input
      ? input.action
      : undefined;

  switch (action) {
    case 'configure': {
      const config =
        typeof input === 'object' && input !== null && 'config' in input
          ? input.config
          : undefined;
      const patch = normalizeSyncConfigPatch(config);

      if (!patch.ok) {
        return createErrorResponse(
          400,
          'Invalid sync configuration',
          patch.errors
        );
      }

      service.updateConfig(patch.value);
      return createSuccessResponse(
        'Sync service configuration updated',
        service.getStatus()
      );
    }

    case 'manual-sync': {
      const syncResult = await service.performSync();
      return createSuccessResponse(
        syncResult.success
          ? 'Manual sync completed'
          : 'Manual sync completed with errors',
        syncResult,
        syncResult.success
      );
    }

    default:
      return createErrorResponse(400, 'Invalid action specified');
  }
}
