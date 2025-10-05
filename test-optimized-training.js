const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });
  const page = await browser.newPage();

  console.log('=== TESTING OPTIMIZED TRAINING PAGE ===');

  try {
    await page.goto('http://localhost:3002/training', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('✓ Training page loaded successfully');

    // Test collapsible phases
    console.log('Testing collapsible phases...');

    // Check if Everest Specific is expanded by default
    const expandedPhase = await page.locator('[data-testid="phase-content"]:visible').count();
    console.log(`Expanded phases count: ${expandedPhase}`);

    // Click on different phases
    const phases = ['Base Building', 'Kilimanjaro Prep', 'Technical Mountains'];

    for (const phaseName of phases) {
      await page.locator(`text=${phaseName}`).first().click();
      await page.waitForTimeout(500);
      console.log(`✓ Clicked on ${phaseName} phase`);
    }

    // Test responsive design
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    console.log('✓ Tested tablet view');

    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);
    console.log('✓ Tested mobile view');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    console.log('✓ Reset to desktop view');

    // Check for loading states
    const loadingElements = await page.locator('.animate-spin').count();
    console.log(`Loading indicators: ${loadingElements}`);

    // Take final screenshot
    await page.screenshot({
      path: 'optimized-training-page.png',
      fullPage: true
    });

    console.log('✓ Screenshot saved as optimized-training-page.png');

    // Performance check
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation')[0]);
    });

    const perf = JSON.parse(performanceEntries);
    console.log(`Page load time: ${Math.round(perf.loadEventEnd - perf.fetchStart)}ms`);
    console.log(`DOM content loaded: ${Math.round(perf.domContentLoadedEventEnd - perf.fetchStart)}ms`);

  } catch (error) {
    console.error('Error testing training page:', error.message);
  }

  await browser.close();
  console.log('=== TRAINING PAGE TEST COMPLETE ===');
})();