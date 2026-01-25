const { chromium } = require('playwright');

async function properDeploymentCheck() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 PROPER DEPLOYMENT CHECK');
    console.log('='.repeat(60));
    
    // 1. Check the failed Vercel deployment
    const failedDeploymentUrl = 'https://vercel.com/summit-chronicles-projects/summit-chronicles-starter/6rfzUREScukEr5eZoTN1kwU5pDcx';
    console.log(`\n❌ Checking FAILED deployment: ${failedDeploymentUrl}`);
    
    await page.goto(failedDeploymentUrl, { timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // Get build error details
    await page.screenshot({ path: 'failed-deployment-details.png', fullPage: true });
    console.log('📸 Failed deployment screenshot: failed-deployment-details.png');
    
    // Look for specific error messages in build logs
    const errorLogs = await page.locator('.error, [data-level="error"], [class*="error"]').allTextContents();
    console.log('\n❌ BUILD ERRORS FOUND:');
    errorLogs.forEach((error, i) => {
      if (error.trim()) {
        console.log(`${i + 1}. ${error}`);
      }
    });
    
    // 2. Check what's actually live on summitchronicles.com
    console.log('\n🌐 CHECKING LIVE SITE: summitchronicles.com');
    await page.goto('https://summitchronicles.com', { timeout: 30000 });
    
    const currentTitle = await page.title();
    const lastModified = await page.locator('[data-updated], [data-timestamp], .timestamp').allTextContents();
    
    console.log(`Current site title: ${currentTitle}`);
    console.log(`Last modified info: ${lastModified.join(', ')}`);
    
    // 3. TEST TRAINING UPLOAD FUNCTIONALITY
    console.log('\n🏋️ TESTING TRAINING UPLOAD FUNCTIONALITY');
    
    // Go to training page
    await page.goto('https://summitchronicles.com/training', { timeout: 30000 });
    await page.screenshot({ path: 'current-training-page.png', fullPage: true });
    
    // Look for upload/data entry functionality
    const uploadElements = await page.locator('input[type="file"], button:has-text("Upload"), button:has-text("Add"), button:has-text("Log"), [data-testid*="upload"]').count();
    const dataEntryForms = await page.locator('form, input[type="text"], textarea, select').count();
    
    console.log(`Upload elements found: ${uploadElements}`);
    console.log(`Data entry forms found: ${dataEntryForms}`);
    
    // Look for training-specific functionality
    const trainingFeatures = [
      'manual entry',
      'data entry', 
      'upload training',
      'log workout',
      'add workout',
      'training log'
    ];
    
    const bodyText = await page.textContent('body');
    const foundTrainingFeatures = trainingFeatures.filter(feature => 
      bodyText?.toLowerCase().includes(feature)
    );
    
    console.log(`Training features found: ${foundTrainingFeatures.join(', ')}`);
    
    // 4. Test if we can access training admin/upload areas
    console.log('\n🔐 TESTING TRAINING ADMIN ACCESS');
    
    const adminRoutes = [
      '/training-hub',
      '/training/upload', 
      '/training/manual',
      '/admin/training'
    ];
    
    const adminResults = {};
    
    for (const route of adminRoutes) {
      try {
        console.log(`Testing: https://summitchronicles.com${route}`);
        const response = await page.goto(`https://summitchronicles.com${route}`, { timeout: 15000 });
        const status = response?.status();
        adminResults[route] = { status, working: status === 200 };
        console.log(`  Status: ${status}`);
      } catch (error) {
        console.log(`  Error: ${error.message}`);
        adminResults[route] = { status: 'error', working: false };
      }
    }
    
    // 5. Check what Vercel deployment is actually serving summitchronicles.com
    console.log('\n🔍 CHECKING WHICH DEPLOYMENT IS LIVE');
    
    await page.goto('https://summitchronicles.com', { timeout: 30000 });
    
    // Check page source for deployment identifiers
    const pageSource = await page.content();
    const vercelInfo = pageSource.match(/vercel[^"]*|deployment[^"]*|build[^"]*|_next\/static\/[^"]+/gi);
    
    console.log('Vercel deployment info found in page:', vercelInfo?.slice(0, 5));
    
    return {
      deploymentStatus: 'FAILED - 45 minutes then error',
      uploadElements,
      dataEntryForms,
      foundTrainingFeatures,
      adminResults,
      currentSiteInfo: {
        title: currentTitle,
        hasTrainingUpload: foundTrainingFeatures.length > 0,
        isFromNewDeployment: false // Based on error status
      }
    };
    
  } catch (error) {
    console.error('❌ Error in deployment check:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Run the proper check
properDeploymentCheck().then(results => {
  console.log('\n📊 DEPLOYMENT CHECK RESULTS:');
  console.log('='.repeat(60));
  console.log(JSON.stringify(results, null, 2));
  
  if (results.deploymentStatus?.includes('FAILED')) {
    console.log('\n❌ DEPLOYMENT FAILED - No new functionality deployed');
    console.log('🔧 ACTION NEEDED: Fix deployment errors and redeploy');
  }
  
}).catch(console.error);