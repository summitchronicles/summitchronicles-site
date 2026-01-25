const { chromium } = require('playwright');

(async () => {
  console.log('🔥 TESTING COMPLETE OAUTH FLOW - NO BULLSHIT...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Step 1: Start OAuth flow
    console.log('1. Starting OAuth flow...');
    await page.goto('https://www.summitchronicles.com/training/realtime');
    await page.waitForLoadState('networkidle');

    const connectButton = page.locator('text=Connect Strava');
    if (await connectButton.count() > 0) {
      console.log('   ✅ Found Connect Strava button');
      await connectButton.click();
      await page.waitForTimeout(3000);

      if (page.url().includes('strava.com')) {
        console.log('   ✅ Redirected to Strava OAuth');
        await page.screenshot({ path: 'oauth-strava-page.png' });

        // Step 2: Look for authorization elements
        console.log('\n2. Looking for authorization options...');

        // Try to find authorize button or similar
        const authSelectors = [
          'button:has-text("Authorize")',
          'input[value*="Authorize"]',
          'button:has-text("Accept")',
          'button:has-text("Allow")',
          'form button[type="submit"]',
          '.btn-orange',
          '[data-testid="authorize"]'
        ];

        let foundAuth = false;
        for (const selector of authSelectors) {
          const element = page.locator(selector);
          const count = await element.count();
          if (count > 0) {
            console.log(`   ✅ Found auth element: ${selector} (${count} found)`);
            foundAuth = true;

            // Take screenshot and try to click
            console.log(`   🔥 ATTEMPTING TO AUTHORIZE...`);
            await element.first().click();
            await page.waitForTimeout(5000);

            console.log(`   📍 URL after auth attempt: ${page.url()}`);

            if (page.url().includes('summitchronicles.com')) {
              console.log('   ✅ REDIRECTED BACK TO SUMMIT CHRONICLES!');

              // Check URL parameters
              const url = new URL(page.url());
              const success = url.searchParams.get('success');
              const athlete = url.searchParams.get('athlete');
              const error = url.searchParams.get('error');

              console.log(`   🏃 Success param: ${success}`);
              console.log(`   👤 Athlete param: ${athlete}`);
              console.log(`   ❌ Error param: ${error}`);

              if (success === 'strava_connected') {
                console.log('   🎉 OAUTH SUCCESS DETECTED!');
              } else if (error) {
                console.log(`   💀 OAUTH ERROR: ${error}`);
              }

              // Step 3: Test if data changes after auth
              console.log('\n3. Testing data after OAuth...');
              await page.waitForTimeout(3000);

              // Check metrics API
              const response = await fetch('https://www.summitchronicles.com/api/training/metrics');
              if (response.ok) {
                const data = await response.json();
                console.log(`   📊 Data source after auth: ${data.source}`);
                console.log(`   📈 Total activities after auth: ${data.totalActivities}`);

                if (data.debug) {
                  console.log(`   🆔 First activity ID: ${data.debug.firstActivityId}`);
                  console.log(`   ✅ Is real Strava: ${data.debug.isRealStrava}`);
                }

                if (data.source === 'strava') {
                  console.log('   🎉 SUCCESS! NOW USING REAL STRAVA DATA!');
                } else {
                  console.log('   💀 STILL USING MOCK DATA - SOMETHING IS BROKEN');
                }
              }

              // Check page status
              const notConnected = await page.locator('text=Not Connected').count();
              const connected = await page.locator('text=Connected to Strava').count();

              console.log(`   🔌 "Not Connected" visible: ${notConnected > 0}`);
              console.log(`   ✅ "Connected to Strava" visible: ${connected > 0}`);

              await page.screenshot({ path: 'after-oauth-complete.png' });

            } else {
              console.log('   ❌ Did not redirect back to Summit Chronicles');
            }
            break;
          }
        }

        if (!foundAuth) {
          console.log('   ❌ NO AUTHORIZE BUTTON FOUND');
          console.log('   🔍 Page content:');
          const pageText = await page.textContent('body');
          console.log(pageText.substring(0, 500) + '...');
        }

      } else {
        console.log('   ❌ Did not redirect to Strava');
      }
    } else {
      console.log('   ❌ Connect Strava button not found');
    }

    // Step 4: Final verification
    console.log('\n4. FINAL VERIFICATION...');

    // Test metrics API one more time
    const finalResponse = await fetch('https://www.summitchronicles.com/api/training/metrics');
    if (finalResponse.ok) {
      const finalData = await finalResponse.json();
      console.log(`\n📊 FINAL DATA SOURCE: ${finalData.source}`);
      console.log(`📈 FINAL TOTAL ACTIVITIES: ${finalData.totalActivities}`);

      const restingHR = finalData.metrics?.currentStats?.currentRestingHR?.value;
      const elevation = finalData.metrics?.currentStats?.totalElevationThisYear?.value;
      console.log(`💓 FINAL RESTING HR: ${restingHR}`);
      console.log(`⛰️  FINAL ELEVATION: ${elevation}`);

      if (finalData.source === 'mock' && restingHR === '104 bpm') {
        console.log('\n💀💀💀 THE DATA IS STILL MOCK - OAUTH FAILED 💀💀💀');
      } else {
        console.log('\n🎉🎉🎉 SUCCESS! REAL DATA IS WORKING! 🎉🎉🎉');
      }
    }

  } catch (error) {
    console.error('💀 ERROR during complete OAuth test:', error);
    await page.screenshot({ path: 'oauth-error.png' });
  } finally {
    console.log('\n⏳ Keeping browser open to see final state...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
})();