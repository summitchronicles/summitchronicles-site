import fs from 'fs';
import path from 'path';
import type { TrainingInsight } from '@/modules/training/domain/training-dashboard';

export interface PersistedTrainingSnapshot {
  version: 1;
  source: 'intervals.icu';
  ingestedAt: string;
  wellnessData: unknown[];
  activitiesRaw: unknown[];
  missionLogs: TrainingInsight[];
  errors: string[];
}

export interface TrainingSnapshotStore {
  readSnapshot(): Promise<PersistedTrainingSnapshot | null>;
  writeSnapshot(snapshot: PersistedTrainingSnapshot): Promise<void>;
}

interface FileTrainingSnapshotStoreOptions {
  snapshotPath?: string;
}

const DEFAULT_SNAPSHOT_PATH = path.join(
  process.cwd(),
  'data',
  'training',
  'intervals-snapshot.json'
);

export class FileTrainingSnapshotStore implements TrainingSnapshotStore {
  private readonly snapshotPath: string;

  constructor(options: FileTrainingSnapshotStoreOptions = {}) {
    this.snapshotPath = options.snapshotPath ?? DEFAULT_SNAPSHOT_PATH;
  }

  async readSnapshot(): Promise<PersistedTrainingSnapshot | null> {
    if (!fs.existsSync(this.snapshotPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(this.snapshotPath, 'utf-8');
      const parsed = JSON.parse(content);

      if (!isPersistedTrainingSnapshot(parsed)) {
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('Failed to read training snapshot:', error);
      return null;
    }
  }

  async writeSnapshot(snapshot: PersistedTrainingSnapshot): Promise<void> {
    fs.mkdirSync(path.dirname(this.snapshotPath), { recursive: true });
    fs.writeFileSync(this.snapshotPath, JSON.stringify(snapshot, null, 2), 'utf-8');
  }
}

function isPersistedTrainingSnapshot(
  value: unknown
): value is PersistedTrainingSnapshot {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as Partial<PersistedTrainingSnapshot>;

  return (
    snapshot.version === 1 &&
    snapshot.source === 'intervals.icu' &&
    typeof snapshot.ingestedAt === 'string' &&
    Array.isArray(snapshot.wellnessData) &&
    Array.isArray(snapshot.activitiesRaw) &&
    Array.isArray(snapshot.missionLogs) &&
    Array.isArray(snapshot.errors)
  );
}

