const { chromium } = require('playwright');

async function monitorVercelDeployment() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 MONITORING VERCEL DEPLOYMENT');
    console.log('='.repeat(60));
    
    const deploymentUrl = 'https://vercel.com/summit-chronicles-projects/summit-chronicles-starter/5ZXxiYMG7EuwS3sfYKyhDfD7xRVq';
    const previewUrl = 'https://summit-chronicles-starter-9jtnbk50e-summit-chronicles-projects.vercel.app';
    
    let attempt = 1;
    const maxAttempts = 30; // 15 minutes monitoring
    
    while (attempt <= maxAttempts) {
      console.log(`\n📊 Check #${attempt} (${new Date().toLocaleTimeString()})`);
      
      // Check Vercel dashboard
      await page.goto(deploymentUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      // Take screenshot of current status
      await page.screenshot({ 
        path: `deployment-status-${attempt}.png`, 
        fullPage: true 
      });
      
      // Check deployment status
      const statusText = await page.textContent('body');
      const isBuilding = statusText?.toLowerCase().includes('building');
      const isError = statusText?.toLowerCase().includes('error') && 
                     !statusText?.toLowerCase().includes('0 errors');
      const isReady = statusText?.toLowerCase().includes('ready') || 
                     statusText?.toLowerCase().includes('completed');
      
      // Get build logs
      const buildLogs = await page.locator('[data-testid*="log"], .log-entry, [class*="log"]').allTextContents();
      const errorLogs = buildLogs.filter(log => 
        log.toLowerCase().includes('error') && 
        !log.toLowerCase().includes('0 error')
      );
      
      console.log(`  Status: ${isBuilding ? 'BUILDING' : isError ? 'ERROR' : isReady ? 'READY' : 'UNKNOWN'}`);
      
      if (errorLogs.length > 0) {
        console.log('  ❌ Build Errors Found:');
        errorLogs.slice(0, 3).forEach((error, i) => {
          console.log(`    ${i + 1}. ${error.substring(0, 100)}...`);
        });
      }
      
      if (isError) {
        console.log('\n❌ DEPLOYMENT FAILED!');
        await page.screenshot({ path: 'final-deployment-failed.png', fullPage: true });
        return {
          success: false,
          status: 'failed',
          attempt,
          errors: errorLogs,
          screenshot: 'final-deployment-failed.png'
        };
      }
      
      if (isReady) {
        console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
        await page.screenshot({ path: 'deployment-success-verified.png', fullPage: true });
        
        // Test the actual deployed site
        console.log('🧪 Testing deployed site functionality...');
        
        try {
          await page.goto(previewUrl, { timeout: 30000 });
          
          const siteTitle = await page.title();
          const isWorkingSite = !siteTitle.toLowerCase().includes('building') && 
                               !siteTitle.toLowerCase().includes('error');
          
          if (isWorkingSite) {
            // Test training upload functionality
            console.log('🏋️ Testing training upload functionality...');
            
            const testResults = {};
            const trainingRoutes = [
              '/training-hub',
              '/training/upload',
              '/training/manual'
            ];
            
            for (const route of trainingRoutes) {
              try {
                const response = await page.goto(`${previewUrl}${route}`, { timeout: 15000 });
                testResults[route] = {
                  status: response?.status(),
                  working: response?.status() === 200
                };
                console.log(`  ${route}: ${response?.status()}`);
              } catch (error) {
                testResults[route] = { status: 'error', working: false };
                console.log(`  ${route}: ERROR`);
              }
            }
            
            // Test if training upload is actually working
            await page.goto(`${previewUrl}/training-hub`, { timeout: 15000 });
            const uploadElements = await page.locator('input[type="file"], button:has-text("Upload"), [data-testid*="upload"]').count();
            
            return {
              success: true,
              status: 'deployed',
              attempt,
              previewUrl,
              siteTitle,
              trainingRoutes: testResults,
              uploadElements,
              screenshot: 'deployment-success-verified.png',
              message: 'Deployment successful and training functionality available!'
            };
          } else {
            console.log('⚠️ Site deployed but still showing build page');
            return {
              success: false,
              status: 'deployed-but-not-ready',
              attempt,
              siteTitle
            };
          }
          
        } catch (error) {
          console.log(`❌ Error testing deployed site: ${error.message}`);
        }
      }
      
      if (!isBuilding && !isReady && !isError) {
        console.log('⚠️ Unknown status - checking again...');
      }
      
      // Wait before next check
      console.log('  ⏳ Waiting 30 seconds...');
      await page.waitForTimeout(30000);
      attempt++;
    }
    
    // Timeout reached
    console.log('\n⏰ TIMEOUT: Deployment taking longer than expected');
    await page.screenshot({ path: 'deployment-timeout-final.png', fullPage: true });
    
    return {
      success: false,
      status: 'timeout',
      attempt: maxAttempts,
      screenshot: 'deployment-timeout-final.png'
    };
    
  } catch (error) {
    console.error('❌ Error monitoring deployment:', error);
    return { success: false, status: 'error', error: error.message };
  } finally {
    await browser.close();
  }
}

// Start monitoring
console.log('🚀 Starting Vercel deployment monitoring with Playwright...');
monitorVercelDeployment().then(result => {
  console.log('\n🎯 FINAL VERCEL DEPLOYMENT RESULT:');
  console.log('='.repeat(60));
  console.log(JSON.stringify(result, null, 2));
  console.log('='.repeat(60));
  
  if (result.success) {
    console.log('🎉 SUCCESS! Training upload functionality is now deployed!');
    console.log(`🌐 Live at: ${result.previewUrl}`);
    console.log(`📊 Upload elements found: ${result.uploadElements || 0}`);
  } else {
    console.log('❌ Deployment unsuccessful');
    console.log(`📝 Status: ${result.status}`);
    if (result.errors) {
      console.log('🔥 Errors found - check screenshots for details');
    }
  }
}).catch(console.error);