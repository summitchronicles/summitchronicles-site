-- Summit Chronicles Analytics Database Schema
-- Privacy-compliant analytics with real-time capabilities

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. VISITOR ANALYTICS
-- Sessions table for tracking user visits
CREATE TABLE analytics_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    fingerprint TEXT, -- Anonymous hash for user identification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Geographic data
    country TEXT,
    region TEXT,
    city TEXT,
    
    -- Technical data
    user_agent TEXT,
    device_type TEXT, -- desktop, mobile, tablet
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    
    -- Traffic source
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Session metrics
    total_page_views INTEGER DEFAULT 0,
    session_duration INTEGER DEFAULT 0, -- seconds
    is_bounce BOOLEAN DEFAULT false,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page views for detailed navigation tracking
CREATE TABLE analytics_page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    page_url TEXT NOT NULL,
    page_title TEXT,
    referrer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Engagement metrics
    time_on_page INTEGER, -- seconds
    scroll_depth INTEGER, -- percentage
    interactions INTEGER DEFAULT 0 -- clicks, form fills, etc.
);

-- 2. AI USAGE ANALYTICS
-- AI interactions tracking
CREATE TABLE analytics_ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Question analysis
    question TEXT NOT NULL,
    question_length INTEGER,
    question_category TEXT, -- training, gear, expeditions, etc.
    question_complexity TEXT, -- simple, medium, complex
    
    -- Response analysis
    response_time INTEGER, -- milliseconds
    response_length INTEGER,
    sources_count INTEGER,
    has_sources BOOLEAN DEFAULT false,
    
    -- User feedback
    user_rating INTEGER, -- 1-5 stars
    user_feedback TEXT,
    was_helpful BOOLEAN,
    
    -- Technical metrics
    retrieval_score REAL, -- average similarity score
    tokens_used INTEGER,
    error_occurred BOOLEAN DEFAULT false,
    error_type TEXT
);

-- Popular topics tracking
CREATE TABLE analytics_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_name TEXT UNIQUE NOT NULL,
    category TEXT, -- training, gear, expeditions, etc.
    total_questions INTEGER DEFAULT 0,
    avg_satisfaction REAL DEFAULT 0,
    last_asked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CONTENT PERFORMANCE
-- Page performance metrics
CREATE TABLE analytics_content_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_url TEXT UNIQUE NOT NULL,
    page_title TEXT,
    page_type TEXT, -- blog, training, gear, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Traffic metrics
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0,
    bounce_rate REAL DEFAULT 0,
    
    -- Engagement metrics
    total_interactions INTEGER DEFAULT 0,
    avg_scroll_depth REAL DEFAULT 0,
    social_shares INTEGER DEFAULT 0,
    
    -- SEO metrics
    search_impressions INTEGER DEFAULT 0,
    search_clicks INTEGER DEFAULT 0,
    avg_position REAL DEFAULT 0
);

-- Search queries tracking
CREATE TABLE analytics_search_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT REFERENCES analytics_sessions(session_id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    results_count INTEGER,
    clicked_result BOOLEAN DEFAULT false,
    result_position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. REAL-TIME METRICS
-- Active sessions for real-time dashboard
CREATE TABLE analytics_active_sessions (
    session_id TEXT PRIMARY KEY,
    current_page TEXT,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    device_type TEXT,
    country TEXT
);

-- System performance metrics
CREATE TABLE analytics_system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Response times
    avg_page_load_time INTEGER, -- milliseconds
    avg_ai_response_time INTEGER,
    avg_api_response_time INTEGER,
    
    -- Usage stats
    active_sessions INTEGER DEFAULT 0,
    total_requests INTEGER DEFAULT 0,
    ai_requests INTEGER DEFAULT 0,
    error_rate REAL DEFAULT 0,
    
    -- Resource usage
    cpu_usage REAL,
    memory_usage REAL,
    database_connections INTEGER
);

-- 5. INDEXES for performance
-- Session indexes
CREATE INDEX idx_sessions_created_at ON analytics_sessions(created_at DESC);
CREATE INDEX idx_sessions_fingerprint ON analytics_sessions(fingerprint);
CREATE INDEX idx_sessions_country ON analytics_sessions(country);

-- Page views indexes
CREATE INDEX idx_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX idx_page_views_page_url ON analytics_page_views(page_url);
CREATE INDEX idx_page_views_created_at ON analytics_page_views(created_at DESC);

-- AI interactions indexes
CREATE INDEX idx_ai_interactions_session_id ON analytics_ai_interactions(session_id);
CREATE INDEX idx_ai_interactions_created_at ON analytics_ai_interactions(created_at DESC);
CREATE INDEX idx_ai_interactions_category ON analytics_ai_interactions(question_category);

-- Content performance indexes
CREATE INDEX idx_content_performance_page_url ON analytics_content_performance(page_url);
CREATE INDEX idx_content_performance_total_views ON analytics_content_performance(total_views DESC);

-- Active sessions indexes
CREATE INDEX idx_active_sessions_last_activity ON analytics_active_sessions(last_activity DESC);

-- System metrics indexes
CREATE INDEX idx_system_metrics_timestamp ON analytics_system_metrics(timestamp DESC);

-- 6. FUNCTIONS for data aggregation
-- Function to update session metrics
CREATE OR REPLACE FUNCTION update_session_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update session page view count and last activity
    UPDATE analytics_sessions 
    SET 
        total_page_views = (
            SELECT COUNT(*) FROM analytics_page_views 
            WHERE session_id = NEW.session_id
        ),
        last_activity = NEW.created_at
    WHERE session_id = NEW.session_id;
    
    -- Update active sessions
    INSERT INTO analytics_active_sessions (session_id, current_page, last_activity)
    VALUES (NEW.session_id, NEW.page_url, NEW.created_at)
    ON CONFLICT (session_id) 
    DO UPDATE SET 
        current_page = NEW.page_url,
        last_activity = NEW.created_at;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for session updates
CREATE TRIGGER trigger_update_session_metrics
    AFTER INSERT ON analytics_page_views
    FOR EACH ROW EXECUTE FUNCTION update_session_metrics();

-- Function to clean old active sessions
CREATE OR REPLACE FUNCTION cleanup_active_sessions()
RETURNS void AS $$
BEGIN
    -- Remove sessions inactive for more than 30 minutes
    DELETE FROM analytics_active_sessions 
    WHERE last_activity < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to aggregate topic data
CREATE OR REPLACE FUNCTION update_topic_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Extract topic from question (simple keyword matching)
    DECLARE
        topic_category TEXT;
        detected_topic TEXT;
    BEGIN
        -- Simple topic detection (can be enhanced with AI)
        CASE 
            WHEN NEW.question ILIKE '%everest%' OR NEW.question ILIKE '%base camp%' THEN
                detected_topic := 'Everest Base Camp';
                topic_category := 'expeditions';
            WHEN NEW.question ILIKE '%k2%' THEN
                detected_topic := 'K2';
                topic_category := 'expeditions';
            WHEN NEW.question ILIKE '%training%' OR NEW.question ILIKE '%fitness%' THEN
                detected_topic := 'Training';
                topic_category := 'training';
            WHEN NEW.question ILIKE '%gear%' OR NEW.question ILIKE '%equipment%' THEN
                detected_topic := 'Gear';
                topic_category := 'gear';
            WHEN NEW.question ILIKE '%altitude%' OR NEW.question ILIKE '%acclimatization%' THEN
                detected_topic := 'High Altitude';
                topic_category := 'health';
            ELSE
                detected_topic := 'General';
                topic_category := 'general';
        END CASE;
        
        -- Update topic stats
        INSERT INTO analytics_topics (topic_name, category, total_questions, last_asked)
        VALUES (detected_topic, topic_category, 1, NEW.created_at)
        ON CONFLICT (topic_name) 
        DO UPDATE SET 
            total_questions = analytics_topics.total_questions + 1,
            last_asked = NEW.created_at;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for topic updates
CREATE TRIGGER trigger_update_topic_stats
    AFTER INSERT ON analytics_ai_interactions
    FOR EACH ROW EXECUTE FUNCTION update_topic_stats();

-- 7. VIEWS for dashboard queries
-- Popular pages view
CREATE VIEW analytics_popular_pages AS
SELECT 
    cp.page_url,
    cp.page_title,
    cp.page_type,
    cp.total_views,
    cp.unique_visitors,
    cp.avg_time_on_page,
    cp.bounce_rate,
    RANK() OVER (ORDER BY cp.total_views DESC) as rank
FROM analytics_content_performance cp
WHERE cp.total_views > 0
ORDER BY cp.total_views DESC;

-- AI usage summary view
CREATE VIEW analytics_ai_summary AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_questions,
    AVG(response_time) as avg_response_time,
    AVG(CASE WHEN user_rating IS NOT NULL THEN user_rating END) as avg_rating,
    COUNT(CASE WHEN was_helpful = true THEN 1 END) as helpful_responses,
    COUNT(CASE WHEN error_occurred = true THEN 1 END) as errors
FROM analytics_ai_interactions
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Real-time stats view
CREATE VIEW analytics_realtime_stats AS
SELECT 
    (SELECT COUNT(*) FROM analytics_active_sessions) as active_users,
    (SELECT COUNT(*) FROM analytics_sessions WHERE created_at > NOW() - INTERVAL '24 hours') as daily_visitors,
    (SELECT COUNT(*) FROM analytics_ai_interactions WHERE created_at > NOW() - INTERVAL '24 hours') as daily_ai_queries,
    (SELECT AVG(response_time) FROM analytics_ai_interactions WHERE created_at > NOW() - INTERVAL '1 hour') as avg_ai_response_time;

-- 8. ROW LEVEL SECURITY (Optional - for multi-tenant setup)
-- Enable RLS on sensitive tables
-- ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE analytics_ai_interactions ENABLE ROW LEVEL SECURITY;

-- 9. SCHEDULED CLEANUP (PostgreSQL cron extension needed)
-- Clean up old data periodically
-- SELECT cron.schedule('cleanup-analytics', '0 2 * * *', 
--   'DELETE FROM analytics_page_views WHERE created_at < NOW() - INTERVAL ''90 days'';
--    DELETE FROM analytics_sessions WHERE created_at < NOW() - INTERVAL ''90 days'';
--    SELECT cleanup_active_sessions();'
-- );