const { chromium } = require('playwright');

(async () => {
  console.log('🔥 CONTINUING OAUTH TEST WITH BRAVE BROWSER...\n');

  try {
    // Connect to the existing Brave instance
    console.log('1. Connecting to Brave browser...');
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();

    // Find the active page or create a new one
    let page;
    if (pages.length > 0) {
      page = pages[0];
    } else {
      page = await context.newPage();
    }

    console.log('✅ Connected to Brave browser successfully');

    // Set up network monitoring
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

        if (url.includes('callback')) {
          const location = response.headers()['location'];
          if (location) {
            console.log(`   📍 Redirect to: ${location}`);
          }
        }
      }
    });

    console.log('\n2. Navigating to Summit Chronicles realtime page...');
    await page.goto('https://www.summitchronicles.com/training/realtime');
    await page.waitForLoadState('networkidle');

    console.log('📍 Current URL:', page.url());

    // Monitor navigation
    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) {
        const url = frame.url();
        console.log(`📍 NAVIGATION: ${url}`);

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

    // Look for the Connect Strava button
    console.log('\n3. Looking for Connect Strava button...');
    const connectButton = page.locator('text=Connect Strava');
    const buttonCount = await connectButton.count();

    if (buttonCount > 0) {
      console.log(`✅ Found ${buttonCount} "Connect Strava" button(s)`);

      console.log('\n🟡 MANUAL ACTION: Click the "Connect Strava" button in Brave browser now...');
      console.log('   The script will monitor all network requests');

      // Wait for navigation to OAuth or callback
      let navigationCompleted = false;
      const navigationPromise = new Promise((resolve) => {
        const handler = (frame) => {
          if (frame === page.mainFrame()) {
            const url = frame.url();
            if (url.includes('strava.com/oauth') || url.includes('summitchronicles.com') && url.includes('success')) {
              navigationCompleted = true;
              resolve();
            }
          }
        };
        page.on('framenavigated', handler);

        // Also resolve after 30 seconds timeout
        setTimeout(() => {
          if (!navigationCompleted) {
            resolve();
          }
        }, 30000);
      });

      await navigationPromise;

      console.log('\n4. Checking final state...');

      // Wait a moment for any final requests
      await page.waitForTimeout(3000);

      // Test the API
      console.log('\n5. Testing API for real data...');
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
          console.log('\n💀💀💀 STILL MOCK DATA - CHECK THE NETWORK LOGS ABOVE 💀💀💀');
        }
      } else {
        console.log(`❌ API request failed: ${response.status}`);
      }

      // Also check activities endpoint
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

    } else {
      console.log('❌ Connect Strava button not found');

      // Check what buttons are available
      const allButtons = await page.locator('button, a').all();
      console.log(`\nFound ${allButtons.length} interactive elements on page:`);

      for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
        const button = allButtons[i];
        const text = await button.innerText().catch(() => '');
        const href = await button.getAttribute('href').catch(() => '');
        if (text || href) {
          console.log(`   ${i+1}. "${text}" href="${href}"`);
        }
      }
    }

    console.log('\n✅ OAuth test complete! Review the network logs above for details.');

    // Disconnect but leave Brave open
    await browser.close();

  } catch (error) {
    console.error('❌ Error:', error);

    if (error.message.includes('connect ECONNREFUSED')) {
      console.log('\n💡 Could not connect to Brave. Make sure Brave is running with remote debugging.');
      console.log('   You can manually test by going to:');
      console.log('   https://www.summitchronicles.com/training/realtime');
    }
  }
})();