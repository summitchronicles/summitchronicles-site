const { test, expect } = require('@playwright/test');

test('verify summitchronicles.com current deployment and all 5 development phases', async ({ page }) => {
  console.log('Testing summitchronicles.com live site...');
  
  // Go to live site
  await page.goto('https://summitchronicles.com');
  
  // Take screenshot for comparison
  await page.screenshot({ path: 'live-site-verification.png', fullPage: true });
  
  // Check what title and content we see
  const title = await page.title();
  console.log('Site title:', title);
  
  // Check main heading to understand which version we're seeing
  const mainHeading = await page.locator('h1').first().textContent();
  console.log('Main heading:', mainHeading);
  
  // PHASE 1: Swiss Spa Foundation - Check for spa-themed content
  const hasSwissTheme = await page.locator('text=Swiss').isVisible().catch(() => false);
  const hasSpaElements = await page.locator('.spa-').isVisible().catch(() => false);
  console.log('Phase 1 - Swiss Spa Foundation visible:', hasSwissTheme || hasSpaElements);
  
  // PHASE 2: Personal Story Integration - Check for personal narrative
  const hasPersonalStory = await page.locator('text=journey').isVisible().catch(() => false);
  const hasSevenSummits = await page.locator('text=Seven Summits').isVisible().catch(() => false);
  console.log('Phase 2 - Personal Story Integration visible:', hasPersonalStory || hasSevenSummits);
  
  // PHASE 3: AI-Powered Features - Check for AI capabilities
  const hasAISearch = await page.locator('text=AI').isVisible().catch(() => false);
  const hasSmartSearch = await page.locator('text=Smart Search').isVisible().catch(() => false);
  const hasTrainingInsights = await page.locator('text=Training Insights').isVisible().catch(() => false);
  console.log('Phase 3 - AI-Powered Features visible:', hasAISearch || hasSmartSearch || hasTrainingInsights);
  
  // PHASE 4: Community Engagement - Check for community features  
  const hasNewsletter = await page.locator('text=Newsletter').isVisible().catch(() => false);
  const hasCommunity = await page.locator('text=Community').isVisible().catch(() => false);
  const hasSubscribe = await page.locator('text=Subscribe').isVisible().catch(() => false);
  console.log('Phase 4 - Community Engagement visible:', hasNewsletter || hasCommunity || hasSubscribe);
  
  // PHASE 5: Performance Optimization - Check for advanced analytics and real-time features
  const hasAdvancedAnalytics = await page.locator('text=Advanced Analytics').isVisible().catch(() => false);
  const hasRealtime = await page.locator('text=Real-time').isVisible().catch(() => false);
  const hasPersonalization = await page.locator('text=Personalized').isVisible().catch(() => false);
  console.log('Phase 5 - Performance Optimization visible:', hasAdvancedAnalytics || hasRealtime || hasPersonalization);
  
  // Check if we can navigate to key pages
  const hasTrainingPage = await page.locator('a[href*="training"]').isVisible().catch(() => false);
  const hasAboutPage = await page.locator('a[href*="about"]').isVisible().catch(() => false);
  const hasBlogPage = await page.locator('a[href*="blog"]').isVisible().catch(() => false);
  console.log('Navigation - Training page link visible:', hasTrainingPage);
  console.log('Navigation - About page link visible:', hasAboutPage);
  console.log('Navigation - Blog page link visible:', hasBlogPage);
  
  // Count total phases visible
  const phasesVisible = [
    hasSwissTheme || hasSpaElements,
    hasPersonalStory || hasSevenSummits, 
    hasAISearch || hasSmartSearch || hasTrainingInsights,
    hasNewsletter || hasCommunity || hasSubscribe,
    hasAdvancedAnalytics || hasRealtime || hasPersonalization
  ].filter(Boolean).length;
  
  console.log(`\n=== VERIFICATION SUMMARY ===`);
  console.log(`Total development phases visible: ${phasesVisible}/5`);
  console.log(`Site appears to be ${phasesVisible >= 4 ? 'FULLY UPDATED' : 'OUTDATED VERSION'}`);
  
  if (phasesVisible < 4) {
    console.log('⚠️  Custom domain may need to be updated to point to latest deployment');
  } else {
    console.log('✅ All major development phases are visible on live domain');
  }
});

test('verify latest vercel deployment has all features', async ({ page }) => {
  console.log('Testing latest Vercel deployment directly...');
  
  // Test the latest deployment URL directly
  await page.goto('https://summit-chronicles-starter-iqrfkhl3p-summit-chronicles-projects.vercel.app');
  
  // Take screenshot
  await page.screenshot({ path: 'latest-deployment-verification.png', fullPage: true });
  
  const title = await page.title();
  console.log('Latest deployment title:', title);
  
  // Test for all 5 phases on latest deployment
  const hasAI = await page.locator('text=AI').isVisible().catch(() => false);
  const hasPersonalization = await page.locator('text=Personalized').isVisible().catch(() => false);
  const hasAnalytics = await page.locator('text=Analytics').isVisible().catch(() => false);
  const hasNewsletter = await page.locator('text=Newsletter').isVisible().catch(() => false);
  const hasTraining = await page.locator('text=Training').isVisible().catch(() => false);
  
  console.log('Latest deployment features:');
  console.log('- AI Features:', hasAI);
  console.log('- Personalization:', hasPersonalization);
  console.log('- Analytics:', hasAnalytics);
  console.log('- Newsletter:', hasNewsletter);
  console.log('- Training:', hasTraining);
  
  const latestFeatures = [hasAI, hasPersonalization, hasAnalytics, hasNewsletter, hasTraining].filter(Boolean).length;
  console.log(`Latest deployment has ${latestFeatures}/5 expected features`);
});