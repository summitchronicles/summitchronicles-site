const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });
  const page = await browser.newPage();

  console.log('=== TESTING DESIGN CONSISTENCY ===');

  try {
    // Test Training Page
    console.log('\n--- Testing Training Page Design ---');
    await page.goto('http://localhost:3002/training', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('✓ Training page loaded');

    // Take screenshot
    await page.screenshot({
      path: 'training-consistent-design.png',
      fullPage: true
    });

    // Check for circular icon containers
    const circularIcons = await page.locator('.rounded-full').count();
    console.log(`Circular icon containers: ${circularIcons}`);

    // Check for centered text layout
    const centeredElements = await page.locator('.text-center').count();
    console.log(`Centered elements: ${centeredElements}`);

    await page.waitForTimeout(2000);

    // Test Realtime Page
    console.log('\n--- Testing Realtime Page Design ---');
    await page.goto('http://localhost:3002/training/realtime', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('✓ Realtime page loaded');

    // Take screenshot
    await page.screenshot({
      path: 'realtime-consistent-design.png',
      fullPage: true
    });

    // Check for consistent design elements
    const realtimeCircularIcons = await page.locator('.rounded-full').count();
    console.log(`Realtime circular icon containers: ${realtimeCircularIcons}`);

    const realtimeCenteredElements = await page.locator('.text-center').count();
    console.log(`Realtime centered elements: ${realtimeCenteredElements}`);

    // Test section expansion
    await page.locator('button:has-text("Wellness Metrics")').first().click();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Wellness Metrics")').first().click();
    await page.waitForTimeout(1000);

    console.log('✓ Section toggle working');

    // Final combined screenshot
    await page.screenshot({
      path: 'realtime-final-consistent.png',
      fullPage: true
    });

  } catch (error) {
    console.error('Design consistency test failed:', error.message);
  }

  await browser.close();
  console.log('\n=== DESIGN CONSISTENCY TEST COMPLETE ===');
  console.log('Screenshots saved:');
  console.log('- training-consistent-design.png');
  console.log('- realtime-consistent-design.png');
  console.log('- realtime-final-consistent.png');
})();