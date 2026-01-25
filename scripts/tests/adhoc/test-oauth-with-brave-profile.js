const { chromium } = require('playwright');
const path = require('path');
const os = require('os');

(async () => {
  console.log('🔐 TESTING OAUTH WITH BRAVE BROWSER PROFILE...\n');

  // Brave browser profile paths for macOS
  const braveProfiles = [
    path.join(os.homedir(), 'Library/Application Support/BraveSoftware/Brave-Browser/Default'),
    path.join(os.homedir(), 'Library/Application Support/BraveSoftware/Brave-Browser/Profile 1'),
    path.join(os.homedir(), 'Library/Application Support/BraveSoftware/Brave-Browser/Person 1'),
  ];

  let userDataDir = null;
  const fs = require('fs');

  // Find existing Brave profile
  for (const profilePath of braveProfiles) {
    if (fs.existsSync(profilePath)) {
      userDataDir = path.dirname(profilePath);
      console.log(`✅ Found Brave profile: ${profilePath}`);
      break;
    }
  }

  if (!userDataDir) {
    console.log('❌ No Brave profile found. Falling back to new session.');
    userDataDir = null;
  }

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    slowMo: 1000,
    channel: 'chrome', // Use Chrome engine compatible with Brave
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox'
    ]
  });

  const page = browser.pages()[0] || await browser.newPage();

  try {
    console.log('1. Checking if logged into Strava...');
    await page.goto('https://www.strava.com');
    await page.waitForLoadState('networkidle');

    // Check if logged in by looking for profile elements
    const profileElements = [
      '[data-testid="athlete-menu"]',
      '.user-menu',
      '.athlete-avatar',
      'a[href*="/athlete/"]',
      'text=Dashboard'
    ];

    let isLoggedIn = false;
    for (const selector of profileElements) {
      if (await page.locator(selector).count() > 0) {
        console.log(`✅ Logged into Strava (found: ${selector})`);
        isLoggedIn = true;
        break;
      }
    }

    if (!isLoggedIn) {
      console.log('❌ Not logged into Strava. Please log in first.');
      console.log('   1. Log into Strava in this browser window');
      console.log('   2. Then re-run this script');
      await page.waitForTimeout(10000);
      await browser.close();
      return;
    }

    // Monitor network requests
    page.on('request', request => {
      if (request.url().includes('summitchronicles.com') || request.url().includes('strava.com/oauth')) {
        console.log(`📡 REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('summitchronicles.com') || response.url().includes('strava.com/oauth')) {
        console.log(`📡 RESPONSE: ${response.status()} ${response.url()}`);
      }
    });

    console.log('\n2. Starting OAuth flow from Summit Chronicles...');
    await page.goto('https://www.summitchronicles.com/training/realtime');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'brave-oauth-before.png' });

    // Click Connect Strava
    const connectButton = page.locator('text=Connect Strava');
    if (await connectButton.count() > 0) {
      console.log('   ✅ Found Connect Strava button');
      await connectButton.click();
      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      console.log(`   📍 Current URL: ${currentUrl}`);

      if (currentUrl.includes('strava.com/oauth')) {
        console.log('   ✅ Redirected to Strava OAuth (should show authorization, not login)');
        await page.screenshot({ path: 'brave-oauth-auth-page.png' });

        // Look for authorization form
        const authButtons = [
          'input[value*="Authorize"]',
          'button:has-text("Authorize")',
          'button:has-text("Accept")',
          'button:has-text("Allow")',
          '.btn-orange',
          'form input[type="submit"]'
        ];

        let foundAuth = false;
        for (const selector of authButtons) {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            console.log(`   ✅ Found authorization control: ${selector}`);
            foundAuth = true;

            console.log('   🔥 AUTHORIZING Summit Chronicles...');
            await element.first().click();
            await page.waitForTimeout(5000);

            const finalUrl = page.url();
            console.log(`   📍 Final URL after auth: ${finalUrl}`);

            if (finalUrl.includes('summitchronicles.com')) {
              console.log('   ✅ REDIRECTED BACK TO SUMMIT CHRONICLES!');

              const url = new URL(finalUrl);
              const success = url.searchParams.get('success');
              const error = url.searchParams.get('error');
              const details = url.searchParams.get('details');
              const athlete = url.searchParams.get('athlete');

              console.log(`\n📋 CALLBACK RESULTS:`);
              console.log(`   🎯 Success: ${success || 'none'}`);
              console.log(`   ❌ Error: ${error || 'none'}`);
              console.log(`   📋 Details: ${details ? decodeURIComponent(details) : 'none'}`);
              console.log(`   👤 Athlete: ${athlete || 'none'}`);

              await page.screenshot({ path: 'brave-oauth-callback-result.png' });

              // Wait and test API
              console.log('\n3. Testing API for real data...');
              await page.waitForTimeout(3000);

              const response = await fetch('https://www.summitchronicles.com/api/training/metrics');
              if (response.ok) {
                const data = await response.json();
                console.log(`\n📊 FINAL DATA CHECK:`);
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
                  console.log('\n💀💀💀 STILL MOCK DATA - SOMETHING FAILED 💀💀💀');

                  if (error || details) {
                    console.log('🔍 CHECK THE CALLBACK ERROR DETAILS ABOVE FOR THE ROOT CAUSE');
                  }
                }
              }
            } else {
              console.log('   ❌ Did not redirect back to Summit Chronicles');
              console.log(`   🔍 Still on: ${finalUrl}`);
            }
            break;
          }
        }

        if (!foundAuth) {
          console.log('   ❌ No authorization controls found');
          const pageContent = await page.textContent('body');
          console.log(`   📄 Page contains: ${pageContent.substring(0, 200)}...`);
        }

      } else if (currentUrl.includes('strava.com/login')) {
        console.log('   ❌ Redirected to Strava login - you need to log in first');
        console.log('   💡 Please log into Strava in this browser window');
      } else {
        console.log('   ❌ Unexpected redirect');
        console.log(`   📍 Went to: ${currentUrl}`);
      }
    } else {
      console.log('   ❌ Connect Strava button not found');
    }

    console.log('\n✅ OAuth test with Brave profile complete!');

  } catch (error) {
    console.error('❌ Error during OAuth test:', error);
    await page.screenshot({ path: 'brave-oauth-error.png' });
  } finally {
    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
})();