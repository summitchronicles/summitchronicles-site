import { z } from 'zod';

/**
 * Environment variable validation schema
 * Only validates required variables, making build-time optional
 */
const garminSchema = z.object({
  GARMIN_USERNAME: z.string().email('Invalid Garmin email address'),
  GARMIN_PASSWORD: z.string().min(6, 'Garmin password must be at least 6 characters'),
});

/**
 * Lazy validation for Garmin credentials
 * Only validates when accessed, allowing builds to succeed without env vars
 */
class Config {
  private _garminValidated = false;
  private _garminUsername?: string;
  private _garminPassword?: string;

  get GARMIN_USERNAME(): string {
    if (!this._garminValidated) {
      this._validateGarmin();
    }
    return this._garminUsername!;
  }

  get GARMIN_PASSWORD(): string {
    if (!this._garminValidated) {
      this._validateGarmin();
    }
    return this._garminPassword!;
  }

  private _validateGarmin() {
    const parsed = garminSchema.safeParse({
      GARMIN_USERNAME: process.env.GARMIN_USERNAME,
      GARMIN_PASSWORD: process.env.GARMIN_PASSWORD,
    });

    if (!parsed.success) {
      console.error('❌ Invalid Garmin credentials:');
      parsed.error.errors.forEach((err) => {
        console.error(`  ⚠️  ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error(
        'Garmin credentials are required. Please set GARMIN_USERNAME and GARMIN_PASSWORD environment variables.'
      );
    }

    this._garminUsername = parsed.data.GARMIN_USERNAME;
    this._garminPassword = parsed.data.GARMIN_PASSWORD;
    this._garminValidated = true;
  }

  // Direct access to other env vars without validation (for optional vars)
  get NEXT_PUBLIC_SUPABASE_URL() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  get SUPABASE_SERVICE_ROLE_KEY() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  get NEXT_PUBLIC_SANITY_PROJECT_ID() {
    return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  }

  get NEXT_PUBLIC_SANITY_DATASET() {
    return process.env.NEXT_PUBLIC_SANITY_DATASET;
  }

  get SANITY_API_TOKEN() {
    return process.env.SANITY_API_TOKEN;
  }

  get COHERE_API_KEY() {
    return process.env.COHERE_API_KEY;
  }

  get BUTTONDOWN_API_KEY() {
    return process.env.BUTTONDOWN_API_KEY;
  }

  get INTERNAL_API_KEY() {
    return process.env.INTERNAL_API_KEY;
  }

  get SENTRY_DSN() {
    return process.env.SENTRY_DSN;
  }

  get NODE_ENV() {
    return process.env.NODE_ENV || 'development';
  }
}

/**
 * Type-safe environment configuration with lazy validation
 * Garmin credentials are validated only when accessed
 * Other variables are passed through from process.env
 */
export const config = new Config();
