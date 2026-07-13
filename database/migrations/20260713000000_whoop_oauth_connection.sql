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
);

COMMENT ON TABLE fitness_oauth_connections IS
  'AES-encrypted owner-authorized fitness OAuth credentials.';
