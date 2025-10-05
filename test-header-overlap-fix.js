const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });
  const page = await browser.newPage();

  console.log('=== TESTING HEADER OVERLAP FIX ===');

  try {
    // Test the realtime page fix
    console.log('\n--- Testing Realtime Page Header Overlap Fix ---');
    await page.goto('http://localhost:3002/training/realtime', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('✓ Realtime page loaded');

    // Take screenshot focusing on header area
    await page.screenshot({
      path: 'header-overlap-test-full.png',
      fullPage: true
    });

    // Take a focused screenshot of just the header area to check overlap
    await page.screenshot({
      path: 'header-overlap-test-top.png',
      clip: { x: 0, y: 0, width: 1400, height: 300 }
    });

    // Check if breadcrumb is visible and properly positioned
    const breadcrumbVisible = await page.locator('text=Live Data').isVisible();
    console.log(`Breadcrumb visible: ${breadcrumbVisible}`);

    // Check header positioning
    const headerRect = await page.locator('header').boundingBox();
    console.log(`Header position: top=${headerRect?.y}, height=${headerRect?.height}`);

    // Check breadcrumb positioning
    const breadcrumbRect = await page.locator('div:has-text("Live Data")').first().boundingBox();
    console.log(`Breadcrumb position: top=${breadcrumbRect?.y}`);

    // Calculate if there's proper spacing
    const spacing = breadcrumbRect?.y - (headerRect?.y + headerRect?.height);
    console.log(`Spacing between header and breadcrumb: ${spacing}px`);

    if (spacing && spacing > 0) {
      console.log('✅ FIXED: Proper spacing between header and breadcrumb');
    } else {
      console.log('❌ STILL OVERLAPPING: Header and breadcrumb are overlapping');
    }

    // Test functionality
    await page.locator('button:has-text("Wellness Metrics")').first().click();
    await page.waitForTimeout(1000);
    console.log('✓ Section toggle still working');

    // Test refresh button
    await page.locator('button:has-text("Refresh")').click();
    await page.waitForTimeout(1000);
    console.log('✓ Refresh button still working');

  } catch (error) {
    console.error('Header overlap test failed:', error.message);
  }

  await browser.close();
  console.log('\n=== HEADER OVERLAP TEST COMPLETE ===');
  console.log('Screenshots saved:');
  console.log('- header-overlap-test-full.png');
  console.log('- header-overlap-test-top.png');
})();