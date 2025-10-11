#!/usr/bin/env node

/**
 * Verify Supabase database setup
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const SUPABASE_URL = envContent.match(/SUPABASE_URL=(.+)/)?.[1]?.trim();
const SUPABASE_SERVICE_ROLE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

console.log('\n🔍 Verifying Supabase database setup...\n');

// Test 1: Check if tables exist
console.log('📋 Checking tables...\n');

const expectedTables = [
  'historical_workouts',
  'garmin_workouts',
  'training_insights',
  'training_goals',
  'workout_plans',
  'ai_usage_tracking'
];

for (const table of expectedTables) {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`  ❌ ${table.padEnd(25)} - Error: ${error.message}`);
    } else {
      console.log(`  ✅ ${table.padEnd(25)} - Ready (${count || 0} rows)`);
    }
  } catch (error) {
    console.log(`  ❌ ${table.padEnd(25)} - ${error.message}`);
  }
}

// Test 2: Insert a sample workout
console.log('\n📝 Testing insert...\n');

const { data: insertData, error: insertError } = await supabase
  .from('historical_workouts')
  .insert({
    date: new Date().toISOString().split('T')[0],
    exercise_type: 'cardio',
    actual_duration: 60,
    intensity: 7,
    completion_rate: 95,
    notes: 'Test workout from verification script'
  })
  .select();

if (insertError) {
  console.log(`  ❌ Insert failed: ${insertError.message}`);
} else {
  console.log(`  ✅ Insert successful - ID: ${insertData[0].id}`);
}

// Test 3: Query data
console.log('\n📊 Testing query...\n');

const { data: queryData, error: queryError } = await supabase
  .from('historical_workouts')
  .select('*')
  .limit(5);

if (queryError) {
  console.log(`  ❌ Query failed: ${queryError.message}`);
} else {
  console.log(`  ✅ Query successful - Found ${queryData.length} workouts`);
}

console.log('\n🎉 Database verification complete!\n');
console.log('Next steps:');
console.log('  1. Update API routes to use Supabase instead of in-memory storage');
console.log('  2. Test Excel upload endpoint');
console.log('  3. Test enhanced AI endpoint\n');
