const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🔐 TESTING OAUTH WITH BROWSER SESSION COOKIES...\n');

  // Path to Chrome user data (adjust if needed)
  const chromeUserData = path.join(process.env.HOME, 'Library/Application Support/Google/Chrome/Default');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Go to realtime page
    console.log('1. Going to realtime page...');
    await page.goto('https://www.summitchronicles.com/training/realtime');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'oauth-before-click.png' });

    // Step 2: Click Connect Strava
    console.log('2. Clicking Connect Strava button...');
    const connectButton = page.locator('text=Connect Strava');
    if (await connectButton.count() > 0) {
      console.log('   ✅ Found Connect Strava button');

      // Set up request/response monitoring
      page.on('request', request => {
        if (request.url().includes('strava.com') || request.url().includes('callback')) {
          console.log(`📡 REQUEST: ${request.method()} ${request.url()}`);
        }
      });

      page.on('response', response => {
        if (response.url().includes('strava.com') || response.url().includes('callback')) {
          console.log(`📡 RESPONSE: ${response.status()} ${response.url()}`);
        }
      });

      await connectButton.click();
      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      console.log(`   📍 Current URL: ${currentUrl}`);

      if (currentUrl.includes('strava.com')) {
        console.log('   ✅ Redirected to Strava OAuth page');
        await page.screenshot({ path: 'oauth-strava-auth-page.png' });

        // Look for authorize button
        console.log('3. Looking for authorization button...');
        const authorizeSelectors = [
          'button:has-text("Authorize")',
          'input[value*="Authorize"]',
          'button:has-text("Accept")',
          'button:has-text("Allow")',
          '.btn-orange',
          'form input[type="submit"]'
        ];

        let foundAuthButton = false;
        for (const selector of authorizeSelectors) {
          const element = page.locator(selector);
          if (await element.count() > 0) {
            console.log(`   ✅ Found authorize button: ${selector}`);
            foundAuthButton = true;

            console.log('   🔥 Clicking authorize button...');
            await element.first().click();

            // Wait for redirect back
            await page.waitForTimeout(5000);

            const finalUrl = page.url();
            console.log(`   📍 Final URL: ${finalUrl}`);

            // Parse URL parameters
            if (finalUrl.includes('summitchronicles.com')) {
              console.log('   ✅ Redirected back to Summit Chronicles!');

              const url = new URL(finalUrl);
              const success = url.searchParams.get('success');
              const error = url.searchParams.get('error');
              const details = url.searchParams.get('details');
              const athlete = url.searchParams.get('athlete');

              console.log(`   🎯 Success: ${success || 'none'}`);
              console.log(`   ❌ Error: ${error || 'none'}`);
              console.log(`   📋 Details: ${details ? decodeURIComponent(details) : 'none'}`);
              console.log(`   👤 Athlete: ${athlete || 'none'}`);

              await page.screenshot({ path: 'oauth-callback-result.png' });

              // Test API again after OAuth
              console.log('\n4. Testing API after OAuth completion...');
              await page.waitForTimeout(2000);

              const response = await fetch('https://www.summitchronicles.com/api/training/metrics');
              if (response.ok) {
                const data = await response.json();
                console.log(`   📊 Data source: ${data.source}`);
                console.log(`   📈 Total activities: ${data.totalActivities}`);
                console.log(`   💓 Resting HR: ${data.metrics?.currentStats?.currentRestingHR?.value}`);
                console.log(`   ⛰️  Elevation: ${data.metrics?.currentStats?.totalElevationThisYear?.value}`);

                if (data.debug) {
                  console.log(`   🆔 First activity ID: ${data.debug.firstActivityId}`);
                  console.log(`   ✅ Is real Strava: ${data.debug.isRealStrava}`);
                }

                if (data.source === 'strava') {
                  console.log('\n🎉🎉🎉 SUCCESS! REAL STRAVA DATA IS NOW WORKING! 🎉🎉🎉');
                } else {
                  console.log('\n💀💀💀 STILL MOCK DATA - OAUTH CALLBACK FAILED 💀💀💀');
                }
              }
            }
            break;
          }
        }

        if (!foundAuthButton) {
          console.log('   ❌ No authorize button found');
          console.log('   📄 Page content preview:');
          const pageText = await page.textContent('body');
          console.log(pageText.substring(0, 500) + '...');
        }

      } else {
        console.log('   ❌ Did not redirect to Strava');
      }
    } else {
      console.log('   ❌ Connect Strava button not found');
    }

    console.log('\n✅ OAuth test with browser session complete!');

  } catch (error) {
    console.error('❌ Error during OAuth test:', error);
    await page.screenshot({ path: 'oauth-browser-session-error.png' });
  } finally {
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();