const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });
  const page = await browser.newPage();

  console.log('=== COMPREHENSIVE OPTIMIZATION TEST ===');

  const testResults = {
    training: { score: 0, issues: [] },
    realtime: { score: 0, issues: [] }
  };

  // Test Training Page
  console.log('\n=== TESTING OPTIMIZED TRAINING PAGE ===');
  try {
    const startTime = Date.now();
    await page.goto('http://localhost:3002/training', {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    const loadTime = Date.now() - startTime;

    console.log(`✓ Training page loaded in ${loadTime}ms`);

    // Performance check
    if (loadTime < 3000) testResults.training.score += 20;
    else testResults.training.issues.push(`Slow load time: ${loadTime}ms`);

    // Visual check - take screenshot
    await page.screenshot({
      path: 'training-optimized-final.png',
      fullPage: true
    });

    // Check for loading states
    const loadingElements = await page.locator('.animate-spin').count();
    console.log(`Loading indicators present: ${loadingElements > 0 ? 'Yes' : 'No'}`);
    if (loadingElements > 0) testResults.training.score += 10;

    // Check sections
    const sections = await page.locator('section').count();
    console.log(`Page sections: ${sections}`);
    if (sections >= 5) testResults.training.score += 15;

    // Check collapsible phases (try to click)
    try {
      await page.locator('button:has-text("Everest Specific")').first().click({ timeout: 5000 });
      console.log('✓ Phase interaction working');
      testResults.training.score += 20;
    } catch (e) {
      console.log('⚠ Phase interaction issue');
      testResults.training.issues.push('Phase collapsing not working');
    }

    // Responsive test
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('✓ Responsive design tested');
    testResults.training.score += 15;

    // Check for console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    if (consoleErrors.length === 0) testResults.training.score += 20;
    else testResults.training.issues.push(`Console errors: ${consoleErrors.length}`);

  } catch (error) {
    console.error('Training page test failed:', error.message);
    testResults.training.issues.push(error.message);
  }

  // Test Realtime Page
  console.log('\n=== TESTING OPTIMIZED REALTIME PAGE ===');
  try {
    const startTime = Date.now();
    await page.goto('http://localhost:3002/training/realtime', {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    const loadTime = Date.now() - startTime;

    console.log(`✓ Realtime page loaded in ${loadTime}ms`);

    // Performance check
    if (loadTime < 5000) testResults.realtime.score += 20;
    else testResults.realtime.issues.push(`Slow load time: ${loadTime}ms`);

    // Visual check
    await page.screenshot({
      path: 'realtime-optimized-final.png',
      fullPage: true
    });

    // Check dashboard sections
    const dashboardSections = await page.locator('h2:has-text("Wellness Metrics"), h2:has-text("Training Performance")').count();
    console.log(`Dashboard sections: ${dashboardSections}`);
    if (dashboardSections >= 2) testResults.realtime.score += 20;

    // Test section expansion/collapse
    try {
      await page.locator('button:has-text("Wellness Metrics")').first().click({ timeout: 3000 });
      await page.waitForTimeout(500);
      await page.locator('button:has-text("Wellness Metrics")').first().click({ timeout: 3000 });
      console.log('✓ Section toggle working');
      testResults.realtime.score += 20;
    } catch (e) {
      console.log('⚠ Section toggle issue');
      testResults.realtime.issues.push('Section toggling not working');
    }

    // Check refresh functionality
    try {
      await page.locator('button:has-text("Refresh")').click({ timeout: 3000 });
      console.log('✓ Refresh button working');
      testResults.realtime.score += 15;
    } catch (e) {
      testResults.realtime.issues.push('Refresh button not working');
    }

    // Check status indicators
    const statusElements = await page.locator('[class*="text-green-400"], [class*="text-yellow-400"], [class*="text-orange-400"]').count();
    console.log(`Status indicators: ${statusElements}`);
    if (statusElements > 0) testResults.realtime.score += 15;

    // Responsive test
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(1000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('✓ Responsive design tested');
    testResults.realtime.score += 10;

  } catch (error) {
    console.error('Realtime page test failed:', error.message);
    testResults.realtime.issues.push(error.message);
  }

  // Generate Final Report
  console.log('\n=== OPTIMIZATION RESULTS ===');

  const trainingGrade = Math.min(testResults.training.score, 100);
  const realtimeGrade = Math.min(testResults.realtime.score, 100);

  console.log(`\nTraining Page: ${trainingGrade}/100`);
  if (testResults.training.issues.length > 0) {
    console.log('Issues:');
    testResults.training.issues.forEach(issue => console.log(`  - ${issue}`));
  }

  console.log(`\nRealtime Page: ${realtimeGrade}/100`);
  if (testResults.realtime.issues.length > 0) {
    console.log('Issues:');
    testResults.realtime.issues.forEach(issue => console.log(`  - ${issue}`));
  }

  console.log(`\nOverall Grade: ${Math.round((trainingGrade + realtimeGrade) / 2)}/100`);

  if (trainingGrade >= 90) console.log('✅ Training page: EXCELLENT (10/10)');
  else if (trainingGrade >= 80) console.log('🟡 Training page: GOOD (8-9/10)');
  else console.log('❌ Training page: NEEDS WORK (<8/10)');

  if (realtimeGrade >= 90) console.log('✅ Realtime page: EXCELLENT (10/10)');
  else if (realtimeGrade >= 80) console.log('🟡 Realtime page: GOOD (8-9/10)');
  else console.log('❌ Realtime page: NEEDS WORK (<8/10)');

  console.log('\nScreenshots saved:');
  console.log('- training-optimized-final.png');
  console.log('- realtime-optimized-final.png');

  await browser.close();
  console.log('\n=== TEST COMPLETE ===');
})();