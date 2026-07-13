import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error(
    'DATABASE_URL is required. Add the Neon connection string to .env.local.'
  );
  process.exit(1);
}

const sql = neon(databaseUrl);

await sql`
  CREATE TABLE IF NOT EXISTS fitness_oauth_connections (
    provider TEXT PRIMARY KEY,
    provider_user_id TEXT NOT NULL,
    display_name TEXT,
    access_token_encrypted TEXT NOT NULL,
    refresh_token_encrypted TEXT NOT NULL,
    token_type TEXT NOT NULL DEFAULT 'bearer',
    scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fitness_oauth_provider_check CHECK (provider IN ('whoop')),
    CONSTRAINT fitness_oauth_scopes_array_check
      CHECK (jsonb_typeof(scopes) = 'array')
  )
`;

await sql`
  COMMENT ON TABLE fitness_oauth_connections IS
    'AES-encrypted owner-authorized fitness OAuth credentials.'
`;

await sql`
  DELETE FROM fitness_oauth_connections WHERE provider = 'strava'
`;

await sql`
  ALTER TABLE fitness_oauth_connections
    DROP CONSTRAINT IF EXISTS fitness_oauth_provider_check
`;

await sql`
  ALTER TABLE fitness_oauth_connections
    ADD CONSTRAINT fitness_oauth_provider_check
    CHECK (provider IN ('whoop'))
`;

console.log('Neon WHOOP OAuth token storage is ready.');
