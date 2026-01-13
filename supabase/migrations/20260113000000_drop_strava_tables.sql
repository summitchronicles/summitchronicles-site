-- Drop Strava Integration Tables
-- Migration to remove deprecated Strava integration in favor of Garmin-only approach
-- Created: 2026-01-13

-- Drop tables in reverse dependency order
BEGIN;

-- Drop training insights table (depends on strava_activities_enhanced)
DROP TABLE IF EXISTS training_insights CASCADE;

-- Drop enhanced strava activities table
DROP TABLE IF EXISTS strava_activities_enhanced CASCADE;

-- Drop original strava activities table (if exists)
DROP TABLE IF EXISTS strava_activities CASCADE;

-- Drop strava tokens/OAuth table (if exists)
DROP TABLE IF EXISTS strava_tokens CASCADE;
DROP TABLE IF EXISTS strava_oauth_tokens CASCADE;

-- Remove any Strava-related columns from other tables
-- Check if training_entries table has strava_activity_id column and remove it
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'training_entries'
        AND column_name = 'strava_activity_id'
    ) THEN
        ALTER TABLE training_entries DROP COLUMN strava_activity_id CASCADE;
    END IF;
END $$;

-- Remove any Strava-related views (if they exist)
DROP VIEW IF EXISTS strava_activity_summary CASCADE;
DROP VIEW IF EXISTS strava_weekly_stats CASCADE;

-- Remove any Strava-related functions
DROP FUNCTION IF EXISTS sync_strava_activities() CASCADE;
DROP FUNCTION IF EXISTS get_strava_stats() CASCADE;
DROP FUNCTION IF EXISTS calculate_strava_insights() CASCADE;

COMMIT;

-- Log migration completion
COMMENT ON SCHEMA public IS 'Strava tables dropped on 2026-01-13. Using Garmin-only integration.';
