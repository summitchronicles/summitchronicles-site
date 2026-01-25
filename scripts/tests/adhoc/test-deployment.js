const { chromium } = require('playwright');

async function testDeployment() {
  console.log('🧪 Testing actual deployment status...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Test the admin editor page
    console.log('📍 Testing: https://www.summitchronicles.com/admin/editor');

    const response = await page.goto('https://www.summitchronicles.com/admin/editor', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log(`📊 Response status: ${response.status()}`);
    console.log(`📊 Response URL: ${response.url()}`);

    // Wait a moment for any redirects
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const title = await page.title();

    console.log(`📊 Final URL: ${currentUrl}`);
    console.log(`📊 Page title: ${title}`);

    // Check if it's a 404 or actual page
    const pageText = await page.textContent('body');
    const isNotFound = pageText.includes('404') || pageText.includes('Not Found') || pageText.includes('This page could not be found');

    if (response.status() === 404 || isNotFound) {
      console.log('❌ CONFIRMED: Admin editor returns 404 - new version NOT deployed');
      console.log('📝 Page content preview:', pageText.substring(0, 200) + '...');
    } else {
      console.log('✅ Admin editor page exists!');
      console.log(`📝 Response status: ${response.status()}`);

      // Check if it's the magazine editor
      const hasMagazineEditor = pageText.includes('magazine') || pageText.includes('MagazineBlogEditor') || pageText.includes('professional content');

      if (hasMagazineEditor) {
        console.log('✅ Magazine editor detected in content!');
      } else {
        console.log('⚠️ Admin page exists but magazine editor content not detected');
      }
    }

    // Also test the main page
    console.log('\n📍 Testing main page: https://www.summitchronicles.com');
    const mainResponse = await page.goto('https://www.summitchronicles.com');
    const mainTitle = await page.title();
    console.log(`📊 Main page status: ${mainResponse.status()}`);
    console.log(`📊 Main page title: ${mainTitle}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testDeployment();