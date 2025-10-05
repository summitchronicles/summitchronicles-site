const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });
  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`CONSOLE ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  console.log('=== ANALYZING TRAINING PAGE ===');

  try {
    // Navigate to training page
    await page.goto('http://localhost:3002/training', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    console.log('✓ Training page loaded');

    // Take full page screenshot
    await page.screenshot({
      path: 'training-page-analysis.png',
      fullPage: true
    });

    // Analyze elements
    const trainingElements = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const buttons = Array.from(document.querySelectorAll('button, a[href]'));
      const cards = Array.from(document.querySelectorAll('[class*="card"], [class*="border"], [class*="rounded"]'));
      const stats = Array.from(document.querySelectorAll('[class*="stat"], [class*="metric"], [class*="grid"]'));

      return {
        totalSections: sections.length,
        sectionsData: sections.map(s => ({
          tagName: s.tagName,
          classList: Array.from(s.classList),
          textPreview: s.textContent?.substring(0, 100) || ''
        })),
        totalButtons: buttons.length,
        buttonData: buttons.map(b => ({
          text: b.textContent?.trim() || '',
          href: b.getAttribute('href') || '',
          classes: Array.from(b.classList)
        })),
        totalCards: cards.length,
        totalStats: stats.length,
        pageTitle: document.title,
        bodyClasses: Array.from(document.body.classList),
        mainHeadings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
          level: h.tagName,
          text: h.textContent?.trim() || ''
        }))
      };
    });

    console.log('Training Page Analysis:', JSON.stringify(trainingElements, null, 2));

    await page.waitForTimeout(3000);

  } catch (error) {
    console.log('Training page error:', error.message);
  }

  console.log('\n=== ANALYZING REALTIME PAGE ===');

  try {
    // Navigate to realtime page
    await page.goto('http://localhost:3002/training/realtime', {
      waitUntil: 'networkidle',
      timeout: 15000
    });

    console.log('✓ Realtime page loaded');

    // Take full page screenshot
    await page.screenshot({
      path: 'realtime-page-analysis.png',
      fullPage: true
    });

    // Analyze elements
    const realtimeElements = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section, div[class*="max-w"]'));
      const dashboards = Array.from(document.querySelectorAll('[class*="dashboard"], [class*="grid"]'));
      const metrics = Array.from(document.querySelectorAll('[class*="metric"], [class*="stat"], [class*="bg-gray-900"]'));
      const buttons = Array.from(document.querySelectorAll('button, a[href]'));
      const statusElements = Array.from(document.querySelectorAll('[class*="status"], [class*="indicator"]'));

      return {
        totalSections: sections.length,
        sectionsData: sections.map(s => ({
          tagName: s.tagName,
          classList: Array.from(s.classList),
          textPreview: s.textContent?.substring(0, 100) || ''
        })),
        totalDashboards: dashboards.length,
        totalMetrics: metrics.length,
        metricsData: metrics.slice(0, 10).map(m => ({
          classes: Array.from(m.classList),
          textPreview: m.textContent?.substring(0, 80) || ''
        })),
        totalButtons: buttons.length,
        buttonData: buttons.map(b => ({
          text: b.textContent?.trim() || '',
          href: b.getAttribute('href') || '',
          classes: Array.from(b.classList)
        })),
        statusElementsCount: statusElements.length,
        pageTitle: document.title,
        mainHeadings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
          level: h.tagName,
          text: h.textContent?.trim() || ''
        }))
      };
    });

    console.log('Realtime Page Analysis:', JSON.stringify(realtimeElements, null, 2));

    await page.waitForTimeout(3000);

  } catch (error) {
    console.log('Realtime page error:', error.message);
  }

  await browser.close();

  console.log('\n=== ANALYSIS COMPLETE ===');
  console.log('Screenshots saved:');
  console.log('- training-page-analysis.png');
  console.log('- realtime-page-analysis.png');
})();