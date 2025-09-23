import { test, expect } from '@playwright/test';

test('Test blog post content and images', async ({ page }) => {
  // Navigate to the specific blog post
  await page.goto('http://localhost:3000/blog/Not-Yet-A-Journey-From-Illness-to-the-Mountains');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take screenshot for debugging
  await page.screenshot({ path: 'blog-post-debug.png', fullPage: true });

  // Check the title
  const title = page.locator('h1:has-text("Not Yet: A Journey From Illness to the Mountains")');
  await expect(title).toBeVisible();

  // Check subtitle
  const subtitle = page.locator('text=How a phone call, a virus, and a dream led me to the world\'s highest peaks');
  await expect(subtitle).toBeVisible();

  // Check for intro text
  const introText = page.locator('text=Every summit begins in the mind');
  const hasIntroText = await introText.isVisible();
  console.log('Has intro text "Every summit begins":', hasIntroText);

  // Check for specific content from the authentic story
  const tuberculosisText = page.locator('text=tuberculosis');
  const sakethText = page.locator('text=Saketh');
  const kilimanjaroText = page.locator('text=Kilimanjaro');

  console.log('Has tuberculosis text:', await tuberculosisText.isVisible());
  console.log('Has Saketh text:', await sakethText.isVisible());
  console.log('Has Kilimanjaro text:', await kilimanjaroText.isVisible());

  // Check for old "Mental Game" content that shouldn't be there
  const mentalGameText = page.locator('text=Psychology of Extreme Altitude');
  const deathZoneText = page.locator('text=Death Zone');

  console.log('Has old "Psychology of Extreme Altitude":', await mentalGameText.isVisible());
  console.log('Has old "Death Zone" text:', await deathZoneText.isVisible());

  // Check images
  const heroImage = page.locator('img[alt*="Not Yet"]');
  const hasHeroImage = await heroImage.isVisible();
  console.log('Has hero image:', hasHeroImage);

  if (hasHeroImage) {
    const imageSrc = await heroImage.getAttribute('src');
    console.log('Hero image src:', imageSrc);
  }

  // Log page content to see what's actually there
  const pageContent = await page.content();
  const hasOldContent = pageContent.includes('Psychology of Extreme Altitude');
  const hasNewContent = pageContent.includes('tuberculosis');

  console.log('Page has old content:', hasOldContent);
  console.log('Page has new content:', hasNewContent);
});