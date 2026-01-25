const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to a standard desktop size
  await page.setViewportSize({ width: 1440, height: 900 });

  // Navigate to expeditions page
  await page.goto('http://localhost:3000/expeditions');

  // Wait for page to load
  await page.waitForTimeout(2000);

  // Scroll down to see the timeline content
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);

  // Take screenshot of timeline section
  await page.screenshot({
    path: 'expeditions-timeline.png',
    fullPage: false
  });

  console.log('Screenshot saved as expeditions-layout.png');

  await browser.close();
})();