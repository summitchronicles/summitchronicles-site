const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Testing Summit Chronicles UI for Strava Connection...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Test main training page
    console.log('1. Testing main training page...');
    await page.goto('https://www.summitchronicles.com/training');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'training-page-full.png', fullPage: true });
    console.log('📸 Full training page screenshot saved: training-page-full.png');

    // Look for any buttons/links related to Strava
    const stravaElements = await page.locator('text=/strava/i').all();
    console.log(`\n   Found ${stravaElements.length} elements containing "strava"`);

    for (let i = 0; i < stravaElements.length; i++) {
      const element = stravaElements[i];
      const text = await element.innerText();
      const tagName = await element.evaluate(el => el.tagName);
      console.log(`   - ${tagName}: "${text}"`);
    }

    // Look for "Connect" buttons
    const connectElements = await page.locator('text=/connect/i').all();
    console.log(`\n   Found ${connectElements.length} elements containing "connect"`);

    for (let i = 0; i < connectElements.length; i++) {
      const element = connectElements[i];
      const text = await element.innerText();
      const tagName = await element.evaluate(el => el.tagName);
      console.log(`   - ${tagName}: "${text}"`);
    }

    // Look for "Sync" buttons
    const syncElements = await page.locator('text=/sync/i').all();
    console.log(`\n   Found ${syncElements.length} elements containing "sync"`);

    for (let i = 0; i < syncElements.length; i++) {
      const element = syncElements[i];
      const text = await element.innerText();
      const tagName = await element.evaluate(el => el.tagName);
      const href = await element.getAttribute('href');
      console.log(`   - ${tagName}: "${text}" href="${href}"`);
    }

    // Test clicking the sync button if it exists
    const syncButton = page.locator('text=/sync/i').first();
    if (await syncButton.count() > 0) {
      console.log('\n2. Testing sync button click...');
      await syncButton.click();
      await page.waitForTimeout(2000);

      // Check if we're redirected or if there's a modal
      const currentUrl = page.url();
      console.log(`   Current URL after sync click: ${currentUrl}`);

      // Take screenshot after click
      await page.screenshot({ path: 'after-sync-click.png', fullPage: true });
      console.log('📸 After sync click screenshot saved: after-sync-click.png');
    }

    // Test realtime page
    console.log('\n3. Testing realtime training page...');
    await page.goto('https://www.summitchronicles.com/training/realtime');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'realtime-page-full.png', fullPage: true });
    console.log('📸 Full realtime page screenshot saved: realtime-page-full.png');

    // Look for Strava elements on realtime page
    const realtimeStravaElements = await page.locator('text=/strava/i').all();
    console.log(`\n   Found ${realtimeStravaElements.length} elements containing "strava" on realtime page`);

    for (let i = 0; i < realtimeStravaElements.length; i++) {
      const element = realtimeStravaElements[i];
      const text = await element.innerText();
      const tagName = await element.evaluate(el => el.tagName);
      console.log(`   - ${tagName}: "${text}"`);
    }

    // Look for any auth/connect buttons on realtime page
    const authElements = await page.locator('text=/auth|connect|login/i').all();
    console.log(`\n   Found ${authElements.length} auth-related elements on realtime page`);

    for (let i = 0; i < authElements.length; i++) {
      const element = authElements[i];
      const text = await element.innerText();
      const tagName = await element.evaluate(el => el.tagName);
      const href = await element.getAttribute('href');
      console.log(`   - ${tagName}: "${text}" href="${href}"`);
    }

    // Test direct auth URL
    console.log('\n4. Testing direct Strava auth URL...');
    await page.goto('https://www.summitchronicles.com/api/strava/auth');
    await page.waitForTimeout(3000);

    const finalUrl = page.url();
    console.log(`   Final URL after auth redirect: ${finalUrl}`);

    if (finalUrl.includes('strava.com')) {
      console.log('   ✅ Successfully redirected to Strava OAuth!');
      await page.screenshot({ path: 'strava-oauth-page.png', fullPage: true });
      console.log('📸 Strava OAuth page screenshot saved: strava-oauth-page.png');
    } else {
      console.log('   ❌ Did not redirect to Strava OAuth');
      await page.screenshot({ path: 'auth-failed.png', fullPage: true });
      console.log('📸 Auth failed screenshot saved: auth-failed.png');
    }

    console.log('\n✅ UI testing complete!');

  } catch (error) {
    console.error('❌ Error during UI testing:', error);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();