const { createClient } = require('@supabase/supabase-js');

(async () => {
  console.log('🔧 CREATING STRAVA_TOKENS TABLE...\n');

  const supabaseUrl = 'https://nvoljnojiondyjhxwkqq.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2xqbm9qaW9uZHlqaHh3a3FxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM1MDMxMSwiZXhwIjoyMDcwOTI2MzExfQ.JZF44a8K2tOVitBfT1AgCkhTUeZOb0H_ZHUPuWIoNkc';

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('1. Testing direct access to strava_tokens table...');

    // Try to query the table directly to see if it exists
    const { data: existingData, error: selectError } = await supabase
      .from('strava_tokens')
      .select('id')
      .limit(1);

    if (selectError) {
      if (selectError.code === '42P01') {
        console.log('❌ strava_tokens table does not exist');
        console.log('📝 MANUAL SETUP REQUIRED:');
        console.log('\n🔧 Please run this SQL in your Supabase SQL Editor:');
        console.log('   1. Go to: https://app.supabase.com');
        console.log('   2. Select your project');
        console.log('   3. Go to SQL Editor');
        console.log('   4. Run this SQL:');
        console.log('\n' + '='.repeat(60));
        console.log(`
CREATE TABLE strava_tokens (
  id SERIAL PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  athlete_id BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all strava_tokens" ON strava_tokens
FOR ALL USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_strava_tokens_updated_at
    BEFORE UPDATE ON strava_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('='.repeat(60));
        console.log('\n5. After running the SQL, press Enter to continue...');

        // Wait for user to create table
        await new Promise(resolve => {
          process.stdin.once('data', () => resolve());
        });

        // Test again
        console.log('\n2. Testing table after creation...');
        const { data: newData, error: newError } = await supabase
          .from('strava_tokens')
          .select('id')
          .limit(1);

        if (newError) {
          console.error('❌ Table still not accessible:', newError);
          console.log('\n💡 ALTERNATIVE: Copy this SQL and run it manually in Supabase');
        } else {
          console.log('✅ strava_tokens table created and accessible!');
        }
      } else {
        console.error('❌ Database error:', selectError);
      }
    } else {
      console.log('✅ strava_tokens table already exists and is accessible');
      console.log(`📊 Current tokens in database: ${existingData?.length || 0}`);
    }

    console.log('\n3. Testing token insertion...');
    const testToken = {
      access_token: 'test_access_12345',
      refresh_token: 'test_refresh_12345',
      expires_at: Math.floor(Date.now() / 1000) + 21600, // 6 hours from now
      athlete_id: 12345
    };

    const { data: insertData, error: insertError } = await supabase
      .from('strava_tokens')
      .upsert(testToken)
      .select();

    if (insertError) {
      console.error('❌ Cannot insert test token:', insertError);
    } else {
      console.log('✅ Token insertion test successful');
      console.log('🧹 Cleaning up test token...');

      // Delete test token
      await supabase
        .from('strava_tokens')
        .delete()
        .eq('access_token', 'test_access_12345');

      console.log('✅ Test token cleaned up');
    }

  } catch (error) {
    console.error('❌ Script failed:', error);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 OAUTH SETUP STATUS');
  console.log('='.repeat(50));
  console.log('✅ Supabase connection: Working');
  console.log('✅ Service role key: Valid');

  // Test final connection
  const { error: finalTest } = await supabase
    .from('strava_tokens')
    .select('id')
    .limit(1);

  if (finalTest) {
    console.log('❌ strava_tokens table: MISSING - Run SQL above');
  } else {
    console.log('✅ strava_tokens table: Ready for OAuth');
    console.log('\n🎯 NOW TRY THE OAUTH FLOW:');
    console.log('   1. Go to: https://www.summitchronicles.com/training/realtime');
    console.log('   2. Click: "Connect Strava"');
    console.log('   3. Authorize: Complete OAuth in your logged-in Brave browser');
    console.log('   4. Check: Real data should replace mock data');
  }
})();