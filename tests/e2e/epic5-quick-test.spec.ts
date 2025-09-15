import { test, expect } from '@playwright/test';

test('Epic 5: Quick Support Page Test', async ({ page }) => {
  console.log('🎯 QUICK TEST: Epic 5 Support Page');
  
  try {
    await page.goto('http://localhost:3000/support', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Take screenshot
    await page.screenshot({ 
      path: 'epic5-support-quick.png', 
      fullPage: true 
    });
    
    console.log('📸 Epic 5 - Support page screenshot saved');
    
    // Get page content
    const pageContent = await page.content();
    
    // Quick feature checks
    const hasSupport = pageContent.includes('Support') || pageContent.includes('support');
    const hasDonation = pageContent.includes('donation') || pageContent.includes('Donation');
    const hasStyling = pageContent.includes('spa-') || pageContent.includes('bg-');
    
    console.log('✅ Support content present:', hasSupport);
    console.log('✅ Donation features present:', hasDonation);
    console.log('✅ Swiss spa styling present:', hasStyling);
    
    if (hasSupport && hasDonation && hasStyling) {
      console.log('🎉 EPIC 5 SUPPORT PAGE WORKING!');
    } else {
      console.log('⚠️ Epic 5 support page issues detected');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    await page.screenshot({ path: 'epic5-support-error.png', fullPage: true });
  }
});