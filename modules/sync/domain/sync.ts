export interface SyncRuntimeConfig {
  intervalMinutes: number;
  enableWeather: boolean;
  enableCache: boolean;
  enableAI: boolean;
}

export interface SyncStatusSnapshot {
  isRunning: boolean;
  config: SyncRuntimeConfig;
  cacheSize: number;
  lastSync: string | null;
}

export interface SyncExecutionResult {
  success: boolean;
  synced: string[];
  errors: string[];
  completedAt: string;
}

export interface SyncServicePort {
  start(): void;
  stop(): void;
  performSync(): Promise<SyncExecutionResult>;
  updateConfig(configPatch: Partial<SyncRuntimeConfig>): SyncRuntimeConfig;
  getStatus(): SyncStatusSnapshot;
}

type ConfigValidationResult =
  | {
      ok: true;
      value: Partial<SyncRuntimeConfig>;
    }
  | {
      ok: false;
      errors: string[];
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function normalizeSyncConfigPatch(
  input: unknown
): ConfigValidationResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      errors: ['Sync configuration must be an object'],
    };
  }

  const patch: Partial<SyncRuntimeConfig> = {};
  const errors: string[] = [];

  if ('intervalMinutes' in input) {
    const value = input.intervalMinutes;
    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      !Number.isInteger(value) ||
      value < 1 ||
      value > 1440
    ) {
      errors.push('intervalMinutes must be an integer between 1 and 1440');
    } else {
      patch.intervalMinutes = value;
    }
  }

  if ('enableWeather' in input) {
    if (typeof input.enableWeather !== 'boolean') {
      errors.push('enableWeather must be a boolean');
    } else {
      patch.enableWeather = input.enableWeather;
    }
  }

  if ('enableCache' in input) {
    if (typeof input.enableCache !== 'boolean') {
      errors.push('enableCache must be a boolean');
    } else {
      patch.enableCache = input.enableCache;
    }
  }

  if ('enableAI' in input) {
    if (typeof input.enableAI !== 'boolean') {
      errors.push('enableAI must be a boolean');
    } else {
      patch.enableAI = input.enableAI;
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
    };
  }

  if (Object.keys(patch).length === 0) {
    return {
      ok: false,
      errors: ['No supported sync config keys provided'],
    };
  }

  return {
    ok: true,
    value: patch,
  };
}
