import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getServerEnv, getTrainingStorageBackend, requireTrainingR2Config } from '@/shared/env/server';
import type {
  TrainingDashboardResponse,
  TrainingInsight,
} from '@/modules/training/domain/training-dashboard';

export interface PersistedTrainingSnapshot {
  version: 1;
  source: 'intervals.icu';
  ingestedAt: string;
  wellnessData: unknown[];
  activitiesRaw: unknown[];
  missionLogs: TrainingInsight[];
  errors: string[];
}

export interface PersistedTrainingSummaryArtifact {
  version: 1;
  generatedAt: string;
  response: TrainingDashboardResponse;
}

export interface PersistedTrainingStatusArtifact {
  version: 1;
  source: 'intervals.icu' | 'fallback';
  state: 'live' | 'stale' | 'degraded' | 'auth_failed';
  lastAttemptAt: string;
  lastSuccessAt: string | null;
  latestActivityAt: string | null;
  lastError: string | null;
  errors: string[];
  backend: 'local' | 'r2';
}

export interface TrainingSnapshotStore {
  readSnapshot(): Promise<PersistedTrainingSnapshot | null>;
  writeSnapshot(snapshot: PersistedTrainingSnapshot): Promise<void>;
}

export interface TrainingArtifactStore extends TrainingSnapshotStore {
  getBackend(): 'local' | 'r2';
  readSummary(): Promise<PersistedTrainingSummaryArtifact | null>;
  writeSummary(summary: PersistedTrainingSummaryArtifact): Promise<void>;
  readStatus(): Promise<PersistedTrainingStatusArtifact | null>;
  writeStatus(status: PersistedTrainingStatusArtifact): Promise<void>;
}

interface FileTrainingSnapshotStoreOptions {
  snapshotPath?: string;
  summaryPath?: string;
  statusPath?: string;
  archiveDir?: string;
}

const DEFAULT_DATA_DIR = path.join(process.cwd(), 'data', 'training');
const DEFAULT_SNAPSHOT_PATH = path.join(
  DEFAULT_DATA_DIR,
  'intervals-snapshot.json'
);
const DEFAULT_SUMMARY_PATH = path.join(DEFAULT_DATA_DIR, 'latest-summary.json');
const DEFAULT_STATUS_PATH = path.join(DEFAULT_DATA_DIR, 'latest-status.json');
const DEFAULT_ARCHIVE_DIR = path.join(DEFAULT_DATA_DIR, 'archive');

export class FileTrainingSnapshotStore implements TrainingArtifactStore {
  private readonly snapshotPath: string;
  private readonly summaryPath: string;
  private readonly statusPath: string;
  private readonly archiveDir: string;

  constructor(options: FileTrainingSnapshotStoreOptions = {}) {
    this.snapshotPath = options.snapshotPath ?? DEFAULT_SNAPSHOT_PATH;
    this.summaryPath = options.summaryPath ?? DEFAULT_SUMMARY_PATH;
    this.statusPath = options.statusPath ?? DEFAULT_STATUS_PATH;
    this.archiveDir = options.archiveDir ?? DEFAULT_ARCHIVE_DIR;
  }

  getBackend(): 'local' | 'r2' {
    return 'local';
  }

  async readSnapshot(): Promise<PersistedTrainingSnapshot | null> {
    return readJsonFile(this.snapshotPath, isPersistedTrainingSnapshot);
  }

  async writeSnapshot(snapshot: PersistedTrainingSnapshot): Promise<void> {
    writeJsonFile(this.snapshotPath, snapshot);
    writeJsonFile(
      path.join(this.archiveDir, `${toFilesystemTimestamp(snapshot.ingestedAt)}.json`),
      snapshot
    );
  }

  async readSummary(): Promise<PersistedTrainingSummaryArtifact | null> {
    return readJsonFile(this.summaryPath, isPersistedTrainingSummaryArtifact);
  }

  async writeSummary(summary: PersistedTrainingSummaryArtifact): Promise<void> {
    writeJsonFile(this.summaryPath, summary);
  }

  async readStatus(): Promise<PersistedTrainingStatusArtifact | null> {
    return readJsonFile(this.statusPath, isPersistedTrainingStatusArtifact);
  }

  async writeStatus(status: PersistedTrainingStatusArtifact): Promise<void> {
    writeJsonFile(this.statusPath, status);
  }
}

interface R2TrainingArtifactStoreOptions {
  bucket?: string;
  prefix?: string;
  client?: S3Client;
}

export class R2TrainingArtifactStore implements TrainingArtifactStore {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly prefix: string;

  constructor(options: R2TrainingArtifactStoreOptions = {}) {
    const env = requireTrainingR2Config();

    this.bucket = options.bucket ?? env.CLOUDFLARE_R2_BUCKET;
    this.prefix = sanitizePrefix(
      options.prefix ?? env.CLOUDFLARE_R2_TRAINING_PREFIX ?? 'training'
    );
    this.client =
      options.client ??
      new S3Client({
        region: 'auto',
        endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
          secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        },
      });
  }

  getBackend(): 'local' | 'r2' {
    return 'r2';
  }

  async readSnapshot(): Promise<PersistedTrainingSnapshot | null> {
    return this.readArtifact(
      this.key('raw/latest.json'),
      isPersistedTrainingSnapshot
    );
  }

  async writeSnapshot(snapshot: PersistedTrainingSnapshot): Promise<void> {
    await this.writeArtifact(this.key('raw/latest.json'), snapshot);
    await this.writeArtifact(
      this.key(
        `raw/archive/${snapshot.ingestedAt.slice(0, 10).replaceAll('-', '/')}/${toFilesystemTimestamp(snapshot.ingestedAt)}.json`
      ),
      snapshot
    );
  }

  async readSummary(): Promise<PersistedTrainingSummaryArtifact | null> {
    return this.readArtifact(
      this.key('derived/latest-summary.json'),
      isPersistedTrainingSummaryArtifact
    );
  }

  async writeSummary(summary: PersistedTrainingSummaryArtifact): Promise<void> {
    await this.writeArtifact(this.key('derived/latest-summary.json'), summary);
  }

  async readStatus(): Promise<PersistedTrainingStatusArtifact | null> {
    return this.readArtifact(
      this.key('status/latest.json'),
      isPersistedTrainingStatusArtifact
    );
  }

  async writeStatus(status: PersistedTrainingStatusArtifact): Promise<void> {
    await this.writeArtifact(this.key('status/latest.json'), status);
  }

  private key(suffix: string) {
    return `${this.prefix}/${suffix}`;
  }

  private async readArtifact<T>(
    key: string,
    guard: (value: unknown) => value is T
  ): Promise<T | null> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );

      if (!response.Body) {
        return null;
      }

      const content = await bodyToString(response.Body);
      const parsed = JSON.parse(content);
      return guard(parsed) ? parsed : null;
    } catch (error) {
      if (isMissingObjectError(error)) {
        return null;
      }

      console.error(`Failed to read training artifact ${key}:`, error);
      return null;
    }
  }

  private async writeArtifact(key: string, artifact: unknown): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: JSON.stringify(artifact, null, 2),
        ContentType: 'application/json',
      })
    );
  }
}

let cachedArtifactStore: TrainingArtifactStore | null = null;

export function getTrainingArtifactStore(): TrainingArtifactStore {
  if (cachedArtifactStore) {
    return cachedArtifactStore;
  }

  const env = getServerEnv();
  const backend = getTrainingStorageBackend(env);
  cachedArtifactStore =
    backend === 'r2' ? new R2TrainingArtifactStore() : new FileTrainingSnapshotStore();

  return cachedArtifactStore;
}

export function resetTrainingArtifactStoreCache() {
  cachedArtifactStore = null;
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

function isPersistedTrainingSummaryArtifact(
  value: unknown
): value is PersistedTrainingSummaryArtifact {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const artifact = value as Partial<PersistedTrainingSummaryArtifact>;

  return (
    artifact.version === 1 &&
    typeof artifact.generatedAt === 'string' &&
    Boolean(artifact.response && typeof artifact.response === 'object')
  );
}

function isPersistedTrainingStatusArtifact(
  value: unknown
): value is PersistedTrainingStatusArtifact {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const artifact = value as Partial<PersistedTrainingStatusArtifact>;

  return (
    artifact.version === 1 &&
    (artifact.source === 'intervals.icu' || artifact.source === 'fallback') &&
    (artifact.state === 'live' ||
      artifact.state === 'stale' ||
      artifact.state === 'degraded' ||
      artifact.state === 'auth_failed') &&
    typeof artifact.lastAttemptAt === 'string' &&
    (artifact.lastSuccessAt === null || typeof artifact.lastSuccessAt === 'string') &&
    (artifact.latestActivityAt === null ||
      typeof artifact.latestActivityAt === 'string') &&
    (artifact.lastError === null || typeof artifact.lastError === 'string') &&
    Array.isArray(artifact.errors) &&
    (artifact.backend === 'local' || artifact.backend === 'r2')
  );
}

function readJsonFile<T>(
  filePath: string,
  guard: (value: unknown) => value is T
): T | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    return guard(parsed) ? parsed : null;
  } catch (error) {
    console.error(`Failed to read training artifact ${filePath}:`, error);
    return null;
  }
}

function writeJsonFile(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
}

function toFilesystemTimestamp(isoDate: string) {
  return isoDate.replaceAll(':', '-');
}

function sanitizePrefix(prefix: string) {
  return prefix.replace(/^\/+|\/+$/g, '');
}

async function bodyToString(body: unknown): Promise<string> {
  if (typeof body === 'string') {
    return body;
  }

  if (body && typeof body === 'object' && 'transformToString' in body) {
    const transformToString = body.transformToString;
    if (typeof transformToString === 'function') {
      return transformToString.call(body);
    }
  }

  if (body instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of body) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }
    return Buffer.concat(chunks).toString('utf-8');
  }

  throw new Error('Unsupported training artifact body type');
}

function isMissingObjectError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const candidate = error as {
    name?: string;
    Code?: string;
    $metadata?: { httpStatusCode?: number };
  };

  return (
    candidate.name === 'NoSuchKey' ||
    candidate.Code === 'NoSuchKey' ||
    candidate.$metadata?.httpStatusCode === 404
  );
}
