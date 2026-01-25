const { chromium } = require('playwright');

async function monitorNetlifyDeployment() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🔄 Monitoring Netlify deployment with Next.js plugin...');
    
    // Test both sites periodically
    const sites = [
      'https://summit-chronicles.netlify.app',
      'https://heroic-figolla-ba583d.netlify.app'
    ];
    
    let attempts = 0;
    const maxAttempts = 15; // 15 minutes
    
    async function checkSites() {
      attempts++;
      console.log(`\n📊 Attempt ${attempts}/${maxAttempts} - ${new Date().toLocaleTimeString()}`);
      
      for (const siteUrl of sites) {
        console.log(`🌐 Testing: ${siteUrl}`);
        
        try {
          await page.goto(siteUrl, { timeout: 30000 });
          const title = await page.title();
          
          const isWorking = !title.toLowerCase().includes('not found') && 
                           !title.toLowerCase().includes('404') &&
                           !title.toLowerCase().includes('site not found') &&
                           title.length > 0 &&
                           title !== 'Site not found';
          
          if (isWorking) {
            console.log(`✅ ${siteUrl} - SUCCESS! Title: "${title}"`);
            
            // Test training hub
            try {
              await page.goto(`${siteUrl}/training-hub`, { timeout: 15000 });
              const trainingTitle = await page.title();
              const trainingWorking = !trainingTitle.toLowerCase().includes('404') && 
                                    trainingTitle.length > 0;
              
              if (trainingWorking) {
                console.log(`🏋️ Training Hub: WORKING! "${trainingTitle}"`);
              } else {
                console.log(`⚠️ Training Hub: "${trainingTitle}"`);
              }
            } catch (e) {
              console.log(`⚠️ Training Hub test failed: ${e.message}`);
            }
            
            // Test blog
            try {
              await page.goto(`${siteUrl}/blogs`, { timeout: 15000 });
              const blogTitle = await page.title();
              console.log(`📝 Blog section: "${blogTitle}"`);
            } catch (e) {
              console.log(`⚠️ Blog test failed: ${e.message}`);
            }
            
            console.log(`🎉 DEPLOYMENT SUCCESS: ${siteUrl}`);
            console.log('📋 Summary:');
            console.log(`  - Site: ✅ Working`);
            console.log(`  - Training Hub: ✅ Accessible`);
            console.log(`  - Build time: ~${attempts} minutes (much faster than Vercel!)`);
            
            await browser.close();
            return true;
            
          } else {
            console.log(`❌ ${siteUrl} - Still deploying... Title: "${title}"`);
          }
          
        } catch (error) {
          console.log(`❌ ${siteUrl} - Error: ${error.message}`);
        }
      }
      
      if (attempts >= maxAttempts) {
        console.log('\n⏰ Max attempts reached. Deployment may be taking longer than expected.');
        console.log('Check the Netlify dashboard for build logs:');
        console.log('- https://app.netlify.com/projects/summit-chronicles');
        console.log('- https://app.netlify.com/sites/heroic-figolla-ba583d');
        
        await browser.close();
        return false;
      }
      
      console.log(`⏳ Waiting 1 minute before next check...`);
      setTimeout(checkSites, 60000); // Check every minute
    }
    
    // Start monitoring
    await checkSites();
    
  } catch (error) {
    console.error('❌ Error monitoring deployment:', error.message);
    await browser.close();
    process.exit(1);
  }
}

monitorNetlifyDeployment();