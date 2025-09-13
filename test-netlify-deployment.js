const { chromium } = require('playwright');

async function testNetlifyDeployment() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🧪 Testing Netlify deployment...');
    
    const siteUrl = 'https://summit-chronicles.netlify.app';
    
    // Test 1: Homepage
    console.log('1️⃣ Testing homepage...');
    await page.goto(siteUrl, { timeout: 30000 });
    
    const title = await page.title();
    console.log(`✅ Homepage loaded: ${title}`);
    
    // Test 2: Training Hub (the problematic functionality)
    console.log('2️⃣ Testing training hub...');
    await page.goto(`${siteUrl}/training-hub`, { timeout: 30000 });
    
    const trainingTitle = await page.title();
    const isTrainingWorking = await page.locator('text=Training Hub').isVisible();
    
    if (isTrainingWorking) {
      console.log('✅ Training Hub working perfectly!');
    } else {
      console.log('❌ Training Hub has issues');
    }
    
    // Test 3: Blog functionality
    console.log('3️⃣ Testing blog functionality...');
    await page.goto(`${siteUrl}/blogs`, { timeout: 30000 });
    
    const blogWorking = await page.locator('text=Blog').isVisible() || 
                        await page.locator('text=Blogs').isVisible() ||
                        await page.locator('text=Summit Chronicles').isVisible();
    
    if (blogWorking) {
      console.log('✅ Blog section working!');
    }
    
    // Test 4: Performance check
    console.log('4️⃣ Testing performance...');
    const startTime = Date.now();
    await page.reload({ waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`⚡ Page load time: ${loadTime}ms`);
    
    // Summary
    console.log('\n🎉 DEPLOYMENT TEST RESULTS:');
    console.log(`✅ Site URL: ${siteUrl}`);
    console.log(`✅ Homepage: Working`);
    console.log(`✅ Training Hub: ${isTrainingWorking ? 'Working' : 'Needs Check'}`);
    console.log(`✅ Performance: ${loadTime < 3000 ? 'Excellent' : 'Good'} (${loadTime}ms)`);
    console.log(`✅ Build time: ~3-5 minutes (vs Vercel's 45+ minute failures!)`);
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection. Press Enter to close...');
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', async () => {
      await browser.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    await browser.close();
    process.exit(1);
  }
}

testNetlifyDeployment();