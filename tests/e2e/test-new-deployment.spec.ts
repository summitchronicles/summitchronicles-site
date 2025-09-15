import { test, expect } from '@playwright/test';

test('test new deployment with Epic 1 Swiss spa styling', async ({ page }) => {
  console.log('🔍 Testing NEW deployment with Epic 1 code...');
  
  // Test the new deployment URL
  const newDeploymentUrl = 'https://summit-chronicles-starter-81io23ve5-summit-chronicles-projects.vercel.app';
  
  try {
    await page.goto(newDeploymentUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Take screenshot of new deployment
    await page.screenshot({ 
      path: 'new-deployment-epic1-styling.png', 
      fullPage: true 
    });
    
    console.log('📸 New deployment screenshot saved');
    
    // Check for Epic 1 components and styling
    const pageContent = await page.content();
    
    // Look for our Swiss spa classes
    const hasSwissSpaStyling = pageContent.includes('spa-') || 
                              pageContent.includes('alpine-') || 
                              pageContent.includes('summit-');
    
    console.log('🎨 Has Swiss Spa classes:', hasSwissSpaStyling);
    
    // Check for our premium hero section
    const hasHeroSection = await page.locator('[class*="hero"]').count() > 0;
    console.log('🎯 Has hero section component:', hasHeroSection);
    
    // Check for our new components
    const hasVisualShowcase = await page.locator('text=Visual Journey').count() > 0;
    console.log('🖼️ Has Visual Showcase section:', hasVisualShowcase);
    
    // Check typography - should not be Times font
    const heading = page.locator('h1').first();
    if (await heading.count() > 0) {
      const headingStyles = await heading.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          color: styles.color
        };
      });
      console.log('📝 Heading styles:', headingStyles);
      
      const hasTimesFont = headingStyles.fontFamily.includes('Times');
      console.log('⚠️ Using Times font (should be false):', hasTimesFont);
    }
    
    // Check for our new layout structure
    const hasDefaultLayout = await page.locator('[class*="DefaultLayout"], .max-w-7xl').count() > 0;
    console.log('🏗️ Has DefaultLayout structure:', hasDefaultLayout);
    
    // Check for our button styling
    const buttons = await page.locator('button, [role="button"]').count();
    console.log('🔘 Number of interactive buttons:', buttons);
    
    console.log('✅ New deployment test completed');
    
  } catch (error) {
    console.log('❌ Error testing new deployment:', error.message);
    
    // Take screenshot anyway to see what's there
    await page.screenshot({ 
      path: 'new-deployment-error.png', 
      fullPage: true 
    });
  }
});