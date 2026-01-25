const { chromium } = require('playwright');

async function checkDomainConnection() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔍 Checking domain connections with Playwright...');
    console.log('='.repeat(60));
    
    const domains = [
      'https://summitchronicles.com',
      'https://www.summitchronicles.com',
      'https://summit-chronicles-starter-pkjgd0w59-summit-chronicles-projects.vercel.app'
    ];
    
    const results = {};
    
    for (const domain of domains) {
      console.log(`\n🌐 Testing: ${domain}`);
      
      try {
        const response = await page.goto(domain, { 
          waitUntil: 'networkidle', 
          timeout: 30000 
        });
        
        const status = response?.status();
        const title = await page.title();
        const bodyText = await page.textContent('body');
        
        // Check if it's the Summit Chronicles site
        const isSummitChronicles = bodyText?.toLowerCase().includes('summit chronicles') ||
                                  bodyText?.toLowerCase().includes('seven summits') ||
                                  title?.toLowerCase().includes('summit');
        
        // Check if it's a Vercel deployment page
        const isVercelDeployment = bodyText?.toLowerCase().includes('deployment') ||
                                  bodyText?.toLowerCase().includes('building');
        
        // Take screenshot
        const screenshotName = `domain-${domain.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-')}.png`;
        await page.screenshot({ path: screenshotName, fullPage: true });
        
        results[domain] = {
          status,
          title,
          working: status === 200,
          isSummitChronicles,
          isVercelDeployment,
          screenshot: screenshotName,
          preview: bodyText?.substring(0, 150) + '...'
        };
        
        console.log(`  Status: ${status}`);
        console.log(`  Title: ${title}`);
        console.log(`  Summit Chronicles Content: ${isSummitChronicles ? 'YES' : 'NO'}`);
        console.log(`  Screenshot: ${screenshotName}`);
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        results[domain] = {
          status: 'error',
          error: error.message,
          working: false
        };
      }
    }
    
    console.log('\n🔧 Checking Vercel project domain configuration...');
    
    // Navigate to Vercel project settings
    const vercelProjectUrl = 'https://vercel.com/summit-chronicles-projects/summit-chronicles-starter/settings/domains';
    console.log(`\n📋 Opening Vercel domains settings: ${vercelProjectUrl}`);
    
    try {
      await page.goto(vercelProjectUrl, { timeout: 30000 });
      await page.waitForTimeout(3000);
      
      // Take screenshot of domain settings
      await page.screenshot({ 
        path: 'vercel-domains-settings.png', 
        fullPage: true 
      });
      console.log('📸 Vercel domains screenshot: vercel-domains-settings.png');
      
      // Look for domain configuration
      const domainElements = await page.locator('[data-testid*="domain"], .domain, [class*="domain"]').allTextContents();
      console.log('🌐 Found domain elements:', domainElements);
      
    } catch (error) {
      console.log(`⚠️ Could not access Vercel settings: ${error.message}`);
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Error checking domains:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Run the check
checkDomainConnection().then(results => {
  console.log('\n🎯 DOMAIN CONNECTION ANALYSIS:');
  console.log('='.repeat(60));
  
  const summitChroniclesToday = results['https://summitchronicles.com'];
  const vercelDeployment = results['https://summit-chronicles-starter-pkjgd0w59-summit-chronicles-projects.vercel.app'];
  
  if (summitChroniclesToday?.isSummitChronicles && vercelDeployment?.isSummitChronicles) {
    if (summitChroniclesToday.title === vercelDeployment.title) {
      console.log('✅ DOMAINS ARE CONNECTED! summitchronicles.com points to current Vercel deployment');
    } else {
      console.log('⚠️ DIFFERENT CONTENT: summitchronicles.com may point to different version');
    }
  } else if (summitChroniclesToday?.working && !summitChroniclesToday?.isSummitChronicles) {
    console.log('❌ DOMAIN NOT CONNECTED: summitchronicles.com points to different site');
    console.log('🔧 ACTION NEEDED: Configure summitchronicles.com to point to Vercel deployment');
  } else if (!summitChroniclesToday?.working) {
    console.log('❌ DOMAIN NOT ACCESSIBLE: summitchronicles.com is not reachable');
    console.log('🔧 ACTION NEEDED: Check domain DNS configuration');
  }
  
  console.log('\nDetailed Results:');
  console.log(JSON.stringify(results, null, 2));
  
}).catch(console.error);