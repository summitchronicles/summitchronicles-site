const { test, expect } = require('@playwright/test');

test('check summitchronicles.com live site content', async ({ page }) => {
  // Go to live site
  await page.goto('https://summitchronicles.com');
  
  // Take screenshot
  await page.screenshot({ path: 'live-site-current.png', fullPage: true });
  
  // Check what title and content we see
  const title = await page.title();
  console.log('Site title:', title);
  
  // Check for key indicators of the 5-phase implementation
  const hasAIFeatures = await page.locator('text=AI-Powered').isVisible().catch(() => false);
  const hasAdvancedAnalytics = await page.locator('text=Advanced Analytics').isVisible().catch(() => false);
  const hasPersonalization = await page.locator('text=Personalized').isVisible().catch(() => false);
  const hasRealtime = await page.locator('text=Real-time').isVisible().catch(() => false);
  const hasNewsletter = await page.locator('text=Newsletter').isVisible().catch(() => false);
  
  console.log('AI Features visible:', hasAIFeatures);
  console.log('Advanced Analytics visible:', hasAdvancedAnalytics);
  console.log('Personalization visible:', hasPersonalization);
  console.log('Real-time features visible:', hasRealtime);
  console.log('Newsletter features visible:', hasNewsletter);
  
  // Check main heading
  const mainHeading = await page.locator('h1').first().textContent();
  console.log('Main heading:', mainHeading);
});