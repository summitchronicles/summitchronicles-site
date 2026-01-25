const { chromium } = require('playwright');

(async () => {
  console.log('🔐 MANUAL OAUTH TEST WITH MONITORING...\n');
  console.log('This will open a browser where you can manually log into Strava and complete OAuth');
  console.log('The script will monitor all network requests to show what happens.\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Set up comprehensive monitoring
  page.on('request', request => {
    const url = request.url();
    if (url.includes('summitchronicles.com') || url.includes('strava.com/oauth') || url.includes('strava.com/api')) {
      console.log(`📡 REQUEST: ${request.method()} ${url}`);
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('summitchronicles.com') || url.includes('strava.com/oauth') || url.includes('strava.com/api')) {
      console.log(`📡 RESPONSE: ${response.status()} ${url}`);

      // Log response headers for callbacks
      if (url.includes('callback')) {
        const location = response.headers()['location'];
        if (location) {
          console.log(`   📍 Redirect to: ${location}`);
        }
      }
    }
  });

  try {
    console.log('STEP 1: Opening Strava login page...');
    await page.goto('https://www.strava.com/login');
    await page.waitForLoadState('networkidle');

    console.log('\n🟡 MANUAL ACTION REQUIRED:');
    console.log('   1. Log into Strava with your credentials in the browser window');
    console.log('   2. Wait for the login to complete');
    console.log('   3. Press Enter here when logged in...\n');

    // Wait for user to log in
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    console.log('\nSTEP 2: Navigating to Summit Chronicles realtime page...');
    await page.goto('https://www.summitchronicles.com/training/realtime');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'manual-oauth-step2.png' });

    console.log('\n🟡 MANUAL ACTION REQUIRED:');
    console.log('   1. Click the "Connect Strava" button in the browser');
    console.log('   2. Complete the Strava authorization');
    console.log('   3. Wait to be redirected back');
    console.log('   4. Press Enter here when complete...\n');

    // Monitor URL changes
    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) {
        const url = frame.url();
        console.log(`📍 PAGE NAVIGATION: ${url}`);

        // Check for callback parameters
        if (url.includes('summitchronicles.com')) {
          try {
            const urlObj = new URL(url);
            const params = Object.fromEntries(urlObj.searchParams.entries());
            if (Object.keys(params).length > 0) {
              console.log(`   📋 URL Parameters:`, params);
            }
          } catch (e) {
            // Ignore URL parsing errors
          }
        }
      }
    });

    // Wait for user to complete OAuth
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    console.log('\nSTEP 3: Testing final API state...');
    await page.screenshot({ path: 'manual-oauth-step3.png' });

    // Test the API directly
    const response = await fetch('https://www.summitchronicles.com/api/training/metrics');
    if (response.ok) {
      const data = await response.json();
      console.log(`\n📊 FINAL API RESULTS:`);
      console.log(`   Data source: ${data.source}`);
      console.log(`   Total activities: ${data.totalActivities}`);
      console.log(`   Resting HR: ${data.metrics?.currentStats?.currentRestingHR?.value}`);
      console.log(`   Elevation: ${data.metrics?.currentStats?.totalElevationThisYear?.value}`);

      if (data.debug) {
        console.log(`   First activity ID: ${data.debug.firstActivityId}`);
        console.log(`   Is real Strava: ${data.debug.isRealStrava}`);
      }

      if (data.source === 'strava' && data.debug?.isRealStrava) {
        console.log('\n🎉🎉🎉 SUCCESS! REAL STRAVA DATA IS NOW WORKING! 🎉🎉🎉');
      } else {
        console.log('\n💀💀💀 STILL MOCK DATA - OAUTH DID NOT COMPLETE SUCCESSFULLY 💀💀💀');
      }
    } else {
      console.log(`❌ API request failed: ${response.status}`);
    }

    // Also test the Strava activities endpoint
    console.log('\nTesting Strava activities endpoint...');
    const activitiesResponse = await fetch('https://www.summitchronicles.com/api/strava/activities');
    if (activitiesResponse.ok) {
      const activitiesData = await activitiesResponse.json();
      console.log(`   Activities source: ${activitiesData.source || 'unknown'}`);
      console.log(`   Activities count: ${activitiesData.activities?.length || 0}`);

      if (activitiesData.activities && activitiesData.activities.length > 0) {
        const firstActivity = activitiesData.activities[0];
        console.log(`   First activity ID: ${firstActivity.id}`);
        console.log(`   First activity name: ${firstActivity.name}`);
      }
    }

    console.log('\n✅ Manual OAuth test complete!');
    console.log('\nAll network requests have been logged above.');
    console.log('If OAuth failed, check the REQUEST/RESPONSE logs for error details.');

  } catch (error) {
    console.error('❌ Error during manual OAuth test:', error);
    await page.screenshot({ path: 'manual-oauth-error.png' });
  } finally {
    console.log('\n⏳ Keeping browser open for final inspection...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();