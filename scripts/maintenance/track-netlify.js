const { chromium } = require('playwright');

async function trackNetlifyDeployment() {
  console.log('🎯 Tracking Netlify-only deployment...');
  console.log('📋 Primary Site: https://heroic-figolla-ba583d.netlify.app');
  console.log('📋 Backup Site: https://summit-chronicles.netlify.app');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  let attempt = 0;
  const maxAttempts = 10;
  
  async function checkDeployment() {
    attempt++;
    console.log(`\n⏰ Check ${attempt}/${maxAttempts} at ${new Date().toLocaleTimeString()}`);
    
    // Test primary site (GitHub-connected)
    try {
      await page.goto('https://heroic-figolla-ba583d.netlify.app', { timeout: 30000 });
      const title = await page.title();
      
      if (title && !title.includes('not found') && !title.includes('404')) {
        console.log('🎉 SUCCESS! Primary site is live!');
        console.log(`📄 Title: "${title}"`);
        
        // Test training hub
        await page.goto('https://heroic-figolla-ba583d.netlify.app/training-hub', { timeout: 15000 });
        const trainingTitle = await page.title();
        console.log(`🏋️ Training Hub: "${trainingTitle}"`);
        
        console.log('\n✅ DEPLOYMENT COMPLETE!');
        console.log('🌐 Your site is live at: https://heroic-figolla-ba583d.netlify.app');
        console.log('🏋️ Training Hub: https://heroic-figolla-ba583d.netlify.app/training-hub');
        
        await browser.close();
        return;
      } else {
        console.log(`⏳ Still deploying... Title: "${title}"`);
      }
    } catch (error) {
      console.log(`⏳ Site not ready yet: ${error.message}`);
    }
    
    if (attempt >= maxAttempts) {
      console.log('\n⏰ Reached max attempts. Check Netlify dashboard:');
      console.log('https://app.netlify.com/sites/heroic-figolla-ba583d');
      await browser.close();
      return;
    }
    
    setTimeout(checkDeployment, 60000); // Check every minute
  }
  
  checkDeployment();
}

trackNetlifyDeployment();