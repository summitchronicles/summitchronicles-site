#!/usr/bin/env node

/**
 * Simple database setup script for Supabase
 * Provides instructions and SQL to run manually
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔧 Supabase Database Setup for Training Data\n');
console.log('='.repeat(60));

// Read SQL schema
const schemaPath = path.join(__dirname, '..', 'lib', 'database', 'workout-schema.sql');
const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

// Try to read .env.local for project ref
let projectRef = 'your-project';
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/SUPABASE_URL=https:\/\/([^.]+)\.supabase\.co/);
  if (urlMatch) {
    projectRef = urlMatch[1];
  }
} catch (error) {
  // Ignore if .env.local doesn't exist
}

console.log('\n📋 Setup Instructions:\n');
console.log('To set up your database tables, follow these steps:\n');

console.log('1️⃣  Go to your Supabase SQL Editor:');
console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);

console.log('2️⃣  Copy the SQL schema from:');
console.log(`   ${schemaPath}\n`);

console.log('3️⃣  Paste it into the SQL Editor and click "Run"\n');

console.log('4️⃣  Verify tables were created by running:');
console.log(`   SELECT table_name FROM information_schema.tables`);
console.log(`   WHERE table_schema = 'public' ORDER BY table_name;\n`);

console.log('='.repeat(60));

console.log('\n📊 Tables that will be created:\n');

const tables = [
  { name: 'historical_workouts', desc: 'Excel-imported workout data' },
  { name: 'garmin_workouts', desc: 'Real-time Garmin activity sync' },
  { name: 'training_insights', desc: 'AI-generated training insights' },
  { name: 'training_goals', desc: 'Expedition and fitness goals' },
  { name: 'workout_plans', desc: 'Planned vs actual comparison' },
  { name: 'ai_usage_tracking', desc: 'API abuse prevention logs' }
];

tables.forEach(({ name, desc }) => {
  console.log(`  ✓ ${name.padEnd(25)} - ${desc}`);
});

console.log('\n📈 Views that will be created:\n');
console.log('  ✓ weekly_workout_summary    - 12-week workout aggregation');
console.log('  ✓ recent_training_trends    - 4-week training patterns\n');

console.log('='.repeat(60));

// Write a standalone SQL file for easy copying
const standaloneSQL = `-- Summit Chronicles Training Database Schema
-- Execute this in Supabase SQL Editor
-- Project: ${projectRef}
-- Generated: ${new Date().toISOString()}

${sqlSchema}

-- Verify tables created
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type IN ('BASE TABLE', 'VIEW')
ORDER BY table_type DESC, table_name;
`;

const outputPath = path.join(__dirname, '..', 'lib', 'database', 'setup.sql');
fs.writeFileSync(outputPath, standaloneSQL);

console.log(`\n✅ Standalone SQL file created: ${outputPath}`);
console.log('   You can copy this file directly into Supabase SQL Editor\n');

console.log('💡 TIP: After setup, test the database with:');
console.log('   INSERT INTO historical_workouts (date, exercise_type, actual_duration, intensity)');
console.log('   VALUES (CURRENT_DATE, \'cardio\', 60, 7);');
console.log('   SELECT * FROM historical_workouts;\n');
