-- Enhanced Strava Integration Schema
-- Adds categorization and training analysis capabilities

-- Enhanced Strava activities table with training categorization
CREATE TABLE strava_activities_enhanced (
    id BIGINT PRIMARY KEY, -- Strava activity ID
    name TEXT NOT NULL,
    sport_type TEXT NOT NULL,
    category TEXT NOT NULL, -- 'cardio', 'strength', 'hiking', 'climbing', 'cycling', 'recovery', 'other'
    
    -- Basic metrics
    distance DECIMAL(10,2) DEFAULT 0, -- meters
    moving_time INTEGER DEFAULT 0, -- seconds
    total_elevation_gain INTEGER DEFAULT 0, -- meters
    start_date TIMESTAMPTZ NOT NULL,
    
    -- Performance metrics
    average_speed DECIMAL(6,2), -- m/s
    max_speed DECIMAL(6,2), -- m/s
    average_heartrate INTEGER,
    max_heartrate INTEGER,
    suffer_score INTEGER, -- Strava's intensity metric
    workout_type INTEGER, -- Strava workout type
    
    -- Enhanced analysis
    training_intensity TEXT CHECK (training_intensity IN ('easy', 'moderate', 'hard', 'recovery')),
    estimated_rpe DECIMAL(3,1) CHECK (estimated_rpe >= 1 AND estimated_rpe <= 10),
    
    -- Metadata
    description TEXT,
    gear_id TEXT,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity insights aggregation table for performance
CREATE TABLE training_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    period_type TEXT NOT NULL CHECK (period_type IN ('day', 'week', 'month')), -- 'day', 'week', 'month'
    
    -- Activity counts by category
    cardio_activities INTEGER DEFAULT 0,
    strength_activities INTEGER DEFAULT 0,
    hiking_activities INTEGER DEFAULT 0,
    climbing_activities INTEGER DEFAULT 0,
    cycling_activities INTEGER DEFAULT 0,
    recovery_activities INTEGER DEFAULT 0,
    manual_activities INTEGER DEFAULT 0,
    
    -- Volume metrics
    total_distance_km DECIMAL(8,2) DEFAULT 0,
    total_time_hours DECIMAL(6,2) DEFAULT 0,
    total_elevation_m INTEGER DEFAULT 0,
    
    -- Intensity metrics
    avg_rpe DECIMAL(3,1),
    max_rpe DECIMAL(3,1),
    avg_heart_rate INTEGER,
    total_suffer_score INTEGER,
    
    -- Load metrics (for Seven Summits training)
    avg_backpack_weight_kg DECIMAL(4,1),
    max_backpack_weight_kg DECIMAL(4,1),
    
    -- Data sources
    strava_activities_count INTEGER DEFAULT 0,
    manual_activities_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(date, period_type)
);

-- Duplicate detection table for data quality
CREATE TABLE activity_duplicates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strava_activity_id BIGINT REFERENCES strava_activities_enhanced(id),
    manual_activity_id UUID REFERENCES manual_training_data(id),
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'confirmed', 'dismissed')),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_strava_enhanced_category ON strava_activities_enhanced(category);
CREATE INDEX idx_strava_enhanced_start_date ON strava_activities_enhanced(start_date);
CREATE INDEX idx_strava_enhanced_intensity ON strava_activities_enhanced(training_intensity);
CREATE INDEX idx_training_insights_date_period ON training_insights(date, period_type);
CREATE INDEX idx_activity_duplicates_status ON activity_duplicates(status);
CREATE INDEX idx_activity_duplicates_confidence ON activity_duplicates(confidence_score);

-- Row Level Security
ALTER TABLE strava_activities_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_duplicates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable all operations for authenticated users" ON strava_activities_enhanced
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for service role" ON strava_activities_enhanced
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all operations for authenticated users" ON training_insights
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for service role" ON training_insights
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all operations for authenticated users" ON activity_duplicates
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for service role" ON activity_duplicates
    FOR ALL USING (auth.role() = 'service_role');

-- Function to automatically update training insights
CREATE OR REPLACE FUNCTION update_training_insights()
RETURNS TRIGGER AS $$
BEGIN
    -- Update daily insights when activities are added/modified
    INSERT INTO training_insights (
        date, 
        period_type,
        cardio_activities,
        strength_activities,
        hiking_activities,
        climbing_activities,
        cycling_activities,
        recovery_activities,
        total_distance_km,
        total_time_hours,
        total_elevation_m,
        avg_rpe,
        max_rpe,
        strava_activities_count
    )
    SELECT 
        DATE(start_date) as date,
        'day' as period_type,
        COUNT(*) FILTER (WHERE category = 'cardio') as cardio_activities,
        COUNT(*) FILTER (WHERE category = 'strength') as strength_activities,
        COUNT(*) FILTER (WHERE category = 'hiking') as hiking_activities,
        COUNT(*) FILTER (WHERE category = 'climbing') as climbing_activities,
        COUNT(*) FILTER (WHERE category = 'cycling') as cycling_activities,
        COUNT(*) FILTER (WHERE category = 'recovery') as recovery_activities,
        ROUND(SUM(distance / 1000.0)::numeric, 2) as total_distance_km,
        ROUND((SUM(moving_time) / 3600.0)::numeric, 2) as total_time_hours,
        SUM(total_elevation_gain) as total_elevation_m,
        ROUND(AVG(estimated_rpe)::numeric, 1) as avg_rpe,
        MAX(estimated_rpe) as max_rpe,
        COUNT(*) as strava_activities_count
    FROM strava_activities_enhanced 
    WHERE DATE(start_date) = DATE(NEW.start_date)
    GROUP BY DATE(start_date)
    ON CONFLICT (date, period_type) 
    DO UPDATE SET
        cardio_activities = EXCLUDED.cardio_activities,
        strength_activities = EXCLUDED.strength_activities,
        hiking_activities = EXCLUDED.hiking_activities,
        climbing_activities = EXCLUDED.climbing_activities,
        cycling_activities = EXCLUDED.cycling_activities,
        recovery_activities = EXCLUDED.recovery_activities,
        total_distance_km = EXCLUDED.total_distance_km,
        total_time_hours = EXCLUDED.total_time_hours,
        total_elevation_m = EXCLUDED.total_elevation_m,
        avg_rpe = EXCLUDED.avg_rpe,
        max_rpe = EXCLUDED.max_rpe,
        strava_activities_count = EXCLUDED.strava_activities_count,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update insights automatically
CREATE TRIGGER trigger_update_training_insights
    AFTER INSERT OR UPDATE ON strava_activities_enhanced
    FOR EACH ROW
    EXECUTE FUNCTION update_training_insights();

-- Function to update insights from manual training data
CREATE OR REPLACE FUNCTION update_manual_training_insights()
RETURNS TRIGGER AS $$
BEGIN
    -- Update daily insights when manual activities are added/modified
    INSERT INTO training_insights (
        date, 
        period_type,
        manual_activities,
        avg_backpack_weight_kg,
        max_backpack_weight_kg,
        manual_activities_count
    )
    SELECT 
        date,
        'day' as period_type,
        COUNT(*) as manual_activities,
        ROUND(AVG(backpack_weight_kg)::numeric, 1) as avg_backpack_weight_kg,
        MAX(backpack_weight_kg) as max_backpack_weight_kg,
        COUNT(*) as manual_activities_count
    FROM manual_training_data 
    WHERE date = NEW.date
    GROUP BY date
    ON CONFLICT (date, period_type) 
    DO UPDATE SET
        manual_activities = EXCLUDED.manual_activities,
        avg_backpack_weight_kg = EXCLUDED.avg_backpack_weight_kg,
        max_backpack_weight_kg = EXCLUDED.max_backpack_weight_kg,
        manual_activities_count = EXCLUDED.manual_activities_count,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for manual training data
CREATE TRIGGER trigger_update_manual_training_insights
    AFTER INSERT OR UPDATE ON manual_training_data
    FOR EACH ROW
    EXECUTE FUNCTION update_manual_training_insights();