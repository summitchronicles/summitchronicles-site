const { spawn } = require('child_process');
const { chromium } = require('playwright');

(async () => {
  console.log('🔥 TESTING OAUTH WITH ACTUAL BRAVE BROWSER...\n');

  // Launch Brave browser directly
  console.log('1. Launching Brave browser...');

  // Brave browser executable path on macOS
  const braveExecutable = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

  try {
    // Launch Brave with remote debugging enabled
    const braveProcess = spawn(braveExecutable, [
      '--remote-debugging-port=9222',
      '--new-window',
      'https://www.strava.com/login'
    ], {
      detached: true,
      stdio: 'ignore'
    });

    console.log('✅ Brave browser launched with remote debugging');
    console.log('📍 Opened Strava login page in Brave');

    // Wait for Brave to start up
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Connect to the existing Brave instance
    console.log('\n2. Connecting to Brave browser...');
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const contexts = browser.contexts();
    const context = contexts[0];
    const pages = context.pages();
    const page = pages[0];

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
      }
    });

    console.log('\n🟡 MANUAL ACTIONS:');
    console.log('   1. Log into Strava in the Brave browser window');
    console.log('   2. Press Enter here when logged in...');

    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    console.log('\n3. Navigating to Summit Chronicles...');
    await page.goto('https://www.summitchronicles.com/training/realtime');
    await page.waitForLoadState('networkidle');

    console.log('\n🟡 MANUAL ACTIONS:');
    console.log('   1. Click "Connect Strava" button in Brave');
    console.log('   2. Authorize Summit Chronicles when prompted');
    console.log('   3. Wait to be redirected back');
    console.log('   4. Press Enter here when complete...');

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

    // Wait for OAuth completion
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    console.log('\n4. Testing final results...');

    // Test the API
    const response = await fetch('https://www.summitchronicles.com/api/training/metrics');
    if (response.ok) {
      const data = await response.json();
      console.log(`\n📊 FINAL RESULTS:`);
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
        console.log('\n💀💀💀 STILL MOCK DATA - CHECK THE LOGS ABOVE FOR ERRORS 💀💀💀');
      }
    } else {
      console.log(`❌ API request failed: ${response.status}`);
    }

    console.log('\n✅ OAuth test with actual Brave browser complete!');

    // Disconnect but leave Brave open
    await browser.close();

  } catch (error) {
    console.error('❌ Error:', error);

    if (error.message.includes('ENOENT')) {
      console.log('\n💡 Brave browser not found at expected location.');
      console.log('   Please check if Brave is installed at: /Applications/Brave Browser.app');
      console.log('   Or manually open Brave and complete the OAuth flow at:');
      console.log('   https://www.summitchronicles.com/training/realtime');
    } else if (error.message.includes('connect ECONNREFUSED')) {
      console.log('\n💡 Could not connect to Brave remote debugging.');
      console.log('   Try closing all Brave windows and running this script again.');
    }
  }
})();