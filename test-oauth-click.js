const { chromium } = require('playwright');

(async () => {
  console.log('🎯 TESTING: Actual Connect Strava Button Click...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 2000  // Slow down for visibility
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('1. Going to realtime page...');
    await page.goto('https://www.summitchronicles.com/training/realtime');
    await page.waitForLoadState('networkidle');

    // Find and inspect the Connect Strava button more thoroughly
    console.log('2. Looking for Connect Strava button...');

    // Try multiple selectors to find the button
    const selectors = [
      'text=Connect Strava',
      'a:has-text("Connect Strava")',
      'button:has-text("Connect Strava")',
      '[href="/api/strava/auth"]',
      '.bg-orange-600'
    ];

    let foundButton = null;
    let workingSelector = null;

    for (const selector of selectors) {
      const element = page.locator(selector);
      const count = await element.count();
      console.log(`   Selector "${selector}": ${count} elements found`);

      if (count > 0 && !foundButton) {
        foundButton = element.first();
        workingSelector = selector;
      }
    }

    if (foundButton) {
      console.log(`✅ Found button with selector: ${workingSelector}`);

      // Get button details
      const tagName = await foundButton.evaluate(el => el.tagName);
      const href = await foundButton.getAttribute('href');
      const text = await foundButton.innerText();
      const classes = await foundButton.getAttribute('class');

      console.log(`   Tag: ${tagName}`);
      console.log(`   Text: "${text}"`);
      console.log(`   Href: ${href || 'null'}`);
      console.log(`   Classes: ${classes || 'none'}`);

      console.log('\n3. Clicking Connect Strava button...');

      // Take screenshot before click
      await page.screenshot({ path: 'before-strava-click.png' });

      // Click the button
      await foundButton.click();

      // Wait for navigation
      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      console.log(`   Current URL after click: ${currentUrl}`);

      // Take screenshot after click
      await page.screenshot({ path: 'after-strava-click.png' });

      if (currentUrl.includes('strava.com')) {
        console.log('   ✅ SUCCESS! Redirected to Strava OAuth page');

        // Check OAuth parameters
        const url = new URL(currentUrl);
        const clientId = url.searchParams.get('client_id');
        const scope = url.searchParams.get('scope');
        const redirectUri = url.searchParams.get('redirect_uri');

        console.log(`   🆔 Client ID: "${clientId}"`);
        console.log(`   🔐 Scope: "${scope}"`);
        console.log(`   🔄 Redirect URI: "${redirectUri}"`);

        // Check if this is a proper OAuth page
        const pageTitle = await page.title();
        console.log(`   📄 Page title: "${pageTitle}"`);

        if (pageTitle.includes('Strava') || pageTitle.includes('Authorization')) {
          console.log('   ✅ This appears to be the Strava OAuth page');
        }

      } else {
        console.log('   ❌ Did not redirect to Strava');
        console.log('   Current page title:', await page.title());
      }

    } else {
      console.log('❌ Connect Strava button not found with any selector!');

      // Let's see what buttons ARE available
      const allButtons = await page.locator('button, a, [role="button"]').all();
      console.log(`\nFound ${allButtons.length} interactive elements:`);

      for (let i = 0; i < Math.min(allButtons.length, 15); i++) {
        const element = allButtons[i];
        const text = await element.innerText().catch(() => '');
        const href = await element.getAttribute('href');
        const classes = await element.getAttribute('class');
        const tag = await element.evaluate(el => el.tagName);

        if (text.length > 0) {
          console.log(`   ${i+1}. ${tag}: "${text}" href="${href || 'none'}" class="${classes || 'none'}"`);
        }
      }
    }

    console.log('\n✅ OAuth click test complete!');

  } catch (error) {
    console.error('❌ Error during OAuth click test:', error);
    await page.screenshot({ path: 'oauth-click-error.png' });
  } finally {
    // Keep browser open for a moment to see result
    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();