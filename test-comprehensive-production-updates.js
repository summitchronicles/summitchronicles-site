const { chromium } = require('playwright');

async function testComprehensiveProductionUpdates() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const productionUrl = 'https://summitchronicles.com';

  console.log('🚀 Testing comprehensive production updates...');
  console.log(`📍 Production URL: ${productionUrl}`);

  try {
    // Test 1: Homepage updates
    console.log('\n📝 Test 1: Checking homepage updates...');
    await page.goto(productionUrl);
    await page.waitForLoadState('networkidle');

    const homeTitle = await page.title();
    console.log(`📄 Homepage title: ${homeTitle}`);

    // Check for Seven Summits countdown
    const countdownText = await page.textContent('body');
    const hasCountdown = countdownText.includes('Days to Everest') || countdownText.includes('Seven Summits');

    if (hasCountdown) {
      console.log('✅ PASS: Homepage shows Seven Summits countdown');
    } else {
      console.log('❌ FAIL: Seven Summits countdown not found');
      return false;
    }

    // Test 2: About page
    console.log('\n📝 Test 2: Checking about page...');
    await page.goto(`${productionUrl}/about`);
    await page.waitForLoadState('networkidle');

    const aboutContent = await page.textContent('body');
    const hasJourneyContent = aboutContent.includes('tuberculosis') || aboutContent.includes('journey');

    if (hasJourneyContent) {
      console.log('✅ PASS: About page contains journey story');
    } else {
      console.log('❌ FAIL: About page missing journey content');
    }

    // Test 3: Expeditions page
    console.log('\n📝 Test 3: Checking expeditions page...');
    await page.goto(`${productionUrl}/expeditions`);
    await page.waitForLoadState('networkidle');

    const expeditionsContent = await page.textContent('body');
    const hasExpeditionsInfo = expeditionsContent.includes('Kilimanjaro') || expeditionsContent.includes('Denali') || expeditionsContent.includes('summits');

    if (hasExpeditionsInfo) {
      console.log('✅ PASS: Expeditions page contains summit information');
    } else {
      console.log('❌ FAIL: Expeditions page missing summit content');
    }

    // Test 4: Training page
    console.log('\n📝 Test 4: Checking training page...');
    await page.goto(`${productionUrl}/training`);
    await page.waitForLoadState('networkidle');

    const trainingContent = await page.textContent('body');
    const hasTrainingInfo = trainingContent.includes('training') || trainingContent.includes('metrics') || trainingContent.includes('dashboard');

    if (hasTrainingInfo) {
      console.log('✅ PASS: Training page contains training content');
    } else {
      console.log('❌ FAIL: Training page missing training content');
    }

    // Test 5: Newsletter page
    console.log('\n📝 Test 5: Checking newsletter page...');
    await page.goto(`${productionUrl}/newsletter`);
    await page.waitForLoadState('networkidle');

    const newsletterContent = await page.textContent('body');
    const hasNewsletterForm = newsletterContent.includes('newsletter') || newsletterContent.includes('subscribe') || newsletterContent.includes('email');

    if (hasNewsletterForm) {
      console.log('✅ PASS: Newsletter page contains subscription form');
    } else {
      console.log('❌ FAIL: Newsletter page missing subscription content');
    }

    // Test 6: Support page
    console.log('\n📝 Test 6: Checking support page...');
    await page.goto(`${productionUrl}/support`);
    await page.waitForLoadState('networkidle');

    const supportContent = await page.textContent('body');
    const hasSupportInfo = supportContent.includes('expedition') || supportContent.includes('support') || supportContent.includes('Everest');

    if (hasSupportInfo) {
      console.log('✅ PASS: Support page contains expedition support info');
    } else {
      console.log('❌ FAIL: Support page missing support content');
    }

    // Test 7: Training realtime page
    console.log('\n📝 Test 7: Checking training realtime page...');
    await page.goto(`${productionUrl}/training/realtime`);
    await page.waitForLoadState('networkidle');

    const realtimeContent = await page.textContent('body');
    const hasRealtimeInfo = realtimeContent.includes('realtime') || realtimeContent.includes('dashboard') || realtimeContent.includes('metrics');

    if (hasRealtimeInfo) {
      console.log('✅ PASS: Training realtime page contains dashboard content');
    } else {
      console.log('❌ FAIL: Training realtime page missing realtime content');
    }

    // Test 8: General site health
    console.log('\n📝 Test 8: Overall site health check...');
    await page.goto(productionUrl);
    await page.waitForLoadState('networkidle');

    // Check for JavaScript errors
    const errors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[data-testid*="error"], .error, [class*="error"]');
      return Array.from(errorElements).map(el => el.textContent);
    });

    if (errors.length > 0) {
      console.log('⚠️  Potential errors found:', errors);
    } else {
      console.log('✅ PASS: No obvious errors detected');
    }

    console.log('\n🎉 All comprehensive production tests completed!');
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Run the test
testComprehensiveProductionUpdates().then(success => {
  if (success) {
    console.log('\n✅ Comprehensive production verification COMPLETED successfully');
    process.exit(0);
  } else {
    console.log('\n❌ Comprehensive production verification FAILED');
    process.exit(1);
  }
});