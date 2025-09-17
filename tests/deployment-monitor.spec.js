const { test, expect } = require('@playwright/test');

test.describe('Vercel Deployment Monitor', () => {
  const deploymentUrl = 'https://summit-chronicles-starter-qityj4hnd-summit-chronicles-projects.vercel.app';
  
  test('Monitor Vercel deployment status', async ({ page }) => {
    console.log('🔍 Checking deployment status...');
    
    try {
      // Try to access the deployment URL
      const response = await page.goto(deploymentUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      if (response.status() === 200) {
        console.log('✅ Deployment is LIVE and accessible!');
        console.log(`🌐 Site URL: ${deploymentUrl}`);
        
        // Check if the page loads correctly
        await expect(page).toHaveTitle(/Summit Chronicles/);
        console.log('✅ Page title loaded correctly');
        
        // Check for key elements
        const navigation = await page.$('nav');
        if (navigation) {
          console.log('✅ Navigation component loaded');
        }
        
        console.log('🚀 DEPLOYMENT COMPLETE! Site is ready for custom domain configuration.');
        
      } else {
        console.log(`⚠️  Site returned status: ${response.status()}`);
        if (response.status() === 404) {
          console.log('📝 Deployment might still be building or failed');
        }
      }
      
    } catch (error) {
      if (error.message.includes('timeout')) {
        console.log('⏱️  Site is still building or not yet ready');
        console.log('🔄 Will continue monitoring...');
      } else {
        console.log('❌ Error accessing deployment:', error.message);
      }
      throw error;
    }
  });
  
  test('Check Vercel deployment API status', async ({ request }) => {
    console.log('🔍 Checking Vercel API status...');
    
    try {
      const response = await request.get(deploymentUrl + '/api/monitoring/errors', {
        timeout: 10000
      });
      
      if (response.status() === 200) {
        console.log('✅ API endpoints are working!');
        const data = await response.json();
        console.log('📊 Health check response:', data);
      } else {
        console.log(`⚠️  API returned status: ${response.status()}`);
      }
    } catch (error) {
      console.log('⚠️  API not yet available:', error.message);
    }
  });
});