import { z } from 'zod';

const optionalString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().min(1).optional());

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  INTERNAL_API_KEY: optionalString,
  TRAINING_INGEST_SECRET: optionalString,
  ALLOWED_ORIGINS: optionalString,
  TRAINING_STORAGE_BACKEND: z.enum(['local', 'r2']).optional(),
  INTERVALS_ICU_API_KEY: optionalString,
  INTERVALS_ICU_ATHLETE_ID: optionalString,
  WHOOP_CLIENT_ID: optionalString,
  WHOOP_CLIENT_SECRET: optionalString,
  WHOOP_REDIRECT_URI: optionalString,
  WHOOP_TOKEN_ENCRYPTION_KEY: optionalString,
  DATABASE_URL: optionalString,
  CLOUDFLARE_R2_ACCOUNT_ID: optionalString,
  CLOUDFLARE_R2_ACCESS_KEY_ID: optionalString,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: optionalString,
  CLOUDFLARE_R2_BUCKET: optionalString,
  CLOUDFLARE_R2_TRAINING_PREFIX: optionalString,
  NEXT_PUBLIC_SANITY_PROJECT_ID: optionalString,
  NEXT_PUBLIC_SANITY_DATASET: optionalString,
  SANITY_API_TOKEN: optionalString,
  REPLICATE_API_TOKEN: optionalString,
  BUTTONDOWN_API_KEY: optionalString,
  SENTRY_DSN: optionalString,
  VO2_MAX_MANUAL: optionalString,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(
  overrides?: Partial<Record<keyof ServerEnv, string | undefined>>
): ServerEnv {
  if (overrides) {
    return serverEnvSchema.parse({
      ...process.env,
      ...overrides,
    });
  }

  if (!cachedEnv) {
    cachedEnv = serverEnvSchema.parse(process.env);
  }

  return cachedEnv;
}

export function resetServerEnvCache() {
  cachedEnv = null;
}

export function getAllowedOrigins(env: ServerEnv = getServerEnv()): string[] {
  const configuredOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [];

  const defaults =
    env.NODE_ENV === 'production'
      ? ['https://summitchronicles.com']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  return Array.from(new Set([...defaults, ...configuredOrigins]));
}

export function requireIntervalsCredentials(env: ServerEnv = getServerEnv()) {
  const schema = z.object({
    INTERVALS_ICU_API_KEY: z
      .string()
      .min(1, 'INTERVALS_ICU_API_KEY is required'),
    INTERVALS_ICU_ATHLETE_ID: z
      .string()
      .min(1, 'INTERVALS_ICU_ATHLETE_ID is required'),
  });

  return schema.parse({
    INTERVALS_ICU_API_KEY: env.INTERVALS_ICU_API_KEY,
    INTERVALS_ICU_ATHLETE_ID: env.INTERVALS_ICU_ATHLETE_ID,
  });
}

export function requireWhoopCredentials(env: ServerEnv = getServerEnv()) {
  const schema = z.object({
    WHOOP_CLIENT_ID: z.string().min(1, 'WHOOP_CLIENT_ID is required'),
    WHOOP_CLIENT_SECRET: z.string().min(1, 'WHOOP_CLIENT_SECRET is required'),
    WHOOP_REDIRECT_URI: z
      .string()
      .url('WHOOP_REDIRECT_URI must be a valid URL'),
    WHOOP_TOKEN_ENCRYPTION_KEY: z
      .string()
      .min(32, 'WHOOP_TOKEN_ENCRYPTION_KEY must be at least 32 characters'),
    DATABASE_URL: z
      .string()
      .url('DATABASE_URL must be a valid Neon connection URL'),
  });

  return schema.parse({
    WHOOP_CLIENT_ID: env.WHOOP_CLIENT_ID,
    WHOOP_CLIENT_SECRET: env.WHOOP_CLIENT_SECRET,
    WHOOP_REDIRECT_URI: env.WHOOP_REDIRECT_URI,
    WHOOP_TOKEN_ENCRYPTION_KEY: env.WHOOP_TOKEN_ENCRYPTION_KEY,
    DATABASE_URL: env.DATABASE_URL,
  });
}

export function hasTrainingR2Config(env: ServerEnv = getServerEnv()) {
  return Boolean(
    env.CLOUDFLARE_R2_ACCOUNT_ID &&
      env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
      env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
      env.CLOUDFLARE_R2_BUCKET
  );
}

export function getTrainingStorageBackend(
  env: ServerEnv = getServerEnv()
): 'local' | 'r2' {
  if (env.TRAINING_STORAGE_BACKEND) {
    return env.TRAINING_STORAGE_BACKEND;
  }

  return hasTrainingR2Config(env) ? 'r2' : 'local';
}

export function requireTrainingR2Config(env: ServerEnv = getServerEnv()) {
  const schema = z.object({
    CLOUDFLARE_R2_ACCOUNT_ID: z
      .string()
      .min(1, 'CLOUDFLARE_R2_ACCOUNT_ID is required'),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z
      .string()
      .min(1, 'CLOUDFLARE_R2_ACCESS_KEY_ID is required'),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z
      .string()
      .min(1, 'CLOUDFLARE_R2_SECRET_ACCESS_KEY is required'),
    CLOUDFLARE_R2_BUCKET: z.string().min(1, 'CLOUDFLARE_R2_BUCKET is required'),
    CLOUDFLARE_R2_TRAINING_PREFIX: z.string().min(1).default('training'),
  });

  return schema.parse({
    CLOUDFLARE_R2_ACCOUNT_ID: env.CLOUDFLARE_R2_ACCOUNT_ID,
    CLOUDFLARE_R2_ACCESS_KEY_ID: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_BUCKET: env.CLOUDFLARE_R2_BUCKET,
    CLOUDFLARE_R2_TRAINING_PREFIX: env.CLOUDFLARE_R2_TRAINING_PREFIX,
  });
}
