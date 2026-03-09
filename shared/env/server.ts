import { z } from 'zod';

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  },
  z.string().min(1).optional()
);

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  INTERNAL_API_KEY: optionalString,
  ALLOWED_ORIGINS: optionalString,
  GARMIN_USERNAME: optionalString,
  GARMIN_PASSWORD: optionalString,
  INTERVALS_ICU_API_KEY: optionalString,
  INTERVALS_ICU_ATHLETE_ID: optionalString,
  NEXT_PUBLIC_SUPABASE_URL: optionalString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
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

export function getServerEnv(overrides?: Partial<Record<keyof ServerEnv, string | undefined>>): ServerEnv {
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
    ? env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];

  const defaults =
    env.NODE_ENV === 'production'
      ? ['https://summitchronicles.com']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  return Array.from(new Set([...defaults, ...configuredOrigins]));
}

export function requireGarminCredentials(env: ServerEnv = getServerEnv()) {
  const schema = z.object({
    GARMIN_USERNAME: z.string().email('Invalid Garmin email address'),
    GARMIN_PASSWORD: z
      .string()
      .min(6, 'Garmin password must be at least 6 characters'),
  });

  return schema.parse({
    GARMIN_USERNAME: env.GARMIN_USERNAME,
    GARMIN_PASSWORD: env.GARMIN_PASSWORD,
  });
}

export function requireIntervalsCredentials(env: ServerEnv = getServerEnv()) {
  const schema = z.object({
    INTERVALS_ICU_API_KEY: z.string().min(1, 'INTERVALS_ICU_API_KEY is required'),
    INTERVALS_ICU_ATHLETE_ID: z
      .string()
      .min(1, 'INTERVALS_ICU_ATHLETE_ID is required'),
  });

  return schema.parse({
    INTERVALS_ICU_API_KEY: env.INTERVALS_ICU_API_KEY,
    INTERVALS_ICU_ATHLETE_ID: env.INTERVALS_ICU_ATHLETE_ID,
  });
}
