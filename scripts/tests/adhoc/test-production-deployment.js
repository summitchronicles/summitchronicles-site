const { chromium } = require('playwright');

async function testProductionDeployment() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  console.log('🌐 Testing Production Deployment - Strava Integration...\n');

  const page = await context.newPage();

  try {
    console.log('📋 Testing Production Environment Variables...');

    // Test main domain auth endpoint
    console.log('\n1. Testing main domain: https://www.summitchronicles.com/api/strava/auth');

    const response = await page.request.get('https://www.summitchronicles.com/api/strava/auth', {
      maxRedirects: 0
    });

    console.log(`   Status: ${response.status()}`);

    if (response.status() === 307 || response.status() === 302) {
      const location = response.headers()['location'];
      console.log(`   ✅ Redirect to: ${location}`);

      if (location && location.includes('strava.com/oauth/authorize')) {
        console.log('   ✅ Successfully redirecting to Strava OAuth');
        console.log('   ✅ Environment variables are loaded correctly');

        // Parse the redirect URL to check parameters
        const url = new URL(location);
        const clientId = url.searchParams.get('client_id');
        const redirectUri = url.searchParams.get('redirect_uri');
        const scope = url.searchParams.get('scope');

        console.log(`   ✅ Client ID: ${clientId}`);
        console.log(`   ✅ Redirect URI: ${decodeURIComponent(redirectUri || '')}`);
        console.log(`   ✅ Scope: ${scope}`);

      } else {
        console.log(`   ❌ Unexpected redirect location: ${location}`);
      }
    } else if (response.status() === 500) {
      const text = await response.text();
      console.log(`   ❌ Server error: ${text}`);
    } else {
      console.log(`   ❌ Unexpected status: ${response.status()}`);
    }

    console.log('\n2. Testing Training Metrics API...');

    const metricsResponse = await page.request.get('https://www.summitchronicles.com/api/training/metrics');
    console.log(`   Status: ${metricsResponse.status()}`);

    if (metricsResponse.ok()) {
      const metricsData = await metricsResponse.json();
      console.log(`   ✅ Source: ${metricsData.source}`);
      console.log(`   ✅ Success: ${metricsData.success}`);
      console.log(`   ✅ Total Activities: ${metricsData.totalActivities}`);

      if (metricsData.source === 'strava') {
        console.log('   🎉 REAL STRAVA DATA DETECTED!');
      } else if (metricsData.source === 'mock') {
        console.log('   ⚠️  Still using mock data - authentication may be needed');
      }
    } else {
      console.log(`   ❌ Failed to fetch metrics: ${metricsResponse.status()}`);
    }

    console.log('\n3. Testing Training Page Load...');

    await page.goto('https://www.summitchronicles.com/training');
    await page.waitForTimeout(3000);

    // Check for data source indicators
    const dataIndicators = await page.locator('text=/Live Data|Demo Data/').all();
    console.log(`   Found ${dataIndicators.length} data source indicators`);

    for (let i = 0; i < dataIndicators.length; i++) {
      const text = await dataIndicators[i].textContent();
      console.log(`   Indicator ${i + 1}: "${text}"`);
    }

    // Check for metrics values
    const statElements = await page.locator('[class*="text-3xl font-light"]').all();
    console.log(`\n   Found ${statElements.length} statistics:`);

    for (let i = 0; i < Math.min(statElements.length, 4); i++) {
      const text = await statElements[i].textContent();
      console.log(`   Stat ${i + 1}: "${text}"`);
    }

    console.log('\n📸 Taking production screenshots...');

    await page.screenshot({
      path: 'production-training-page.png',
      fullPage: true
    });
    console.log('✅ Production page screenshot saved: production-training-page.png');

    // Try to access the auth endpoint in browser to see behavior
    console.log('\n4. Testing Browser Auth Redirect...');

    try {
      await page.goto('https://www.summitchronicles.com/api/strava/auth');
      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      console.log(`   Current URL after redirect: ${currentUrl}`);

      if (currentUrl.includes('strava.com')) {
        console.log('   ✅ Successfully redirected to Strava OAuth page');
        console.log('   🎉 PRODUCTION AUTHENTICATION IS WORKING!');

        await page.screenshot({
          path: 'strava-oauth-page.png',
          fullPage: false
        });
        console.log('✅ Strava OAuth page screenshot saved: strava-oauth-page.png');

      } else if (currentUrl.includes('summitchronicles.com')) {
        console.log('   ⚠️  Remained on Summit Chronicles domain');
        console.log('   Check for error messages or authentication issues');
      } else {
        console.log(`   ❌ Unexpected redirect to: ${currentUrl}`);
      }
    } catch (error) {
      console.log(`   ❌ Error testing auth redirect: ${error.message}`);
    }

  } catch (error) {
    console.log(`❌ Error during testing: ${error.message}`);
  }

  await page.close();
  await browser.close();

  console.log('\n✅ Production deployment testing complete!');
}

testProductionDeployment().catch(console.error);