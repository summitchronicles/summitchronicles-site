const { chromium } = require('playwright');

async function checkDeploymentSuccess() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 Checking deployment success with Playwright...');
    
    // Check the latest deployment URL
    const deploymentUrl = 'https://summit-chronicles-starter-pkjgd0w59-summit-chronicles-projects.vercel.app';
    console.log(`Testing deployment: ${deploymentUrl}`);
    
    await page.goto(deploymentUrl, { waitUntil: 'networkidle', timeout: 60000 });
    
    // Take screenshot of the result
    await page.screenshot({ 
      path: 'deployment-result.png', 
      fullPage: true 
    });
    console.log('📸 Deployment result screenshot: deployment-result.png');
    
    // Check if it's still building
    const buildingText = await page.locator('text=building, text=Building, text=BUILDING').count();
    if (buildingText > 0) {
      console.log('🔄 Deployment is still building...');
      
      // Wait a bit and check again
      console.log('⏳ Waiting 30 seconds and checking again...');
      await page.waitForTimeout(30000);
      await page.reload({ waitUntil: 'networkidle' });
      
      await page.screenshot({ 
        path: 'deployment-result-after-wait.png', 
        fullPage: true 
      });
    }
    
    // Check for error indicators
    const errorIndicators = await page.locator('text=failed, text=Failed, text=ERROR, text=Error').count();
    if (errorIndicators > 0) {
      console.log('❌ Deployment appears to have failed');
      
      // Try to get error details
      const errorText = await page.locator('.error, [class*="error"], [data-testid*="error"]').allTextContents();
      console.log('Error details:', errorText);
      
      return { success: false, status: 'failed', errors: errorText };
    }
    
    // Check for success indicators - look for actual site content
    const successIndicators = [
      'Summit Chronicles',
      'Seven Summits',
      'Mountaineering',
      'Training',
      'Navigation', // Common nav elements
      'Home'
    ];
    
    let foundSuccessIndicators = 0;
    for (const indicator of successIndicators) {
      const count = await page.locator(`text=${indicator}`).count();
      if (count > 0) {
        foundSuccessIndicators++;
        console.log(`✅ Found: ${indicator}`);
      }
    }
    
    // Check if we can access key pages
    const keyPages = [
      '/',
      '/training',
      '/blogs'
    ];
    
    let workingPages = 0;
    for (const pagePath of keyPages) {
      try {
        console.log(`🔍 Testing page: ${deploymentUrl}${pagePath}`);
        const response = await page.goto(`${deploymentUrl}${pagePath}`, { timeout: 30000 });
        if (response && response.status() === 200) {
          workingPages++;
          console.log(`✅ Page working: ${pagePath}`);
        } else {
          console.log(`❌ Page failed: ${pagePath} (Status: ${response?.status()})`);
        }
      } catch (error) {
        console.log(`❌ Page error: ${pagePath} - ${error.message}`);
      }
    }
    
    // Final assessment
    if (foundSuccessIndicators >= 3 && workingPages >= 2) {
      console.log('🎉 DEPLOYMENT SUCCESS! Site is working properly');
      return { 
        success: true, 
        status: 'success', 
        successIndicators: foundSuccessIndicators,
        workingPages: workingPages 
      };
    } else if (foundSuccessIndicators >= 1 || workingPages >= 1) {
      console.log('⚠️ PARTIAL SUCCESS - Some functionality working');
      return { 
        success: 'partial', 
        status: 'partial', 
        successIndicators: foundSuccessIndicators,
        workingPages: workingPages 
      };
    } else {
      console.log('❌ DEPLOYMENT FAILED - No working functionality detected');
      return { success: false, status: 'failed' };
    }
    
  } catch (error) {
    console.error('❌ Error checking deployment:', error);
    return { success: false, status: 'error', error: error.message };
  } finally {
    await browser.close();
  }
}

// Run the check
checkDeploymentSuccess().then(result => {
  console.log('\n📋 FINAL RESULT:');
  console.log(JSON.stringify(result, null, 2));
}).catch(console.error);