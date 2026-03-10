import {
  buildProcessedMissionLogs,
  type TrainingInsight,
} from '@/modules/training/domain/training-dashboard';
import { normalizeTrainingActivities } from '@/modules/training/domain/training-metrics';
import {
  getTrainingArtifactStore,
  type PersistedTrainingSnapshot,
  type TrainingSnapshotStore,
} from '@/modules/training/infrastructure/training-snapshot-store';

export interface TrainingSourceClient {
  getWellness(startDate?: string, endDate?: string): Promise<any[]>;
  getActivities(limit?: number): Promise<any[]>;
}

export interface TrainingSourceSnapshot {
  status: 'live' | 'cached' | 'degraded';
  source: 'intervals.icu' | 'fallback';
  wellnessData: any[];
  activitiesRaw: any[];
  missionLogs: TrainingInsight[];
  lastUpdated: string;
  errors: string[];
}

interface LoadTrainingSourceSnapshotOptions {
  store?: TrainingSnapshotStore;
  now?: Date;
  maxAgeMs?: number;
  forceRefresh?: boolean;
}

const DEFAULT_SNAPSHOT_MAX_AGE_MS = 15 * 60 * 1000;

export async function loadTrainingSourceSnapshot(
  client: TrainingSourceClient,
  options: LoadTrainingSourceSnapshotOptions = {}
): Promise<TrainingSourceSnapshot> {
  const now = options.now ?? new Date();
  const nowIso = now.toISOString();
  const store = options.store ?? getTrainingArtifactStore();
  const cachedSnapshot = await store.readSnapshot();
  const maxAgeMs = options.maxAgeMs ?? DEFAULT_SNAPSHOT_MAX_AGE_MS;

  if (
    cachedSnapshot &&
    !options.forceRefresh &&
    cachedSnapshot.errors.length === 0 &&
    !isSnapshotStale(cachedSnapshot, now, maxAgeMs)
  ) {
    return toSourceSnapshot(cachedSnapshot, 'cached');
  }

  const [wellnessResult, activitiesResult] = await Promise.all([
    client
      .getWellness()
      .then((data) => ({ data, error: null as string | null }))
      .catch((error) => ({
        data: [],
        error: error instanceof Error ? error.message : String(error),
      })),
    client
      .getActivities(200)
      .then((data) => ({ data, error: null as string | null }))
      .catch((error) => ({
        data: [],
        error: error instanceof Error ? error.message : String(error),
      })),
  ]);

  const errors = [wellnessResult.error, activitiesResult.error].filter(
    (error): error is string => Boolean(error)
  );

  if (!activitiesResult.error) {
    const persisted = buildPersistedSnapshot({
      ingestedAt: nowIso,
      wellnessData: wellnessResult.data,
      activitiesRaw: activitiesResult.data,
      errors,
    });

    await store.writeSnapshot(persisted);
    return toSourceSnapshot(
      persisted,
      errors.length === 0 ? 'live' : 'degraded'
    );
  }

  if (cachedSnapshot) {
    return {
      ...toSourceSnapshot(cachedSnapshot, 'cached'),
      errors,
    };
  }

  if (wellnessResult.data.length > 0) {
    const partialSnapshot = buildPersistedSnapshot({
      ingestedAt: nowIso,
      wellnessData: wellnessResult.data,
      activitiesRaw: [],
      errors,
    });

    await store.writeSnapshot(partialSnapshot);
    return toSourceSnapshot(partialSnapshot, 'degraded');
  }

  return {
    status: 'degraded',
    source: 'fallback',
    wellnessData: [],
    activitiesRaw: [],
    missionLogs: [],
    lastUpdated: nowIso,
    errors,
  };
}

function buildPersistedSnapshot({
  ingestedAt,
  wellnessData,
  activitiesRaw,
  errors,
}: {
  ingestedAt: string;
  wellnessData: any[];
  activitiesRaw: any[];
  errors: string[];
}): PersistedTrainingSnapshot {
  return {
    version: 1,
    source: 'intervals.icu',
    ingestedAt,
    wellnessData,
    activitiesRaw,
    missionLogs: buildProcessedMissionLogs(
      normalizeTrainingActivities(activitiesRaw),
      ingestedAt
    ),
    errors,
  };
}

function toSourceSnapshot(
  snapshot: PersistedTrainingSnapshot,
  status: TrainingSourceSnapshot['status']
): TrainingSourceSnapshot {
  return {
    status,
    source: snapshot.source,
    wellnessData: snapshot.wellnessData,
    activitiesRaw: snapshot.activitiesRaw,
    missionLogs: snapshot.missionLogs,
    lastUpdated: snapshot.ingestedAt,
    errors: snapshot.errors,
  };
}

function isSnapshotStale(
  snapshot: PersistedTrainingSnapshot,
  now: Date,
  maxAgeMs: number
): boolean {
  const ingestedAt = new Date(snapshot.ingestedAt);

  if (Number.isNaN(ingestedAt.getTime())) {
    return true;
  }

  return now.getTime() - ingestedAt.getTime() > maxAgeMs;
}
