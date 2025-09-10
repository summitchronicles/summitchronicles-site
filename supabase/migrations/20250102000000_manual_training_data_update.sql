-- Add additional columns to manual_training_data table
-- for comprehensive activity tracking

ALTER TABLE manual_training_data
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
ADD COLUMN IF NOT EXISTS distance_km DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS elevation_gain_m INTEGER,
ADD COLUMN IF NOT EXISTS perceived_effort DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS location TEXT;

-- Update the unique constraint to allow multiple activities per day
-- but still prevent exact duplicates
DROP INDEX IF EXISTS manual_training_data_date_activity_type_key;
CREATE UNIQUE INDEX manual_training_data_unique_entry 
ON manual_training_data(date, activity_type, COALESCE(location, ''));

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_manual_training_data_perceived_effort 
ON manual_training_data(perceived_effort);

CREATE INDEX IF NOT EXISTS idx_manual_training_data_duration 
ON manual_training_data(duration_minutes);

-- Update RLS policy to include service role access
CREATE POLICY IF NOT EXISTS "Enable all operations for service role" ON manual_training_data
    FOR ALL USING (auth.role() = 'service_role');