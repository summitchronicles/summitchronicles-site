const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // Slow down so we can see what's happening
  });
  const page = await browser.newPage();

  // Capture ALL console messages and errors
  page.on('console', msg => {
    console.log(`CONSOLE ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
    console.log(`STACK: ${error.stack}`);
  });

  page.on('requestfailed', request => {
    console.log(`FAILED REQUEST: ${request.url()} - ${request.failure()?.errorText}`);
  });

  try {
    console.log('Navigating to expeditions page...');
    const response = await page.goto('http://localhost:3002/expeditions', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('Response status:', response?.status());
    console.log('Page URL:', page.url());
    console.log('Page title:', await page.title());

    // Wait a bit more
    await page.waitForTimeout(3000);

    // Check what's actually visible
    const bodyContent = await page.locator('body').textContent();
    console.log('Body content length:', bodyContent.length);
    console.log('First 200 chars:', bodyContent.substring(0, 200));

    // Check for error messages
    const errorElements = await page.locator('text=error', 'text=Error', 'text=404', 'text=Not Found').count();
    console.log('Error elements found:', errorElements);

    // Take screenshot of what's actually showing
    await page.screenshot({ path: 'expeditions-actual.png', fullPage: true });
    console.log('Full page screenshot saved as expeditions-actual.png');

    // Keep browser open for 10 seconds so we can see it
    console.log('Keeping browser open for 10 seconds...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.log('CRITICAL ERROR:', error.message);
    console.log('STACK:', error.stack);
    await page.screenshot({ path: 'expeditions-error.png' });
  }

  await browser.close();
})();