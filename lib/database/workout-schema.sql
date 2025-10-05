-- Workout database schema for AI training analysis
-- This schema supports both historical Excel uploads and real-time Garmin sync

-- Historical workouts from Excel uploads
CREATE TABLE IF NOT EXISTS historical_workouts (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  planned_duration INTEGER, -- minutes
  actual_duration INTEGER, -- minutes
  exercise_type VARCHAR(50) NOT NULL, -- 'cardio', 'strength', 'climbing', 'rest'
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  completion_rate DECIMAL(5,2), -- percentage (0-100)
  notes TEXT,
  elevation_gain INTEGER, -- meters
  distance DECIMAL(10,2), -- kilometers
  heart_rate_avg INTEGER, -- bpm
  calories_burned INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  source VARCHAR(20) DEFAULT 'excel' -- 'excel' or 'garmin'
);

-- Real-time Garmin workouts
CREATE TABLE IF NOT EXISTS garmin_workouts (
  id SERIAL PRIMARY KEY,
  garmin_activity_id BIGINT UNIQUE NOT NULL,
  date DATE NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  duration INTEGER NOT NULL, -- seconds
  distance DECIMAL(10,2), -- meters
  elevation_gain INTEGER, -- meters
  avg_heart_rate INTEGER, -- bpm
  max_heart_rate INTEGER, -- bpm
  calories INTEGER,
  avg_speed DECIMAL(8,2), -- m/s
  max_speed DECIMAL(8,2), -- m/s
  training_stress_score INTEGER,
  normalized_power INTEGER,
  activity_name VARCHAR(255),
  description TEXT,
  location_name VARCHAR(255),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  source VARCHAR(20) DEFAULT 'garmin'
);

-- AI-generated training insights
CREATE TABLE IF NOT EXISTS training_insights (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) DEFAULT 'sunith', -- For future multi-user support
  insight_type VARCHAR(50) NOT NULL, -- 'weekly', 'monthly', 'progress', 'recommendation'
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  insight_text TEXT NOT NULL,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  metadata JSONB, -- Additional structured data
  created_at TIMESTAMP DEFAULT NOW()
);

-- Training goals and targets
CREATE TABLE IF NOT EXISTS training_goals (
  id SERIAL PRIMARY KEY,
  goal_type VARCHAR(50) NOT NULL, -- 'expedition', 'fitness', 'skill'
  target_date DATE,
  description TEXT NOT NULL,
  target_metrics JSONB, -- Flexible goal metrics
  current_progress DECIMAL(5,2) DEFAULT 0, -- percentage
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workout plans (for comparing planned vs actual)
CREATE TABLE IF NOT EXISTS workout_plans (
  id SERIAL PRIMARY KEY,
  week_start_date DATE NOT NULL,
  planned_sessions JSONB NOT NULL, -- Array of planned workout sessions
  actual_completion_rate DECIMAL(5,2), -- Calculated from actual workouts
  ai_recommendations TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- AI usage tracking for abuse prevention
CREATE TABLE IF NOT EXISTS ai_usage_tracking (
  id SERIAL PRIMARY KEY,
  ip_address INET,
  user_agent TEXT,
  endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER DEFAULT 1,
  last_request TIMESTAMP DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT FALSE,
  block_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_historical_workouts_date ON historical_workouts(date);
CREATE INDEX IF NOT EXISTS idx_historical_workouts_type ON historical_workouts(exercise_type);
CREATE INDEX IF NOT EXISTS idx_garmin_workouts_date ON garmin_workouts(date);
CREATE INDEX IF NOT EXISTS idx_garmin_workouts_activity_id ON garmin_workouts(garmin_activity_id);
CREATE INDEX IF NOT EXISTS idx_training_insights_date_range ON training_insights(date_range_start, date_range_end);
CREATE INDEX IF NOT EXISTS idx_ai_usage_ip ON ai_usage_tracking(ip_address);
CREATE INDEX IF NOT EXISTS idx_ai_usage_last_request ON ai_usage_tracking(last_request);

-- Views for easy querying
CREATE OR REPLACE VIEW weekly_workout_summary AS
SELECT
  DATE_TRUNC('week', date) as week_start,
  COUNT(*) as total_workouts,
  AVG(actual_duration) as avg_duration,
  AVG(intensity) as avg_intensity,
  AVG(completion_rate) as avg_completion_rate,
  SUM(elevation_gain) as total_elevation,
  SUM(distance) as total_distance
FROM historical_workouts
WHERE date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', date)
ORDER BY week_start DESC;

CREATE OR REPLACE VIEW recent_training_trends AS
SELECT
  exercise_type,
  COUNT(*) as workout_count,
  AVG(intensity) as avg_intensity,
  AVG(completion_rate) as avg_completion_rate,
  MAX(date) as last_workout_date
FROM historical_workouts
WHERE date >= CURRENT_DATE - INTERVAL '4 weeks'
GROUP BY exercise_type
ORDER BY workout_count DESC;