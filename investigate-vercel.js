const { chromium } = require('playwright');

async function investigateVercel() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 Investigating Vercel deployment issues...');
    
    // Navigate to the latest failed deployment
    const deploymentUrl = 'https://vercel.com/summit-chronicles-projects/summit-chronicles-starter/CnsB9JRssVCEhYchZY1wwZ37TfCL';
    console.log(`Navigating to: ${deploymentUrl}`);
    
    await page.goto(deploymentUrl);
    await page.waitForTimeout(3000);
    
    // Take a screenshot of the deployment overview
    await page.screenshot({ 
      path: 'vercel-deployment-overview.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot saved: vercel-deployment-overview.png');
    
    // Look for build logs or error information
    console.log('🔍 Looking for build logs and error information...');
    
    // Check if there's a "View Function Logs" or "Build Logs" button
    const buildLogButton = page.locator('button:has-text("View Function Logs"), button:has-text("Build Logs"), button:has-text("View Build"), a:has-text("View Build")');
    
    if (await buildLogButton.count() > 0) {
      console.log('📋 Found build log button, clicking...');
      await buildLogButton.first().click();
      await page.waitForTimeout(2000);
      
      // Take screenshot of build logs
      await page.screenshot({ 
        path: 'vercel-build-logs.png', 
        fullPage: true 
      });
      console.log('📸 Build logs screenshot: vercel-build-logs.png');
    }
    
    // Look for specific error messages
    const errorMessages = await page.locator('[data-testid="build-error"], .error, [class*="error"]').allTextContents();
    if (errorMessages.length > 0) {
      console.log('❌ Error messages found:');
      errorMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. ${msg}`);
      });
    }
    
    // Navigate to project settings
    console.log('🔧 Checking project settings...');
    await page.goto('https://vercel.com/summit-chronicles-projects/summit-chronicles-starter/settings');
    await page.waitForTimeout(2000);
    
    // Take screenshot of settings
    await page.screenshot({ 
      path: 'vercel-settings.png', 
      fullPage: true 
    });
    console.log('📸 Settings screenshot: vercel-settings.png');
    
    // Check environment variables
    const envVarsLink = page.locator('a[href*="environment-variables"], button:has-text("Environment Variables")');
    if (await envVarsLink.count() > 0) {
      console.log('🔧 Navigating to environment variables...');
      await envVarsLink.first().click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: 'vercel-env-vars.png', 
        fullPage: true 
      });
      console.log('📸 Environment variables screenshot: vercel-env-vars.png');
    }
    
    // Check Functions settings for build cache
    const functionsLink = page.locator('a[href*="functions"], button:has-text("Functions")');
    if (await functionsLink.count() > 0) {
      console.log('⚙️ Checking Functions settings...');
      await functionsLink.first().click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: 'vercel-functions.png', 
        fullPage: true 
      });
      console.log('📸 Functions settings screenshot: vercel-functions.png');
      
      // Look for build cache clear option
      const clearCacheButton = page.locator('button:has-text("Clear Build Cache"), button:has-text("Clear Cache")');
      if (await clearCacheButton.count() > 0) {
        console.log('🗑️ Found Clear Build Cache button!');
        console.log('🔧 ACTION NEEDED: Click "Clear Build Cache" button and redeploy');
      }
    }
    
    console.log('✅ Investigation complete! Check the screenshots for detailed information.');
    
  } catch (error) {
    console.error('❌ Error during investigation:', error);
  } finally {
    await browser.close();
  }
}

// Run the investigation
investigateVercel().catch(console.error);