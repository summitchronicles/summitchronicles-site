import { test, expect } from '@playwright/test';

test('check actual deployment styling and take screenshot', async ({ page }) => {
  console.log('🔍 Testing actual deployment at production URL...');
  
  // Go to the actual deployment URL
  await page.goto('https://summit-chronicles-starter-8vtslqbkp-summit-chronicles-projects.vercel.app');
  
  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  
  // Take a full page screenshot to see the actual styling
  await page.screenshot({ 
    path: 'deployment-actual-styling.png', 
    fullPage: true 
  });
  
  console.log('📸 Screenshot saved as deployment-actual-styling.png');
  
  // Check page title
  const title = await page.title();
  console.log('📄 Page title:', title);
  
  // Check if we have our Swiss spa classes in the HTML
  const pageContent = await page.content();
  const hasSwissSpaStyling = pageContent.includes('spa-') || 
                            pageContent.includes('alpine-') || 
                            pageContent.includes('summit-') ||
                            pageContent.includes('DisplayLarge') ||
                            pageContent.includes('HeroSection');
  
  console.log('🎨 Has Swiss Spa CSS classes:', hasSwissSpaStyling);
  
  // Check what's actually in the body
  const bodyText = await page.locator('body').textContent();
  console.log('📝 Body text preview:', bodyText?.slice(0, 200) + '...');
  
  // Look for our components
  const hasHeroSection = await page.locator('section').first().isVisible();
  console.log('🎯 Has visible hero section:', hasHeroSection);
  
  // Check if main heading exists and get its styling
  const mainHeading = page.locator('h1').first();
  if (await mainHeading.count() > 0) {
    const headingText = await mainHeading.textContent();
    const headingStyles = await mainHeading.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        color: styles.color,
        fontWeight: styles.fontWeight
      };
    });
    console.log('📊 Main heading:', headingText);
    console.log('🎨 Heading styles:', headingStyles);
  }
  
  // Check for any build errors or issues
  const errors = await page.evaluate(() => {
    return window.console ? 'Console available' : 'No console';
  });
  console.log('⚠️  Console status:', errors);
  
  // Check viewport and responsive behavior
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({ 
    path: 'deployment-desktop-view.png', 
    fullPage: false 
  });
  
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ 
    path: 'deployment-mobile-view.png', 
    fullPage: false 
  });
  
  console.log('📱 Mobile and desktop screenshots taken');
  
  // Final assessment
  console.log('✅ Test completed - check the screenshots to see actual deployment');
});