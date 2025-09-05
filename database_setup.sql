-- Additional tables for Summit Chronicles analytics and integrations
-- Run this after the blog_schema.sql

-- Analytics Sessions Table
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(10),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    referrer TEXT,
    landing_page VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Page Views Table
CREATE TABLE IF NOT EXISTS analytics_page_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES analytics_sessions(id) ON DELETE CASCADE,
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    duration_ms INTEGER DEFAULT 0,
    scroll_depth INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Web Vitals Table
CREATE TABLE IF NOT EXISTS web_vitals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES analytics_sessions(id) ON DELETE CASCADE,
    name VARCHAR(10) NOT NULL, -- CLS, FCP, LCP, TTFB, INP
    value DECIMAL(10,2) NOT NULL,
    rating VARCHAR(20) NOT NULL, -- good, needs-improvement, poor
    delta DECIMAL(10,2),
    entry_id VARCHAR(255),
    navigation_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Interactions Table
CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES analytics_sessions(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    model VARCHAR(50), -- cohere, openai, etc.
    response_time_ms INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    category VARCHAR(50), -- training, gear, mental, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strava Tokens Table
CREATE TABLE IF NOT EXISTS strava_tokens (
    id INTEGER PRIMARY KEY DEFAULT 1, -- single row for single user
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at INTEGER NOT NULL, -- unix timestamp
    athlete_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Strava Activities Table
CREATE TABLE IF NOT EXISTS strava_activities (
    id BIGINT PRIMARY KEY, -- Strava activity ID
    name VARCHAR(255),
    sport_type VARCHAR(50),
    workout_type INTEGER,
    distance DECIMAL(10,2), -- meters
    moving_time INTEGER, -- seconds
    elapsed_time INTEGER, -- seconds
    total_elevation_gain DECIMAL(8,2), -- meters
    average_speed DECIMAL(8,4), -- m/s
    max_speed DECIMAL(8,4), -- m/s
    average_heartrate DECIMAL(5,1),
    max_heartrate INTEGER,
    start_date TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50),
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    private BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_created_at ON analytics_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_created_at ON analytics_page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_web_vitals_session_id ON web_vitals(session_id);
CREATE INDEX IF NOT EXISTS idx_web_vitals_name ON web_vitals(name);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_session_id ON ai_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_strava_activities_start_date ON strava_activities(start_date);
CREATE INDEX IF NOT EXISTS idx_strava_activities_sport_type ON strava_activities(sport_type);

-- Update triggers
CREATE TRIGGER IF NOT EXISTS update_analytics_sessions_updated_at 
    BEFORE UPDATE ON analytics_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_strava_tokens_updated_at 
    BEFORE UPDATE ON strava_tokens 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_strava_activities_updated_at 
    BEFORE UPDATE ON strava_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for security
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_activities ENABLE ROW LEVEL SECURITY;

-- Create policies (allow read access for now, can be restricted later)
CREATE POLICY IF NOT EXISTS "Allow read analytics_sessions" ON analytics_sessions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow insert analytics_sessions" ON analytics_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow update analytics_sessions" ON analytics_sessions FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Allow read analytics_page_views" ON analytics_page_views FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow insert analytics_page_views" ON analytics_page_views FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow read web_vitals" ON web_vitals FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow insert web_vitals" ON web_vitals FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow read ai_interactions" ON ai_interactions FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow insert ai_interactions" ON ai_interactions FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow all strava_tokens" ON strava_tokens FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all strava_activities" ON strava_activities FOR ALL USING (true);