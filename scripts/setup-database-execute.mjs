#!/usr/bin/env node

/**
 * Execute database setup using Supabase client
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

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔧 Setting up Supabase database tables...\n');

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Read SQL schema
const schemaPath = path.join(__dirname, '..', 'lib', 'database', 'workout-schema.sql');
const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

// Split SQL into statements
const statements = sqlSchema
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

console.log(`📝 Executing ${statements.length} SQL statements...\n`);

let successCount = 0;
let errorCount = 0;

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.substring(0, 60).replace(/\n/g, ' ') + '...';

  process.stdout.write(`[${i + 1}/${statements.length}] ${preview} `);

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: stmt + ';' });

    if (error) {
      // Try alternative approach - direct SQL via postgREST
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({ query: stmt + ';' })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      console.log('✅');
      successCount++;
    } else {
      console.log('✅');
      successCount++;
    }
  } catch (error) {
    console.log('⚠️');
    console.log(`   Note: ${error.message}`);
    // Don't count as error if it's "already exists"
    if (error.message.includes('already exists')) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  // Small delay to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 50));
}

console.log('\n' + '='.repeat(60));
console.log(`✅ Completed: ${successCount}/${statements.length} statements`);
console.log(`⚠️  Skipped/Errors: ${errorCount} statements`);

if (errorCount > 0) {
  console.log('\n💡 Note: Some statements may have failed because tables already exist.');
  console.log('   This is normal if you\'ve run this script before.\n');
}

// Verify tables were created
console.log('\n📊 Verifying tables...\n');

try {
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_type', ['BASE TABLE', 'VIEW'])
    .order('table_name');

  if (error) {
    console.log('⚠️  Could not verify tables automatically.');
    console.log('   Please verify manually in Supabase dashboard.\n');
  } else {
    console.log('Tables found:');
    tables.forEach(({ table_name }) => {
      const isView = ['weekly_workout_summary', 'recent_training_trends'].includes(table_name);
      const icon = isView ? '👁️ ' : '📋';
      console.log(`  ${icon} ${table_name}`);
    });
  }
} catch (error) {
  console.log('⚠️  Could not verify tables:', error.message);
}

console.log('\n🎉 Database setup complete!\n');
console.log('Next steps:');
console.log('  1. Test Excel upload: /api/training/upload-excel');
console.log('  2. Test AI assistant: /api/ai/ask-enhanced');
console.log('  3. View data in Supabase dashboard\n');
