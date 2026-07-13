ALTER TABLE fitness_oauth_connections
  DROP CONSTRAINT IF EXISTS fitness_oauth_provider_check;

ALTER TABLE fitness_oauth_connections
  ADD CONSTRAINT fitness_oauth_provider_check
  CHECK (provider IN ('whoop', 'strava'));
