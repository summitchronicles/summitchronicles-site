// Use built-in fetch in Node.js 18+

(async () => {
  console.log('🔍 TESTING OAUTH CALLBACK MANUALLY...\n');

  try {
    // Test with a fake code to see the error response
    console.log('1. Testing callback with fake authorization code...');
    const testCode = 'fake_test_code_123';
    const callbackUrl = `https://www.summitchronicles.com/api/strava/callback?code=${testCode}`;

    console.log(`📍 Calling: ${callbackUrl}`);

    const response = await fetch(callbackUrl, {
      redirect: 'manual'  // Don't follow redirects
    });

    console.log(`📊 Response status: ${response.status}`);
    console.log(`📍 Redirect location: ${response.headers.get('location') || 'none'}`);

    if (response.status === 307 || response.status === 302) {
      const location = response.headers.get('location');
      if (location) {
        console.log('\n🔍 Analyzing redirect URL...');
        const url = new URL(location);
        const params = Object.fromEntries(url.searchParams.entries());
        console.log(`   Base URL: ${url.origin}${url.pathname}`);
        console.log(`   Parameters:`, params);

        if (params.error) {
          console.log(`   ❌ Error detected: ${params.error}`);
        }
        if (params.success) {
          console.log(`   ✅ Success detected: ${params.success}`);
        }
      }
    }

    // Test token exchange directly
    console.log('\n2. Testing Strava token exchange API...');
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: '172794',
        client_secret: 'fake_secret',  // Will fail, but we can see the error
        code: 'fake_code',
        grant_type: 'authorization_code',
      }),
    });

    console.log(`📊 Strava API status: ${tokenResponse.status}`);
    const tokenError = await tokenResponse.text();
    console.log(`📄 Strava API response: ${tokenError.substring(0, 200)}...`);

    // Test our environment variables
    console.log('\n3. Testing environment variable access...');
    const envTestResponse = await fetch('https://www.summitchronicles.com/api/strava/auth', {
      redirect: 'manual'
    });

    const location = envTestResponse.headers.get('location');
    if (location) {
      const url = new URL(location);
      const clientId = url.searchParams.get('client_id');
      console.log(`🆔 Client ID in OAuth URL: "${clientId}"`);
      console.log(`🔗 Full OAuth URL: ${location}`);

      if (clientId === '172794') {
        console.log('   ✅ Environment variables accessible in production');
      } else {
        console.log('   ❌ Environment variable issue');
      }
    }

    console.log('\n✅ OAuth callback diagnostic complete!');

  } catch (error) {
    console.error('❌ Error during OAuth callback test:', error);
  }
})();