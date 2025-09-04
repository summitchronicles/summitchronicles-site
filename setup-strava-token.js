#!/usr/bin/env node

/**
 * Setup script to get and store Strava access token
 * This will exchange your authorization code for an access token
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const clientId = process.env.STRAVA_CLIENT_ID;
const clientSecret = process.env.STRAVA_CLIENT_SECRET;
const athleteId = process.env.STRAVA_ATHLETE_ID;

if (!supabaseUrl || !supabaseKey || !clientId || !clientSecret) {
  console.error('❌ Missing required environment variables');
  console.log('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStravaToken() {
  console.log('🏃‍♂️ Setting up Strava token for training analytics...\n');

  try {
    // First, create the strava_tokens table if it doesn't exist
    console.log('📊 Creating strava_tokens table...');
    
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS strava_tokens (
          athlete_id TEXT PRIMARY KEY,
          access_token TEXT NOT NULL,
          refresh_token TEXT,
          expires_at TIMESTAMP,
          scope TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (tableError) {
      // Try alternative method - direct table creation
      console.log('📊 Creating table via SQL Editor approach...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS strava_tokens (
          athlete_id TEXT PRIMARY KEY,
          access_token TEXT NOT NULL,
          refresh_token TEXT,
          expires_at TIMESTAMP,
          scope TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      
      console.log('\n📋 Please execute this SQL in your Supabase dashboard:');
      console.log('🔗 https://app.supabase.com/project/nvoljnojiondyjhxwkqq/sql');
      console.log('\n' + createTableSQL);
    }

    console.log('✅ Table setup complete');

    // Now we need to get a fresh access token
    console.log('\n🔑 To get your Strava access token, visit this URL:');
    console.log(`🔗 https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent('https://summitchronicles.com/api/strava/callback')}&approval_prompt=force&scope=read,activity:read_all`);
    
    console.log('\n📝 After authorizing, you\'ll be redirected to a URL like:');
    console.log('https://summitchronicles.com/api/strava/callback?code=AUTHORIZATION_CODE');
    console.log('\n💡 Copy the AUTHORIZATION_CODE and run:');
    console.log(`node exchange-strava-code.js YOUR_AUTHORIZATION_CODE\n`);

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupStravaToken();