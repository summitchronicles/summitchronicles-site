const { chromium } = require('playwright');

async function monitorDeployment() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 Monitoring deployment until completion...');
    
    const deploymentUrl = 'https://summit-chronicles-starter-pkjgd0w59-summit-chronicles-projects.vercel.app';
    let attempt = 1;
    const maxAttempts = 20; // 10 minutes max wait
    
    while (attempt <= maxAttempts) {
      console.log(`\n📊 Check #${attempt} (${new Date().toLocaleTimeString()})`);
      
      try {
        await page.goto(deploymentUrl, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Check if still building
        const buildingIndicators = await page.locator('text=building, text=Building, text=BUILDING').count();
        
        if (buildingIndicators > 0) {
          console.log('🔄 Still building... waiting 30 seconds');
          await page.waitForTimeout(30000);
          attempt++;
          continue;
        }
        
        // Check for failure
        const failureIndicators = await page.locator('text=failed, text=Failed, text=ERROR, text=Error, text=deployment has failed').count();
        if (failureIndicators > 0) {
          console.log('❌ Deployment failed!');
          await page.screenshot({ path: 'deployment-failed.png', fullPage: true });
          return { success: false, status: 'failed', screenshot: 'deployment-failed.png' };
        }
        
        // Check for success - look for actual site content
        const siteTitleCount = await page.locator('title').count();
        const bodyText = await page.textContent('body');
        
        // Look for Summit Chronicles specific content
        const summitContent = [
          'Summit Chronicles',
          'mountaineering',
          'seven summits',
          'training',
          'expedition'
        ].some(term => bodyText?.toLowerCase().includes(term.toLowerCase()));
        
        // Look for navigation elements
        const navElements = await page.locator('nav, [role="navigation"], header').count();
        
        // Check if we have real content (not just build page)
        if (summitContent || navElements > 0) {
          console.log('🎉 SUCCESS! Deployment completed successfully!');
          
          await page.screenshot({ path: 'deployment-success.png', fullPage: true });
          
          // Test key functionality
          console.log('🧪 Testing key pages...');
          const testResults = {};
          
          const pagesToTest = [
            { path: '/', name: 'Home' },
            { path: '/training', name: 'Training' },
            { path: '/blogs', name: 'Blogs' }
          ];
          
          for (const testPage of pagesToTest) {
            try {
              const response = await page.goto(`${deploymentUrl}${testPage.path}`, { timeout: 15000 });
              testResults[testPage.name] = {
                status: response?.status() || 'unknown',
                working: response?.status() === 200
              };
              console.log(`✅ ${testPage.name}: ${response?.status()}`);
            } catch (error) {
              testResults[testPage.name] = { 
                status: 'error', 
                working: false, 
                error: error.message 
              };
              console.log(`❌ ${testPage.name}: Failed`);
            }
          }
          
          return {
            success: true,
            status: 'completed',
            deploymentUrl,
            screenshot: 'deployment-success.png',
            testResults,
            completionTime: new Date().toLocaleTimeString()
          };
        } else {
          console.log('⚠️ Page loaded but no Summit Chronicles content detected yet...');
          await page.screenshot({ path: `deployment-check-${attempt}.png` });
          console.log(`📸 Screenshot saved: deployment-check-${attempt}.png`);
        }
        
      } catch (error) {
        console.log(`⚠️ Network error on attempt ${attempt}: ${error.message}`);
      }
      
      // Wait before next check
      console.log('⏳ Waiting 30 seconds before next check...');
      await page.waitForTimeout(30000);
      attempt++;
    }
    
    // Timeout reached
    console.log('⏰ Timeout reached - deployment taking longer than expected');
    await page.screenshot({ path: 'deployment-timeout.png', fullPage: true });
    
    return {
      success: false,
      status: 'timeout',
      screenshot: 'deployment-timeout.png',
      message: 'Deployment exceeded maximum wait time'
    };
    
  } catch (error) {
    console.error('❌ Error monitoring deployment:', error);
    return { success: false, status: 'error', error: error.message };
  } finally {
    await browser.close();
  }
}

// Start monitoring
console.log('🚀 Starting deployment monitor...');
monitorDeployment().then(result => {
  console.log('\n🎯 FINAL DEPLOYMENT RESULT:');
  console.log('='.repeat(50));
  console.log(JSON.stringify(result, null, 2));
  console.log('='.repeat(50));
  
  if (result.success) {
    console.log('🎉 DEPLOYMENT SUCCESSFUL! Training system should now be live!');
  } else {
    console.log('❌ Deployment did not complete successfully');
  }
}).catch(console.error);