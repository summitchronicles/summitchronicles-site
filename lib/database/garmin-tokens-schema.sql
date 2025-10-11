-- Garmin OAuth tokens storage
-- Stores access tokens and refresh tokens for Garmin API

CREATE TABLE IF NOT EXISTS garmin_tokens (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) DEFAULT 'sunith', -- For future multi-user support
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_type VARCHAR(20) DEFAULT 'Bearer',
  expires_at TIMESTAMP NOT NULL,
  scope TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for quick token lookup
CREATE INDEX IF NOT EXISTS idx_garmin_tokens_user ON garmin_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_garmin_tokens_expires ON garmin_tokens(expires_at);

-- Function to check if token is still valid
CREATE OR REPLACE FUNCTION is_token_valid(user_id_param VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM garmin_tokens
    WHERE user_id = user_id_param
    AND expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql;
