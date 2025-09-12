-- Fix database schema issues for Summit Chronicles
-- Run this SQL in Supabase SQL Editor

-- 1. Create missing performance_vitals table
CREATE TABLE IF NOT EXISTS performance_vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT,
    name TEXT NOT NULL, -- CLS, FID, FCP, LCP, TTFB
    value REAL NOT NULL,
    delta REAL, -- This was the missing column
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional Web Vitals context
    page_url TEXT,
    user_agent TEXT,
    connection_type TEXT,
    device_type TEXT
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_performance_vitals_name ON performance_vitals(name);
CREATE INDEX IF NOT EXISTS idx_performance_vitals_created_at ON performance_vitals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_vitals_page_url ON performance_vitals(page_url);

-- 2. Make analytics_page_views.page_url nullable temporarily to prevent errors
ALTER TABLE analytics_page_views ALTER COLUMN page_url DROP NOT NULL;

-- 3. Add missing columns to analytics tables if they don't exist
DO $$ 
BEGIN 
    -- Add columns that might be missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_page_views' AND column_name = 'delta') THEN
        ALTER TABLE analytics_page_views ADD COLUMN delta REAL;
    END IF;
END $$;

-- 4. Ensure all required tables exist
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    fingerprint TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    country TEXT,
    region TEXT,
    city TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    total_page_views INTEGER DEFAULT 0,
    session_duration INTEGER DEFAULT 0,
    is_bounce BOOLEAN DEFAULT false,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create a view to help debug issues
CREATE OR REPLACE VIEW debug_schema_info AS
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('performance_vitals', 'analytics_page_views', 'analytics_sessions')
ORDER BY table_name, ordinal_position;