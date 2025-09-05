-- Strava Schema Fix SQL Script
-- Run this directly in your Supabase SQL Editor to fix the database schema

-- Step 1: Drop existing table to clear schema cache
DROP TABLE IF EXISTS strava_tokens CASCADE;

-- Step 2: Create clean table with only required columns  
CREATE TABLE strava_tokens (
  id INTEGER PRIMARY KEY DEFAULT 1,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Insert your working Strava tokens
INSERT INTO strava_tokens (id, access_token, refresh_token, expires_at)
VALUES (
  1,
  '1650f96e93841365cbbb46f7ee56137e1b4fe4c2',
  '6a7b9c080221422dc07960bd5d2f03ff935860cc', 
  1757097696
) ON CONFLICT (id) DO UPDATE SET 
  access_token = EXCLUDED.access_token,
  refresh_token = EXCLUDED.refresh_token,  
  expires_at = EXCLUDED.expires_at,
  updated_at = NOW();

-- Step 4: Verify the tokens are stored correctly
SELECT 
  id,
  LEFT(access_token, 10) || '...' AS access_token_preview,
  LEFT(refresh_token, 10) || '...' AS refresh_token_preview,
  expires_at,
  TO_TIMESTAMP(expires_at) AS expires_date,
  created_at
FROM strava_tokens 
WHERE id = 1;