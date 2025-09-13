const { chromium } = require('playwright');

async function quickDeploymentCheck() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log(`🔍 Checking deployment at ${new Date().toLocaleTimeString()}`);
    
    // Test the preview URL
    const previewUrl = 'https://summit-chronicles-starter-hyculkspg-summit-chronicles-projects.vercel.app';
    
    await page.goto(previewUrl, { timeout: 15000 });
    
    const title = await page.title();
    const bodyText = await page.textContent('body');
    
    if (bodyText?.toLowerCase().includes('building')) {
      console.log('🔄 Still building...');
      return { status: 'building', title };
    } else if (bodyText?.toLowerCase().includes('error')) {
      console.log('❌ Deployment failed');
      return { status: 'error', title, bodyText: bodyText.substring(0, 200) };
    } else if (title?.includes('Summit Chronicles')) {
      console.log('✅ Deployment successful!');
      
      // Test training functionality
      try {
        await page.goto(`${previewUrl.replace('https://', 'https://summitchronicles.com/')}/training-hub`, { timeout: 10000 });
        const hubStatus = page.url().includes('training-hub') ? 'working' : '404';
        console.log(`🏋️ Training hub: ${hubStatus}`);
        return { status: 'success', title, trainingHub: hubStatus };
      } catch {
        return { status: 'success', title, trainingHub: 'not-tested' };
      }
    }
    
    return { status: 'unknown', title, bodyText: bodyText?.substring(0, 200) };
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { status: 'error', error: error.message };
  } finally {
    await browser.close();
  }
}

// Check every 2 minutes for up to 20 minutes
let attempts = 0;
const maxAttempts = 10;

async function monitor() {
  const result = await quickDeploymentCheck();
  attempts++;
  
  if (result.status === 'success') {
    console.log('🎉 DEPLOYMENT COMPLETE! Training functionality should now be available.');
    process.exit(0);
  } else if (result.status === 'error' && !result.error?.includes('timeout')) {
    console.log('❌ DEPLOYMENT FAILED!');
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  } else if (attempts >= maxAttempts) {
    console.log('⏰ Timeout reached - deployment taking too long');
    process.exit(1);
  } else {
    console.log(`⏳ Waiting 2 minutes... (attempt ${attempts}/${maxAttempts})`);
    setTimeout(monitor, 120000); // 2 minutes
  }
}

monitor();