import { test, expect } from '@playwright/test';

test('check actual deployment styling', async ({ page }) => {
  // Go to the actual deployment URL
  await page.goto('https://summit-chronicles-starter-8vtslqbkp-summit-chronicles-projects.vercel.app');
  
  // Wait for page to fully load
  await page.waitForLoadState('networkidle');
  
  // Take a full page screenshot to see the actual styling
  await page.screenshot({ 
    path: 'deployment-actual-styling.png', 
    fullPage: true 
  });
  
  // Check if we have the premium hero section
  const heroSection = page.locator('section').first();
  await expect(heroSection).toBeVisible();
  
  // Check for Swiss spa styling classes
  const hasSwissSpaStyling = await page.evaluate(() => {
    const body = document.body;
    const hasSpaStyling = body.innerHTML.includes('spa-') || 
                         body.innerHTML.includes('alpine-') || 
                         body.innerHTML.includes('summit-');
    return hasSpaStyling;
  });
  
  console.log('Has Swiss Spa CSS classes:', hasSwissSpaStyling);
  
  // Check the title and main content
  const title = await page.title();
  console.log('Page title:', title);
  
  // Get the computed styles of the main heading
  const heading = page.locator('h1').first();
  if (await heading.count() > 0) {
    const headingStyles = await heading.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        fontSize: styles.fontSize,
        fontFamily: styles.fontFamily,
        color: styles.color,
        fontWeight: styles.fontWeight
      };
    });
    console.log('Heading styles:', headingStyles);
  }
  
  // Check if Tailwind CSS is loaded
  const hasTailwind = await page.evaluate(() => {
    const stylesheets = Array.from(document.styleSheets);
    return stylesheets.some(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        return rules.some(rule => rule.cssText && rule.cssText.includes('tailwind'));
      } catch (e) {
        return false;
      }
    });
  });
  
  console.log('Has Tailwind CSS loaded:', hasTailwind);
});