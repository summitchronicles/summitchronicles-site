const { chromium } = require('playwright');

async function testTrainingFunctionality() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🏔️ Testing Summit Chronicles Training System...');
    console.log('='.repeat(60));
    
    const baseUrl = 'https://summitchronicles.com';
    
    // Test main pages
    const pagesToTest = [
      { path: '/', name: 'Home Page', expectedContent: 'Summit Chronicles' },
      { path: '/training', name: 'Training Page', expectedContent: 'training' },
      { path: '/my-story', name: 'My Story', expectedContent: 'story' },
      { path: '/the-journey', name: 'The Journey', expectedContent: 'journey' },
      { path: '/blogs', name: 'Blogs', expectedContent: 'blog' },
      { path: '/ask-sunith', name: 'Ask Sunith (AI)', expectedContent: 'ask' }
    ];
    
    const results = {};
    
    for (const testPage of pagesToTest) {
      console.log(`\n🔍 Testing: ${testPage.name} (${baseUrl}${testPage.path})`);
      
      try {
        const response = await page.goto(`${baseUrl}${testPage.path}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });
        
        const status = response?.status();
        const title = await page.title();
        const bodyText = await page.textContent('body');
        
        // Check for expected content
        const hasExpectedContent = bodyText?.toLowerCase().includes(testPage.expectedContent.toLowerCase());
        
        // Take screenshot
        const screenshotName = `page-${testPage.path.replace(/\//g, '_') || 'home'}.png`;
        await page.screenshot({ path: screenshotName, fullPage: true });
        
        results[testPage.name] = {
          status,
          title,
          working: status === 200,
          hasExpectedContent,
          screenshot: screenshotName
        };
        
        console.log(`  ✅ Status: ${status}`);
        console.log(`  📄 Title: ${title}`);
        console.log(`  🎯 Expected content found: ${hasExpectedContent ? 'YES' : 'NO'}`);
        console.log(`  📸 Screenshot: ${screenshotName}`);
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        results[testPage.name] = {
          status: 'error',
          error: error.message,
          working: false
        };
      }
    }
    
    // Test training-specific functionality
    console.log('\n🏋️ Testing Training System Specific Features...');
    
    try {
      await page.goto(`${baseUrl}/training`, { timeout: 30000 });
      
      // Look for training upload/logging features
      const trainingFeatures = [
        'training log',
        'upload',
        'workout',
        'progress',
        'data entry',
        'manual entry'
      ];
      
      const bodyText = await page.textContent('body');
      const foundFeatures = trainingFeatures.filter(feature => 
        bodyText?.toLowerCase().includes(feature)
      );
      
      console.log(`  🎯 Training features found: ${foundFeatures.join(', ')}`);
      
      // Look for interactive elements
      const buttons = await page.locator('button').count();
      const forms = await page.locator('form').count();
      const inputs = await page.locator('input').count();
      
      console.log(`  🔘 Interactive elements: ${buttons} buttons, ${forms} forms, ${inputs} inputs`);
      
      results['Training Features'] = {
        foundFeatures,
        interactiveElements: { buttons, forms, inputs },
        working: foundFeatures.length > 0
      };
      
    } catch (error) {
      console.log(`  ❌ Training page error: ${error.message}`);
    }
    
    // Test Ask Sunith AI functionality
    console.log('\n🤖 Testing Ask Sunith AI System...');
    
    try {
      await page.goto(`${baseUrl}/ask-sunith`, { timeout: 30000 });
      
      // Look for AI chat interface
      const aiElements = await page.locator('input[type="text"], textarea, [placeholder*="question"], [placeholder*="ask"]').count();
      const submitButtons = await page.locator('button:has-text("Submit"), button:has-text("Send"), button:has-text("Ask")').count();
      
      console.log(`  💬 AI input elements: ${aiElements}`);
      console.log(`  🚀 Submit buttons: ${submitButtons}`);
      
      results['Ask Sunith AI'] = {
        inputElements: aiElements,
        submitButtons: submitButtons,
        working: aiElements > 0 && submitButtons > 0
      };
      
    } catch (error) {
      console.log(`  ❌ Ask Sunith error: ${error.message}`);
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Error testing functionality:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Run the test
testTrainingFunctionality().then(results => {
  console.log('\n🏆 TRAINING SYSTEM FUNCTIONALITY TEST RESULTS:');
  console.log('='.repeat(60));
  
  const workingPages = Object.entries(results).filter(([name, result]) => result.working).length;
  const totalPages = Object.keys(results).length;
  
  console.log(`📊 Working Pages: ${workingPages}/${totalPages}`);
  
  if (workingPages === totalPages) {
    console.log('🎉 ALL SYSTEMS WORKING! Training functionality is live on summitchronicles.com');
  } else if (workingPages > totalPages * 0.7) {
    console.log('✅ MOSTLY WORKING! Most training features are functional');
  } else {
    console.log('⚠️ SOME ISSUES DETECTED - Check individual results');
  }
  
  console.log('\nDetailed Results:');
  console.log(JSON.stringify(results, null, 2));
  
}).catch(console.error);