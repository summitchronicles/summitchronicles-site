const { chromium } = require('playwright');

async function getBuildErrors() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 Getting detailed build errors...');
    
    // Navigate to the latest failed deployment
    await page.goto('https://vercel.com/summit-chronicles-projects/summit-chronicles-starter/CnsB9JRssVCEhYchZY1wwZ37TfCL');
    await page.waitForTimeout(3000);
    
    // Expand Build Logs section
    const buildLogsSection = page.locator('text=Build Logs').first();
    if (await buildLogsSection.isVisible()) {
      await buildLogsSection.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for error logs
    const errorLogs = await page.locator('[class*="error"], .error, [data-level="error"]').allTextContents();
    
    console.log('❌ Build Errors Found:');
    errorLogs.forEach((error, i) => {
      if (error.trim()) {
        console.log(`\n${i + 1}. ${error}`);
      }
    });
    
    // Look for specific log entries
    const logEntries = await page.locator('.build-log-entry, [data-testid*="log"]').allTextContents();
    
    console.log('\n📋 Recent Build Log Entries:');
    logEntries.slice(-20).forEach((entry, i) => {
      if (entry.trim() && (entry.includes('Error') || entry.includes('Failed') || entry.includes('exited'))) {
        console.log(`${i + 1}. ${entry}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error getting build details:', error);
  } finally {
    await browser.close();
  }
}

getBuildErrors().catch(console.error);