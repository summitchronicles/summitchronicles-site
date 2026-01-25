const { chromium } = require('playwright');

async function checkNetlifyStatus() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 Checking Netlify deployment status...');
    
    // Go to Netlify dashboard
    await page.goto('https://app.netlify.com', { timeout: 30000 });
    
    // Wait for login or dashboard
    console.log('📱 Opening Netlify dashboard...');
    await page.waitForTimeout(3000);
    
    // Check if we need to login
    const loginButton = await page.locator('text=Log in').first();
    const isLoggedOut = await loginButton.isVisible();
    
    if (isLoggedOut) {
      console.log('🔐 Please log in to Netlify in the browser...');
      console.log('After logging in, navigate to your Summit Chronicles project.');
    } else {
      console.log('✅ Already logged in to Netlify');
    }
    
    // Navigate to our specific project
    console.log('🚀 Navigating to Summit Chronicles project...');
    
    // Try to go directly to the project
    await page.goto('https://app.netlify.com/projects/summit-chronicles', { timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Check for deployment status
    const deploymentStatus = await page.locator('[data-testid="deployment-status"]').first();
    const hasDeploymentStatus = await deploymentStatus.isVisible();
    
    if (hasDeploymentStatus) {
      const status = await deploymentStatus.textContent();
      console.log(`📊 Deployment Status: ${status}`);
    }
    
    // Look for build logs
    const buildLogButton = await page.locator('text=Build log').first();
    const hasBuildLog = await buildLogButton.isVisible();
    
    if (hasBuildLog) {
      console.log('📝 Build log found - clicking to view...');
      await buildLogButton.click();
      await page.waitForTimeout(2000);
      
      // Try to get build log content
      const logContent = await page.locator('.build-log, .log-content, pre').first();
      const hasLogContent = await logContent.isVisible();
      
      if (hasLogContent) {
        const logs = await logContent.textContent();
        console.log('📋 Recent Build Log:');
        console.log('─'.repeat(50));
        console.log(logs.slice(-1000)); // Last 1000 characters
        console.log('─'.repeat(50));
      }
    }
    
    // Check for any error messages
    const errorMessages = await page.locator('.error, .failed, [class*="error"]').all();
    if (errorMessages.length > 0) {
      console.log('❌ Found potential errors:');
      for (const error of errorMessages) {
        const errorText = await error.textContent();
        if (errorText && errorText.trim()) {
          console.log(`  - ${errorText.trim()}`);
        }
      }
    }
    
    // Check for successful deployments
    const successMessages = await page.locator('.success, .published, [class*="success"]').all();
    if (successMessages.length > 0) {
      console.log('✅ Found successful deployment indicators:');
      for (const success of successMessages) {
        const successText = await success.textContent();
        if (successText && successText.trim()) {
          console.log(`  - ${successText.trim()}`);
        }
      }
    }
    
    // Check site URL
    const siteUrl = await page.locator('[data-testid="site-url"], .site-url').first();
    const hasSiteUrl = await siteUrl.isVisible();
    
    if (hasSiteUrl) {
      const url = await siteUrl.textContent();
      console.log(`🌐 Site URL: ${url}`);
      
      // Test the actual site
      console.log('🧪 Testing live site...');
      const testPage = await context.newPage();
      
      try {
        await testPage.goto(url.trim(), { timeout: 30000 });
        const title = await testPage.title();
        console.log(`📄 Site Title: ${title}`);
        
        const isWorking = !title.toLowerCase().includes('not found') && 
                         !title.toLowerCase().includes('404') &&
                         title.length > 0;
        
        if (isWorking) {
          console.log('✅ Site is loading successfully!');
          
          // Test training hub
          try {
            await testPage.goto(`${url.trim()}/training-hub`, { timeout: 15000 });
            const trainingTitle = await testPage.title();
            console.log(`🏋️ Training Hub Status: ${trainingTitle}`);
          } catch (e) {
            console.log('⚠️ Training hub test failed:', e.message);
          }
        } else {
          console.log('❌ Site appears to have issues');
        }
        
        await testPage.close();
      } catch (e) {
        console.log('❌ Site test failed:', e.message);
        await testPage.close();
      }
    }
    
    // Also check the GitHub-connected site
    console.log('\n🔍 Checking GitHub-connected site...');
    await page.goto('https://app.netlify.com/sites/heroic-figolla-ba583d', { timeout: 30000 });
    await page.waitForTimeout(2000);
    
    // Repeat similar checks for the second site
    const githubSiteUrl = 'https://heroic-figolla-ba583d.netlify.app';
    console.log(`🌐 GitHub Site URL: ${githubSiteUrl}`);
    
    const testPage2 = await context.newPage();
    try {
      await testPage2.goto(githubSiteUrl, { timeout: 30000 });
      const title2 = await testPage2.title();
      console.log(`📄 GitHub Site Title: ${title2}`);
      
      const isWorking2 = !title2.toLowerCase().includes('not found') && 
                        !title2.toLowerCase().includes('404') &&
                        title2.length > 0;
      
      if (isWorking2) {
        console.log('✅ GitHub-connected site is working!');
      } else {
        console.log('❌ GitHub-connected site has issues');
      }
      
      await testPage2.close();
    } catch (e) {
      console.log('❌ GitHub site test failed:', e.message);
      await testPage2.close();
    }
    
    console.log('\n🎯 SUMMARY:');
    console.log('1. Check build logs in the Netlify dashboard for any errors');
    console.log('2. Verify environment variables are set correctly');
    console.log('3. Check if builds are completing successfully');
    console.log('4. Look for any Next.js compatibility issues');
    
    console.log('\n🔍 Browser kept open for manual inspection. Press Enter to close...');
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', async () => {
      await browser.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error checking Netlify status:', error.message);
    await browser.close();
    process.exit(1);
  }
}

checkNetlifyStatus();