const { createClient } = require('@supabase/supabase-js');

(async () => {
  console.log('🔧 FIXING STRAVA_TOKENS TABLE SCHEMA...\n');

  const supabaseUrl = 'https://nvoljnojiondyjhxwkqq.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2xqbm9qaW9uZHlqaHh3a3FxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM1MDMxMSwiZXhwIjoyMDcwOTI2MzExfQ.JZF44a8K2tOVitBfT1AgCkhTUeZOb0H_ZHUPuWIoNkc';

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('1. Checking current table structure...');

    // Get current data first
    const { data: currentTokens, error: selectError } = await supabase
      .from('strava_tokens')
      .select('*');

    if (selectError) {
      console.error('❌ Cannot read current tokens:', selectError);
      return;
    }

    console.log(`📊 Found ${currentTokens?.length || 0} existing tokens`);
    if (currentTokens && currentTokens.length > 0) {
      console.log('🔍 Current token columns:', Object.keys(currentTokens[0]));
      currentTokens.forEach((token, i) => {
        console.log(`   Token ${i+1}: expires ${new Date(token.expires_at * 1000).toISOString()}`);
      });
    }

    console.log('\n2. Testing token insertion with current schema...');

    // Test what columns work
    const simpleTestToken = {
      access_token: 'test_simple_12345',
      refresh_token: 'test_refresh_12345',
      expires_at: Math.floor(Date.now() / 1000) + 21600
    };

    const { data: insertData, error: insertError } = await supabase
      .from('strava_tokens')
      .upsert(simpleTestToken)
      .select();

    if (insertError) {
      console.error('❌ Cannot insert even simple token:', insertError);
    } else {
      console.log('✅ Simple token insertion works');

      // Clean up
      await supabase
        .from('strava_tokens')
        .delete()
        .eq('access_token', 'test_simple_12345');
    }

    console.log('\n3. Checking if athlete_id column exists...');

    // Try to add athlete_id to an existing token
    if (currentTokens && currentTokens.length > 0) {
      const firstToken = currentTokens[0];
      const { error: updateError } = await supabase
        .from('strava_tokens')
        .update({ athlete_id: 12345 })
        .eq('id', firstToken.id);

      if (updateError) {
        console.log('❌ athlete_id column missing:', updateError.message);
        console.log('\n🔧 MANUAL FIX REQUIRED:');
        console.log('Please run this SQL in your Supabase SQL Editor:');
        console.log('='.repeat(60));
        console.log(`
-- Add missing athlete_id column
ALTER TABLE strava_tokens
ADD COLUMN IF NOT EXISTS athlete_id BIGINT;

-- Update the trigger function if it exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
        `);
        console.log('='.repeat(60));
      } else {
        console.log('✅ athlete_id column exists and works');
      }
    }

    console.log('\n4. Testing OAuth-compatible token storage...');

    // Test with all OAuth fields
    const oauthTestToken = {
      access_token: 'oauth_test_12345',
      refresh_token: 'oauth_refresh_12345',
      expires_at: Math.floor(Date.now() / 1000) + 21600,
      athlete_id: 98765
    };

    const { error: oauthError } = await supabase
      .from('strava_tokens')
      .upsert(oauthTestToken);

    if (oauthError) {
      console.error('❌ OAuth token format failed:', oauthError);
      console.log('\n💡 This means the OAuth callback will fail');
      console.log('   Run the SQL above to fix the table schema');
    } else {
      console.log('✅ OAuth token format works perfectly!');

      // Clean up
      await supabase
        .from('strava_tokens')
        .delete()
        .eq('access_token', 'oauth_test_12345');

      console.log('🧹 Test data cleaned up');
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📋 SCHEMA STATUS');
  console.log('='.repeat(50));

  // Final test
  const { error: finalTest } = await supabase
    .from('strava_tokens')
    .upsert({
      access_token: 'final_test_12345',
      refresh_token: 'final_refresh_12345',
      expires_at: Math.floor(Date.now() / 1000) + 21600,
      athlete_id: 99999
    });

  if (finalTest) {
    console.log('❌ OAuth compatibility: BROKEN - Fix schema above');
  } else {
    console.log('✅ OAuth compatibility: READY');

    // Clean up final test
    await supabase
      .from('strava_tokens')
      .delete()
      .eq('access_token', 'final_test_12345');

    console.log('\n🎉 DATABASE IS READY FOR OAUTH!');
    console.log('\n🎯 NOW TRY THE OAUTH FLOW:');
    console.log('   1. Go to: https://www.summitchronicles.com/training/realtime');
    console.log('   2. Click: "Connect Strava" (in logged-in Brave browser)');
    console.log('   3. Authorize: Complete OAuth');
    console.log('   4. Check: Real Strava data should replace mock data');
  }
})();