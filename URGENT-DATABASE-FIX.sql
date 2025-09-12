-- ⚠️ URGENT: Run this SQL in Supabase SQL Editor to fix deployment errors
-- Go to: https://supabase.com/dashboard/project/nvoljnojiondyjhxwkqq/sql

-- 1. ADD MISSING DELTA COLUMN to performance_vitals
ALTER TABLE performance_vitals ADD COLUMN IF NOT EXISTS delta REAL;

-- 2. FIX analytics_page_views null constraint issue  
-- Make page_url nullable to prevent the null constraint error
ALTER TABLE analytics_page_views ALTER COLUMN page_url DROP NOT NULL;

-- 3. VERIFY the fixes worked
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'performance_vitals'
    AND column_name = 'delta';

-- Should return one row showing the delta column exists

-- 4. TEST that analytics inserts will work
SELECT column_name, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'analytics_page_views' 
    AND column_name = 'page_url';

-- Should return: page_url | YES (nullable)

-- ✅ After running this SQL, the deployment errors should be resolved!