(async () => {
  console.log('🔍 TESTING STRAVA TOKEN EXCHANGE...\n');

  // Test with real environment variables
  const clientId = '172794';
  const clientSecret = 'f58933ff81ff645699212050ce2a0e379f7fc886';

  try {
    // Test token exchange with a fake code (will fail but show us the exact error)
    console.log('1. Testing token exchange API with current env vars...');
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: 'fake_test_code_to_see_error',
        grant_type: 'authorization_code',
      }),
    });

    console.log(`📊 Status: ${response.status}`);
    const responseText = await response.text();
    console.log(`📄 Response: ${responseText}`);

    // Check if it's a "bad verification code" vs "authorization error"
    if (responseText.includes('Bad Request') && responseText.includes('verification_code')) {
      console.log('✅ Client ID/Secret are valid, just the code is fake (expected)');
    } else if (responseText.includes('Authorization Error')) {
      console.log('❌ Client ID/Secret authentication failed');
    } else {
      console.log('❓ Unexpected response format');
    }

    // Test Supabase connection directly
    console.log('\n2. Testing Supabase connection...');
    const supabaseUrl = 'https://nvoljnojiondyjhxwkqq.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b2xqbm9qaW9uZHlqaHh3a3FxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM1MDMxMSwiZXhwIjoyMDcwOTI2MzExfQ.JZF44a8K2tOVitBfT1AgCkhTUeZOb0H_ZHUPuWIoNkc';

    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/strava_tokens?limit=1`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Supabase status: ${supabaseResponse.status}`);
    if (supabaseResponse.ok) {
      const tokens = await supabaseResponse.json();
      console.log(`📄 Tokens in Supabase: ${tokens.length} found`);
      if (tokens.length > 0) {
        console.log(`🔑 Latest token expires: ${tokens[0].expires_at}`);
        console.log(`👤 Athlete ID: ${tokens[0].athlete_id}`);
      }
    } else {
      const error = await supabaseResponse.text();
      console.log(`❌ Supabase error: ${error}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
})();