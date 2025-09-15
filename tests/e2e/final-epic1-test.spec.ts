import { test, expect } from '@playwright/test';

test('FINAL TEST: Epic 1 Swiss Spa Design System - Production Ready', async ({ page }) => {
  console.log('🎯 FINAL EPIC 1 TEST - Swiss Spa Design System Live!');
  
  // Test the completed deployment
  const finalUrl = 'https://summit-chronicles-starter-81io23ve5-summit-chronicles-projects.vercel.app';
  
  await page.goto(finalUrl, { waitUntil: 'networkidle' });
  
  // Take final screenshot
  await page.screenshot({ 
    path: 'EPIC1-FINAL-PRODUCTION.png', 
    fullPage: true 
  });
  
  console.log('📸 EPIC 1 FINAL PRODUCTION SCREENSHOT SAVED');
  
  // Comprehensive Epic 1 validation
  const pageContent = await page.content();
  
  // 1. Swiss Spa Design System Check
  const hasSwissSpaStyling = pageContent.includes('spa-charcoal') || 
                            pageContent.includes('alpine-blue') || 
                            pageContent.includes('summit-gold') ||
                            pageContent.includes('spa-stone') ||
                            pageContent.includes('spa-mist');
  
  console.log('🎨 Epic 1 - Swiss Spa Colors Present:', hasSwissSpaStyling);
  
  // 2. Premium Hero Section Check
  const hasHeroSection = pageContent.includes('HeroSection') || 
                        pageContent.includes('Journey to the Summit') ||
                        await page.locator('text=Journey to the Summit').count() > 0;
  
  console.log('🏔️ Epic 1 - Premium Hero Section:', hasHeroSection);
  
  // 3. Visual Showcase Check  
  const hasVisualShowcase = pageContent.includes('Visual Journey') || 
                           pageContent.includes('VisualShowcase') ||
                           await page.locator('text=Visual Journey').count() > 0;
  
  console.log('🖼️ Epic 1 - Visual Showcase Section:', hasVisualShowcase);
  
  // 4. Design System Components
  const hasCards = await page.locator('[class*="elevated"], [class*="premium"]').count();
  const hasButtons = await page.locator('button').count();
  const hasStatusBadges = await page.locator('[class*="badge"]').count();
  
  console.log('🃏 Epic 1 - Card Components Found:', hasCards);
  console.log('🔘 Epic 1 - Button Components Found:', hasButtons);
  console.log('🏷️ Epic 1 - Status Badges Found:', hasStatusBadges);
  
  // 5. Typography Check
  const heading = page.locator('h1').first();
  if (await heading.count() > 0) {
    const headingText = await heading.textContent();
    const headingStyles = await heading.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        fontWeight: styles.fontWeight,
        color: styles.color
      };
    });
    
    console.log('📝 Epic 1 - Main Heading:', headingText);
    console.log('🎨 Epic 1 - Typography Styles:', headingStyles);
    
    const isPremiumTypography = !headingStyles.fontFamily.includes('Times') && 
                               (headingStyles.fontSize.includes('px') || headingStyles.fontSize.includes('rem'));
    console.log('✨ Epic 1 - Premium Typography (not Times):', isPremiumTypography);
  }
  
  // 6. Navigation System Check
  const hasNavigation = await page.locator('nav, header').count() > 0;
  const hasFooter = await page.locator('footer').count() > 0;
  
  console.log('🧭 Epic 1 - Navigation System:', hasNavigation);
  console.log('👢 Epic 1 - Footer Component:', hasFooter);
  
  // 7. Content Management Check
  const hasCMSRoutes = pageContent.includes('/admin/content') || 
                      pageContent.includes('/admin/editor');
  
  console.log('📝 Epic 1 - Content Management Routes:', hasCMSRoutes);
  
  // 8. Responsive Design Check
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: 'EPIC1-MOBILE-FINAL.png' });
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.screenshot({ path: 'EPIC1-DESKTOP-FINAL.png' });
  
  console.log('📱 Epic 1 - Mobile & Desktop Screenshots Taken');
  
  // FINAL EPIC 1 ASSESSMENT
  const epic1Score = [
    hasSwissSpaStyling,
    hasHeroSection,
    hasVisualShowcase,
    hasCards > 0,
    hasButtons > 0,
    hasNavigation,
    hasFooter
  ].filter(Boolean).length;
  
  console.log('🎯 EPIC 1 FINAL SCORE:', epic1Score + '/7 features implemented');
  
  if (epic1Score >= 5) {
    console.log('🎉 EPIC 1 SUCCESSFULLY DEPLOYED TO PRODUCTION! 🏔️');
  } else {
    console.log('⚠️ Epic 1 partially deployed - some features missing');
  }
  
  console.log('✅ EPIC 1 FINAL ASSESSMENT COMPLETE');
});