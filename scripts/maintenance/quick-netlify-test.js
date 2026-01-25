const { chromium } = require('playwright');

async function quickNetlifyTest() {
  console.log('🚀 Quick Netlify Status Check...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Test primary site
    console.log('🌐 Testing Primary Site...');
    await page.goto('https://heroic-figolla-ba583d.netlify.app', { timeout: 30000 });
    
    const title = await page.title();
    console.log(`📄 Title: "${title}"`);
    
    // Check page content
    const bodyText = await page.locator('body').textContent();
    const hasContent = bodyText && bodyText.length > 100;
    
    console.log(`📊 Page has content: ${hasContent}`);
    console.log(`📊 Content length: ${bodyText ? bodyText.length : 0} characters`);
    
    if (bodyText) {
      console.log(`📋 First 200 chars: "${bodyText.substring(0, 200)}..."`);
    }
    
    // Test training hub directly
    console.log('\n🏋️ Testing Training Hub...');
    await page.goto('https://heroic-figolla-ba583d.netlify.app/training-hub', { timeout: 30000 });
    
    const trainingTitle = await page.title();
    console.log(`🏋️ Training Title: "${trainingTitle}"`);
    
    // Check for errors or build messages
    const pageSource = await page.content();
    const hasBuildError = pageSource.includes('error') || pageSource.includes('building') || pageSource.includes('deploy');
    
    console.log(`🔍 Has build/error indicators: ${hasBuildError}`);
    
    // Also test the Netlify admin
    console.log('\n🔧 Checking Netlify Admin...');
    await page.goto('https://app.netlify.com/sites/heroic-figolla-ba583d', { timeout: 30000 });
    
    // Look for deployment status
    await page.waitForTimeout(2000);
    
    try {
      const deployBadge = await page.locator('.deploy-badge, [data-testid="deploy-badge"]').first().textContent({ timeout: 5000 });
      console.log(`🚦 Deploy Badge: ${deployBadge}`);
    } catch (e) {
      console.log('🚦 Deploy badge not found');
    }
    
    try {
      const deployStatus = await page.locator('.deploy-status, [data-testid="deploy-status"]').first().textContent({ timeout: 5000 });
      console.log(`📊 Deploy Status: ${deployStatus}`);
    } catch (e) {
      console.log('📊 Deploy status not visible');
    }
    
    console.log('\n📋 SUMMARY:');
    console.log(`✅ Primary site accessible: ${!title.includes('not found')}`);
    console.log(`✅ Training hub accessible: ${!trainingTitle.includes('not found')}`);
    console.log(`✅ Build appears healthy: ${!hasBuildError}`);
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    console.log('\n🔍 Browser left open for manual inspection...');
    console.log('Press Ctrl+C to close when done.');
  }
}

quickNetlifyTest();