-- Drop everything and start fresh
DROP TRIGGER IF EXISTS update_training_plans_updated_at ON training_plans;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS training_plans CASCADE;

-- Create training_plans table
CREATE TABLE training_plans (
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

-- Create indexes
CREATE INDEX idx_training_plans_active ON training_plans(is_active) WHERE is_active = true;
CREATE INDEX idx_training_plans_uploaded ON training_plans(uploaded_at DESC);

-- Create update function
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_training_plans_updated_at
  BEFORE UPDATE ON training_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow all operations on training_plans" ON training_plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE training_plans IS 'Stores metadata for uploaded training plan Excel files';

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('workout-files', 'workout-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (drop first if they exist)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow authenticated uploads to workout-files" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated reads from workout-files" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated deletes from workout-files" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

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
