import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface CachedEmbedding {
  contentHash: string;
  embedding: number[];
  updatedAt: string;
}

interface EmbeddingCache {
  [documentId: string]: CachedEmbedding;
}

const CACHE_FILE_PATH = path.join(
  process.cwd(),
  'generated',
  'embeddings-cache.json'
);

// Ensure generated directory exists
if (!fs.existsSync(path.dirname(CACHE_FILE_PATH))) {
  fs.mkdirSync(path.dirname(CACHE_FILE_PATH), { recursive: true });
}

/**
 * Calculate MD5 hash of content to detect changes
 */
export function calculateContentHash(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Load the embedding cache from disk
 */
export function loadCache(): EmbeddingCache {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Failed to load embedding cache:', error);
  }
  return {};
}

/**
 * Save the embedding cache to disk
 */
export function saveCache(cache: EmbeddingCache): void {
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Failed to save embedding cache:', error);
  }
}

/**
 * Get cached embedding if it exists and matches content hash
 */
export function getCachedEmbedding(
  cache: EmbeddingCache,
  documentId: string,
  content: string
): number[] | null {
  const cached = cache[documentId];
  if (!cached) return null;

  const currentHash = calculateContentHash(content);
  if (cached.contentHash !== currentHash) return null;

  return cached.embedding;
}

/**
 * Update the cache with a new embedding
 */
export function updateCache(
  cache: EmbeddingCache,
  documentId: string,
  content: string,
  embedding: number[]
): void {
  cache[documentId] = {
    contentHash: calculateContentHash(content),
    embedding,
    updatedAt: new Date().toISOString(),
  };
}
