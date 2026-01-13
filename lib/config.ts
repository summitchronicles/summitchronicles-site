import { z } from 'zod';

/**
 * Environment variable validation schema
 * This ensures all required environment variables are present and valid at runtime
 */
const envSchema = z.object({
  // Garmin API Credentials (Required for direct integration)
  GARMIN_USERNAME: z.string().email('Invalid Garmin email address'),
  GARMIN_PASSWORD: z.string().min(6, 'Garmin password must be at least 6 characters'),

  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),

  // Sanity CMS Configuration
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
  SANITY_API_TOKEN: z.string().optional(),

  // AI/RAG Configuration
  COHERE_API_KEY: z.string().optional(),

  // Newsletter
  BUTTONDOWN_API_KEY: z.string().optional(),

  // Security & Monitoring
  INTERNAL_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validates environment variables on application startup
 * @throws {Error} If validation fails
 * @returns Validated and type-safe environment configuration
 */
function validateEnv() {
  const parsed = envSchema.safeParse({
    GARMIN_USERNAME: process.env.GARMIN_USERNAME,
    GARMIN_PASSWORD: process.env.GARMIN_PASSWORD,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
    BUTTONDOWN_API_KEY: process.env.BUTTONDOWN_API_KEY,
    INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    parsed.error.errors.forEach((err) => {
      console.error(`  ⚠️  ${err.path.join('.')}: ${err.message}`);
    });
    throw new Error(
      'Environment configuration validation failed. Please check your .env files and ensure all required variables are set correctly.'
    );
  }

  return parsed.data;
}

/**
 * Type-safe, validated environment configuration
 * Use this throughout the application instead of process.env
 */
export const config = validateEnv();

/**
 * Type for the validated environment configuration
 */
export type Config = z.infer<typeof envSchema>;
