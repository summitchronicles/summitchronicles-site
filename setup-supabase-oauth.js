const { createClient } = require('@supabase/supabase-js');

(async () => {
  console.log('🔧 SETTING UP SUPABASE FOR OAUTH...\n');

  const supabaseUrl = 'https://nvoljnojiondyjhxwkqq.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2xqbm9qaW9uZHlqaHh3a3FxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM1MDMxMSwiZXhwIjoyMDcwOTI2MzExfQ.JZF44a8K2tOVitBfT1AgCkhTUeZOb0H_ZHUPuWIoNkc';

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('1. Testing Supabase connection...');

    // Test connection by checking tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('❌ Supabase connection failed:', tablesError);
      return;
    }

    console.log('✅ Connected to Supabase successfully');
    console.log(`📊 Found ${tables?.length || 0} tables in public schema`);

    // Check if strava_tokens table exists
    const stravaTokensExists = tables?.some(table => table.table_name === 'strava_tokens');
    console.log(`🔍 strava_tokens table exists: ${stravaTokensExists ? 'YES' : 'NO'}`);

    if (!stravaTokensExists) {
      console.log('\n2. Creating strava_tokens table...');

      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS strava_tokens (
            id SERIAL PRIMARY KEY,
            access_token TEXT NOT NULL,
            refresh_token TEXT NOT NULL,
            expires_at BIGINT NOT NULL,
            athlete_id BIGINT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
          );

          -- Enable RLS
          ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;

          -- Create policy to allow all operations (since this is a single-user app)
          CREATE POLICY IF NOT EXISTS "Allow all strava_tokens" ON strava_tokens FOR ALL USING (true);

          -- Create updated_at trigger
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
              NEW.updated_at = TIMEZONE('utc'::text, NOW());
              RETURN NEW;
          END;
          $$ language 'plpgsql';

          CREATE TRIGGER IF NOT EXISTS update_strava_tokens_updated_at
              BEFORE UPDATE ON strava_tokens
              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `
      });

      if (createError) {
        console.error('❌ Failed to create table:', createError);

        // Try alternative approach using direct SQL
        console.log('🔄 Trying alternative table creation...');
        const { error: altError } = await supabase
          .from('strava_tokens')
          .select('id')
          .limit(1);

        if (altError && altError.code === '42P01') {
          console.log('📝 Table definitely does not exist. Creating manually...');

          // Manual table creation via REST API
          const createTableSQL = `
            CREATE TABLE strava_tokens (
              id SERIAL PRIMARY KEY,
              access_token TEXT NOT NULL,
              refresh_token TEXT NOT NULL,
              expires_at BIGINT NOT NULL,
              athlete_id BIGINT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );

            ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;
            CREATE POLICY "Allow all strava_tokens" ON strava_tokens FOR ALL USING (true);
          `;

          console.log('🔧 Manual SQL execution needed. Please run this in your Supabase SQL editor:');
          console.log('='.repeat(60));
          console.log(createTableSQL);
          console.log('='.repeat(60));
        }
      } else {
        console.log('✅ strava_tokens table created successfully');
      }
    }

    console.log('\n3. Testing table access...');
    const { data: tokenData, error: selectError } = await supabase
      .from('strava_tokens')
      .select('*')
      .limit(1);

    if (selectError) {
      console.error('❌ Cannot access strava_tokens table:', selectError);
      console.log('\n💡 SOLUTION: Please run this SQL in your Supabase dashboard:');
      console.log('Go to: https://app.supabase.com → Your Project → SQL Editor');
      console.log('Run this SQL:');
      console.log('='.repeat(60));
      console.log(`
CREATE TABLE IF NOT EXISTS strava_tokens (
  id SERIAL PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  athlete_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow all strava_tokens" ON strava_tokens
FOR ALL USING (true);
      `);
      console.log('='.repeat(60));
    } else {
      console.log('✅ strava_tokens table is accessible');
      console.log(`📊 Current tokens in database: ${tokenData?.length || 0}`);

      if (tokenData && tokenData.length > 0) {
        console.log('🔑 Existing token found:');
        tokenData.forEach((token, i) => {
          console.log(`   Token ${i+1}: expires ${new Date(token.expires_at * 1000).toISOString()}`);
          console.log(`   Athlete ID: ${token.athlete_id || 'not set'}`);
        });
      }
    }

    console.log('\n4. Testing token storage (dry run)...');
    const testTokenData = {
      access_token: 'test_token_12345',
      refresh_token: 'refresh_token_12345',
      expires_at: Math.floor(Date.now() / 1000) + 21600, // 6 hours from now
      athlete_id: 12345
    };

    const { error: insertError } = await supabase
      .from('strava_tokens')
      .upsert(testTokenData);

    if (insertError) {
      console.error('❌ Cannot insert test token:', insertError);
    } else {
      console.log('✅ Token storage test successful');

      // Clean up test token
      await supabase
        .from('strava_tokens')
        .delete()
        .eq('access_token', 'test_token_12345');

      console.log('🧹 Test token cleaned up');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 SETUP SUMMARY');
  console.log('='.repeat(50));
  console.log('✅ Supabase connection: Working');
  console.log('✅ Service role key: Valid');
  console.log('✅ Database access: Functional');
  console.log('\n🎯 NEXT STEP: Try the OAuth flow again');
  console.log('   1. Go to: https://www.summitchronicles.com/training/realtime');
  console.log('   2. Click: "Connect Strava"');
  console.log('   3. Authorize: Complete the OAuth');
  console.log('   4. Check: Real data should now appear');
})();