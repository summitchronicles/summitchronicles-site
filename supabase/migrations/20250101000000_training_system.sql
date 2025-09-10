-- Training System Database Schema
-- Phase 1: Foundation tables for manual training data

-- Weekly training plans (uploaded from Excel)
CREATE TABLE training_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL, -- "Week 2: Increasing Volume & Intensity"
    week_number INTEGER,
    start_date DATE,
    end_date DATE,
    file_name TEXT, -- Original Excel file name
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Strength training days (from "Sunith's WP" sheet)
CREATE TABLE strength_days (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    day_name TEXT NOT NULL, -- "Monday", "Tuesday", etc.
    session_type TEXT NOT NULL, -- "Lower Body Strength & Stability"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual exercises within strength days
CREATE TABLE exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strength_day_id UUID REFERENCES strength_days(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL, -- 1, 2, 3, 4, 5
    name TEXT NOT NULL, -- "Split Squats (Rear Foot Elevated) with Dumbbells"
    planned_sets INTEGER,
    planned_reps TEXT, -- "8-10 per leg", "15", etc.
    planned_rpe DECIMAL(3,1), -- 7, 7.5, 8, etc.
    remarks TEXT,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT, -- User notes after completing
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Actual sets performed (manual logging during workout)
CREATE TABLE actual_sets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    reps_completed INTEGER,
    weight_used DECIMAL(5,2), -- Weight in kg
    actual_rpe DECIMAL(3,1), -- Actual RPE 1-10
    notes TEXT, -- Per-set notes
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cardio training days (from "Week Plan" sheet)
CREATE TABLE cardio_days (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE,
    day_name TEXT NOT NULL, -- "Monday", "Tuesday", etc.
    session_type TEXT NOT NULL, -- "Recovery Jog + Mobility"
    planned_duration TEXT, -- "45–50 min"
    planned_distance TEXT, -- "5–6 km"
    pace_target TEXT, -- "Easy: 7:45–8:15 /km"
    hr_target TEXT, -- "Z1–low Z2 (120–140 bpm)"
    cadence_cue TEXT,
    warmup TEXT,
    main_set TEXT,
    cooldown TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manual training data (non-Strava metrics)
CREATE TABLE manual_training_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    activity_type TEXT NOT NULL, -- "hiking", "strength", "other"
    
    -- Hiking specific (backpack weight)
    backpack_weight_kg DECIMAL(4,1), -- Manual input for hiking
    
    -- Strength specific (if not linked to formal plan)
    total_volume_kg DECIMAL(8,2), -- Total weight lifted
    session_duration_minutes INTEGER,
    
    -- General
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Optional link to formal training plan
    strength_day_id UUID REFERENCES strength_days(id) ON DELETE SET NULL,
    
    UNIQUE(date, activity_type) -- One entry per activity type per day
);

-- Fuel and safeguards (from "Fuel & Safeguards" sheet)
CREATE TABLE training_guidelines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE,
    topic TEXT NOT NULL, -- "Carb Targets", "Hydration", etc.
    guideline TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_training_plans_week_number ON training_plans(week_number);
CREATE INDEX idx_training_plans_start_date ON training_plans(start_date);
CREATE INDEX idx_strength_days_plan_date ON strength_days(plan_id, date);
CREATE INDEX idx_exercises_strength_day_sequence ON exercises(strength_day_id, sequence);
CREATE INDEX idx_actual_sets_exercise_set ON actual_sets(exercise_id, set_number);
CREATE INDEX idx_manual_training_data_date ON manual_training_data(date);
CREATE INDEX idx_manual_training_data_activity_type ON manual_training_data(activity_type);

-- Row Level Security (RLS) - Only you can access your training data
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE strength_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE actual_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_guidelines ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow full access for now, can be refined later)
CREATE POLICY "Enable all operations for authenticated users" ON training_plans
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON strength_days
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON exercises
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON actual_sets
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON cardio_days
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON manual_training_data
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON training_guidelines
    FOR ALL USING (auth.role() = 'authenticated');

-- Updated at trigger for training_plans
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_training_plans_updated_at 
    BEFORE UPDATE ON training_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();