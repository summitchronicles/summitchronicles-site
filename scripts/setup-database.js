#!/usr/bin/env node

/**
 * Setup Supabase database tables for training data
 * Executes the SQL schema from lib/database/workout-schema.sql
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Read SQL schema
const schemaPath = path.join(__dirname, '..', 'lib', 'database', 'workout-schema.sql');
const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

console.log('🔧 Setting up Supabase database tables...\n');

// Split SQL into individual statements
const statements = sqlSchema
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

// Execute SQL statements via Supabase REST API
async function executeSQLStatement(sql, index) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

    const postData = JSON.stringify({
      query: sql + ';'
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Alternative: Use direct SQL execution via pg connection string
async function executeSQLDirect(sql) {
  return new Promise((resolve, reject) => {
    // Extract project ref from URL
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

    if (!projectRef) {
      return reject(new Error('Could not extract project ref from SUPABASE_URL'));
    }

    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);

    const postData = JSON.stringify(sql);

    const options = {
      hostname: `${projectRef}.supabase.co`,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Main execution
async function setupDatabase() {
  console.log('📊 Executing SQL schema...\n');

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ') + '...';

    process.stdout.write(`[${i + 1}/${statements.length}] ${preview} `);

    try {
      const result = await executeSQLDirect(stmt);

      if (result.success) {
        console.log('✅');
        successCount++;
      } else {
        console.log('❌');
        console.log(`   Error: ${result.error}`);
        errorCount++;
        errors.push({ statement: preview, error: result.error });
      }
    } catch (error) {
      console.log('❌');
      console.log(`   Error: ${error.message}`);
      errorCount++;
      errors.push({ statement: preview, error: error.message });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${successCount} statements`);
  console.log(`❌ Errors: ${errorCount} statements`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(({ statement, error }, i) => {
      console.log(`\n${i + 1}. ${statement}`);
      console.log(`   ${error}`);
    });
  } else {
    console.log('\n🎉 Database setup completed successfully!');
  }
}

// Alternative approach: Write SQL file for manual execution
function generateManualInstructions() {
  const outputPath = path.join(__dirname, '..', 'lib', 'database', 'setup-instructions.md');

  const instructions = `# Manual Database Setup Instructions

If the automated script fails, you can manually execute the SQL schema in Supabase:

## Option 1: Using Supabase Dashboard

1. Go to your Supabase project: https://app.supabase.com/project/${SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]}
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of \`lib/database/workout-schema.sql\`
5. Click **Run** to execute

## Option 2: Using psql CLI

\`\`\`bash
# Get your database connection string from Supabase Dashboard
# Settings > Database > Connection string (Direct connection)

psql "your-connection-string-here" < lib/database/workout-schema.sql
\`\`\`

## Verify Tables Created

Run this query to verify all tables were created:

\`\`\`sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
\`\`\`

Expected tables:
- ai_usage_tracking
- garmin_workouts
- historical_workouts
- training_goals
- training_insights
- workout_plans

Expected views:
- weekly_workout_summary
- recent_training_trends
\`\`\`

  fs.writeFileSync(outputPath, instructions);
  console.log(`\n📝 Manual setup instructions written to: ${outputPath}`);
}

// Run setup
setupDatabase()
  .then(() => {
    generateManualInstructions();
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error);
    generateManualInstructions();
    process.exit(1);
  });
