-- Create training_plans table to store uploaded workout plans
CREATE TABLE IF NOT EXISTS training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  week_number INTEGER,
  start_date DATE,
  is_active BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  workout_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_training_plans_active ON training_plans(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_training_plans_uploaded ON training_plans(uploaded_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_training_plans_updated_at ON training_plans;
CREATE TRIGGER update_training_plans_updated_at
  BEFORE UPDATE ON training_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations on training_plans" ON training_plans;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on training_plans" ON training_plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE training_plans IS 'Stores metadata for uploaded training plan Excel files';

-- Create storage bucket for workout files (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('workout-files', 'workout-files', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads to workout-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads from workout-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from workout-files" ON storage.objects;

-- Create storage policies
CREATE POLICY "Allow authenticated uploads to workout-files"
ON storage.objects FOR INSERT
TO authenticated, anon, service_role
WITH CHECK (bucket_id = 'workout-files');

CREATE POLICY "Allow authenticated reads from workout-files"
ON storage.objects FOR SELECT
TO authenticated, anon, service_role
USING (bucket_id = 'workout-files');

CREATE POLICY "Allow authenticated deletes from workout-files"
ON storage.objects FOR DELETE
TO authenticated, anon, service_role
USING (bucket_id = 'workout-files');
