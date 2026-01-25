const { chromium } = require('playwright');

async function testProductionDemoRemoval() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const productionUrl = 'https://summitchronicles.com';

  console.log('🚀 Testing production deployment for demo content removal...');
  console.log(`📍 Production URL: ${productionUrl}`);

  try {
    // Test 1: Check blog listing page doesn't show demo content
    console.log('\n📝 Test 1: Checking blog listing page for demo content...');
    await page.goto(`${productionUrl}/blog`);
    await page.waitForLoadState('networkidle');

    const blogContent = await page.textContent('body');
    const hasDemoContent = blogContent.includes('My First Climb') ||
                          blogContent.includes('The Spark I Didn\'t See Coming');

    if (hasDemoContent) {
      console.log('❌ FAIL: Demo content still visible in blog listing');
      return false;
    } else {
      console.log('✅ PASS: Demo content not visible in blog listing');
    }

    // Test 2: Check demo URL returns 404
    console.log('\n📝 Test 2: Checking demo blog URL returns 404...');
    const demoResponse = await page.goto(`${productionUrl}/blog/my-first-climb-the-spark-i-didnt-see-coming`, {
      waitUntil: 'networkidle'
    });

    if (demoResponse.status() === 404) {
      console.log('✅ PASS: Demo blog URL returns 404 as expected');
    } else {
      console.log(`❌ FAIL: Demo blog URL returned ${demoResponse.status()}, expected 404`);
      return false;
    }

    // Test 3: Check API endpoint doesn't return demo content
    console.log('\n📝 Test 3: Checking API endpoint for demo content...');
    const apiResponse = await page.goto(`${productionUrl}/api/posts`, {
      waitUntil: 'networkidle'
    });

    const apiData = await apiResponse.json();
    const apiHasDemoContent = JSON.stringify(apiData).includes('My First Climb') ||
                             JSON.stringify(apiData).includes('The Spark I Didn\'t See Coming');

    if (apiHasDemoContent) {
      console.log('❌ FAIL: Demo content still returned by API endpoint');
      return false;
    } else {
      console.log('✅ PASS: API endpoint does not return demo content');
    }

    // Test 4: General site health check
    console.log('\n📝 Test 4: General site health check...');
    await page.goto(productionUrl);
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    // Check for any obvious errors
    const errors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[data-testid*="error"], .error, [class*="error"]');
      return Array.from(errorElements).map(el => el.textContent);
    });

    if (errors.length > 0) {
      console.log('⚠️  Potential errors found:', errors);
    } else {
      console.log('✅ PASS: No obvious errors detected on homepage');
    }

    console.log('\n🎉 All tests passed! Demo content removal successful on production.');
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Run the test
testProductionDemoRemoval().then(success => {
  if (success) {
    console.log('\n✅ Production deployment verification COMPLETED successfully');
    process.exit(0);
  } else {
    console.log('\n❌ Production deployment verification FAILED');
    process.exit(1);
  }
});