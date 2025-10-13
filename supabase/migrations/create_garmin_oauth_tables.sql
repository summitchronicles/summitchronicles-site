-- Create garmin_oauth_tokens table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS garmin_oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_garmin_oauth_user ON garmin_oauth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_garmin_oauth_expires ON garmin_oauth_tokens(expires_at);

-- Enable RLS
ALTER TABLE garmin_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations on garmin_oauth_tokens" ON garmin_oauth_tokens
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_garmin_oauth_tokens_updated_at
  BEFORE UPDATE ON garmin_oauth_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create garmin_workout_syncs table for tracking sync history
CREATE TABLE IF NOT EXISTS garmin_workout_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  workout_name TEXT NOT NULL,
  garmin_workout_id BIGINT,
  scheduled BOOLEAN DEFAULT false,
  sync_status TEXT NOT NULL, -- 'created', 'scheduled', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_garmin_syncs_plan ON garmin_workout_syncs(training_plan_id);
CREATE INDEX IF NOT EXISTS idx_garmin_syncs_date ON garmin_workout_syncs(date);
CREATE INDEX IF NOT EXISTS idx_garmin_syncs_status ON garmin_workout_syncs(sync_status);
CREATE INDEX IF NOT EXISTS idx_garmin_syncs_workout_id ON garmin_workout_syncs(garmin_workout_id);

-- Enable RLS
ALTER TABLE garmin_workout_syncs ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations on garmin_workout_syncs" ON garmin_workout_syncs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_garmin_workout_syncs_updated_at
  BEFORE UPDATE ON garmin_workout_syncs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE garmin_oauth_tokens IS 'Stores OAuth tokens for Garmin Connect API access';
COMMENT ON TABLE garmin_workout_syncs IS 'Tracks workout sync history with Garmin Connect';
