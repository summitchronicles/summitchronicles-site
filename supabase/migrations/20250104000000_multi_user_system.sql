-- Phase 4: Multi-User Training Management System
-- Enables trainers to manage multiple clients with advanced analytics

-- User profiles and roles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'trainer', 'athlete', 'enthusiast')) DEFAULT 'enthusiast',
    
    -- Profile information
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    weight_kg DECIMAL(5,2),
    height_cm INTEGER,
    experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'beginner',
    
    -- Seven Summits specific
    summits_completed INTEGER DEFAULT 0,
    primary_goals TEXT[], -- Array of goals like 'seven_summits', 'everest', 'fitness'
    target_summit TEXT, -- Current target summit
    target_date DATE,
    
    -- Contact and preferences
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    units_preference TEXT CHECK (units_preference IN ('metric', 'imperial')) DEFAULT 'metric',
    
    -- Subscription and access
    subscription_tier TEXT CHECK (subscription_tier IN ('free', 'basic', 'pro', 'enterprise')) DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(auth_user_id)
);

-- Trainer-Client relationships
CREATE TABLE trainer_client_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Relationship details
    status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'paused', 'terminated')) DEFAULT 'pending',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    
    -- Permissions and access
    access_level TEXT NOT NULL CHECK (access_level IN ('view', 'edit', 'full')) DEFAULT 'view',
    can_create_plans BOOLEAN DEFAULT false,
    can_modify_plans BOOLEAN DEFAULT false,
    can_view_progress BOOLEAN DEFAULT true,
    can_send_messages BOOLEAN DEFAULT true,
    
    -- Financial
    monthly_fee DECIMAL(8,2),
    currency TEXT DEFAULT 'USD',
    billing_status TEXT CHECK (billing_status IN ('active', 'overdue', 'cancelled')) DEFAULT 'active',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure no duplicate relationships
    UNIQUE(trainer_id, client_id)
);

-- Training programs and templates
CREATE TABLE training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Program details
    name TEXT NOT NULL,
    description TEXT,
    program_type TEXT NOT NULL CHECK (program_type IN ('template', 'personalized', 'group')),
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    
    -- Seven Summits focus
    target_summit TEXT, -- 'everest', 'denali', 'aconcagua', etc.
    duration_weeks INTEGER NOT NULL,
    focus_areas TEXT[], -- ['strength', 'endurance', 'altitude', 'technical']
    
    -- Program structure
    phases JSONB, -- Detailed phase breakdown
    weekly_structure JSONB, -- Template for weekly planning
    
    -- Sharing and access
    is_public BOOLEAN DEFAULT false,
    is_template BOOLEAN DEFAULT false,
    price DECIMAL(8,2),
    currency TEXT DEFAULT 'USD',
    
    -- Metadata
    tags TEXT[],
    estimated_hours_per_week INTEGER,
    equipment_required TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client assignments to programs
CREATE TABLE client_program_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- The trainer who assigned it
    
    -- Assignment details
    status TEXT NOT NULL CHECK (status IN ('assigned', 'active', 'completed', 'paused', 'cancelled')) DEFAULT 'assigned',
    start_date DATE NOT NULL,
    target_end_date DATE,
    actual_end_date DATE,
    current_week INTEGER DEFAULT 1,
    current_phase TEXT,
    
    -- Customizations
    custom_modifications JSONB, -- Any trainer customizations
    client_notes TEXT,
    trainer_notes TEXT,
    
    -- Progress tracking
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    adherence_score DECIMAL(5,2), -- 0-100 based on completed vs missed sessions
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(client_id, program_id, start_date)
);

-- Advanced analytics and benchmarks
CREATE TABLE performance_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Benchmark details
    benchmark_type TEXT NOT NULL, -- 'vo2_max', 'ftp', 'max_squat', 'pack_weight_endurance'
    test_name TEXT NOT NULL,
    test_date DATE NOT NULL,
    
    -- Results
    primary_value DECIMAL(10,3), -- Main metric (e.g., VO2 max ml/kg/min)
    secondary_value DECIMAL(10,3), -- Supporting metric
    units TEXT,
    
    -- Context
    conditions JSONB, -- Weather, altitude, equipment, etc.
    notes TEXT,
    
    -- Seven Summits relevance
    summit_relevance TEXT[], -- Which summits this benchmark applies to
    predicted_performance JSONB, -- AI predictions based on this benchmark
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training periodization and planning
CREATE TABLE periodization_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- Trainer who created it
    
    -- Plan details
    plan_name TEXT NOT NULL,
    target_summit TEXT,
    target_date DATE NOT NULL,
    total_duration_weeks INTEGER NOT NULL,
    
    -- Periodization structure
    base_phase_weeks INTEGER,
    build_phase_weeks INTEGER,
    peak_phase_weeks INTEGER,
    taper_phase_weeks INTEGER,
    recovery_phase_weeks INTEGER DEFAULT 1,
    
    -- Phase details
    phases JSONB NOT NULL, -- Detailed breakdown of each phase
    
    -- Load management
    base_volume_hours DECIMAL(5,2), -- Weekly hours in base phase
    peak_volume_hours DECIMAL(5,2), -- Weekly hours in peak phase
    load_progression_model TEXT CHECK (load_progression_model IN ('linear', 'undulating', 'block', 'conjugate')) DEFAULT 'linear',
    
    -- AI optimization
    ai_optimized BOOLEAN DEFAULT false,
    optimization_algorithm TEXT,
    predicted_performance JSONB,
    
    status TEXT CHECK (status IN ('draft', 'active', 'completed', 'cancelled')) DEFAULT 'draft',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication and messaging
CREATE TABLE trainer_client_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID REFERENCES trainer_client_relationships(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Message details
    message_type TEXT CHECK (message_type IN ('text', 'voice', 'video', 'file', 'workout_feedback')) DEFAULT 'text',
    subject TEXT,
    content TEXT NOT NULL,
    
    -- Attachments
    attachments JSONB, -- Array of file URLs and metadata
    
    -- Message status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    is_urgent BOOLEAN DEFAULT false,
    
    -- Context
    related_workout_id UUID, -- If related to a specific workout
    related_program_id UUID REFERENCES training_programs(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_auth_user ON user_profiles(auth_user_id);
CREATE INDEX idx_trainer_relationships_trainer ON trainer_client_relationships(trainer_id);
CREATE INDEX idx_trainer_relationships_client ON trainer_client_relationships(client_id);
CREATE INDEX idx_trainer_relationships_status ON trainer_client_relationships(status);
CREATE INDEX idx_training_programs_type ON training_programs(program_type);
CREATE INDEX idx_training_programs_public ON training_programs(is_public) WHERE is_public = true;
CREATE INDEX idx_client_assignments_client ON client_program_assignments(client_id);
CREATE INDEX idx_client_assignments_status ON client_program_assignments(status);
CREATE INDEX idx_performance_benchmarks_user_type ON performance_benchmarks(user_id, benchmark_type);
CREATE INDEX idx_periodization_plans_user ON periodization_plans(user_id);
CREATE INDEX idx_messages_relationship ON trainer_client_messages(relationship_id);
CREATE INDEX idx_messages_unread ON trainer_client_messages(is_read) WHERE is_read = false;

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_client_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_program_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE periodization_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_client_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles - users can see their own profile and profiles of their clients/trainers
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Trainers can view client profiles" ON user_profiles
    FOR SELECT USING (
        id IN (
            SELECT client_id FROM trainer_client_relationships 
            WHERE trainer_id = (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())
            AND status = 'active'
        )
    );

-- Trainer-client relationships
CREATE POLICY "Users can view their relationships" ON trainer_client_relationships
    FOR SELECT USING (
        trainer_id = (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())
        OR client_id = (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())
    );

CREATE POLICY "Trainers can create relationships" ON trainer_client_relationships
    FOR INSERT WITH CHECK (
        trainer_id = (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())
        AND (SELECT role FROM user_profiles WHERE auth_user_id = auth.uid()) IN ('trainer', 'admin')
    );

-- Training programs - public programs visible to all, private to creators and assigned clients
CREATE POLICY "Public programs are visible" ON training_programs
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own programs" ON training_programs
    FOR SELECT USING (created_by = (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Trainers can create programs" ON training_programs
    FOR INSERT WITH CHECK (
        created_by = (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())
        AND (SELECT role FROM user_profiles WHERE auth_user_id = auth.uid()) IN ('trainer', 'admin')
    );

-- Service role access for all tables
CREATE POLICY "Service role full access user_profiles" ON user_profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access relationships" ON trainer_client_relationships FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access programs" ON training_programs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access assignments" ON client_program_assignments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access benchmarks" ON performance_benchmarks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access periodization" ON periodization_plans FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access messages" ON trainer_client_messages FOR ALL USING (auth.role() = 'service_role');

-- Functions for automated calculations

-- Calculate adherence score based on completed vs planned sessions
CREATE OR REPLACE FUNCTION calculate_adherence_score(assignment_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    completed_sessions INTEGER;
    planned_sessions INTEGER;
    adherence DECIMAL;
BEGIN
    -- Get completed strength sessions
    SELECT COUNT(*) INTO completed_sessions
    FROM exercises e
    JOIN strength_days sd ON e.strength_day_id = sd.id
    JOIN training_plans tp ON sd.plan_id = tp.id
    JOIN client_program_assignments cpa ON cpa.program_id::text = tp.id::text -- Simplified join
    WHERE cpa.id = assignment_id AND e.completed = true;
    
    -- Get total planned sessions (simplified calculation)
    SELECT COUNT(*) INTO planned_sessions
    FROM exercises e
    JOIN strength_days sd ON e.strength_day_id = sd.id
    JOIN training_plans tp ON sd.plan_id = tp.id
    JOIN client_program_assignments cpa ON cpa.program_id::text = tp.id::text
    WHERE cpa.id = assignment_id;
    
    IF planned_sessions > 0 THEN
        adherence := (completed_sessions::DECIMAL / planned_sessions::DECIMAL) * 100;
    ELSE
        adherence := 0;
    END IF;
    
    RETURN LEAST(100, adherence);
END;
$$ LANGUAGE plpgsql;

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trainer_relationships_updated_at BEFORE UPDATE ON trainer_client_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_programs_updated_at BEFORE UPDATE ON training_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_assignments_updated_at BEFORE UPDATE ON client_program_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_periodization_plans_updated_at BEFORE UPDATE ON periodization_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();