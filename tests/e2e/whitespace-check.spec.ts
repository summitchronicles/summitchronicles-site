import { test, expect } from '@playwright/test';

test.describe('Training Realtime Page Whitespace Check', () => {
  test('should check for excessive whitespace at end of training/realtime page', async ({ page }) => {
    await page.goto('http://localhost:3000/training/realtime');

    // Wait for page to load
    await expect(page.locator('h1:has-text("LIVE TRAINING DATA")')).toBeVisible();

    // Get page height and viewport height
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    console.log(`Page height: ${pageHeight}px, Viewport height: ${viewportHeight}px`);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

    // Check if there's excessive whitespace (more than 2 viewport heights worth of content)
    const ratio = pageHeight / viewportHeight;
    console.log(`Page to viewport ratio: ${ratio}`);

    // Get the last visible content element
    const lastSection = page.locator('div:has-text("PHASE 3 REAL-TIME FEATURES")').last();
    await expect(lastSection).toBeVisible();

    // Check bottom margin/padding of last section
    const lastSectionBox = await lastSection.boundingBox();
    console.log(`Last section bottom: ${lastSectionBox?.y! + lastSectionBox?.height!}px`);

    const distanceFromBottom = pageHeight - (lastSectionBox?.y! + lastSectionBox?.height!);
    console.log(`Distance from last content to page bottom: ${distanceFromBottom}px`);

    // If there's more than 200px of whitespace at bottom, that's excessive
    if (distanceFromBottom > 200) {
      console.log(`❌ EXCESSIVE WHITESPACE FOUND: ${distanceFromBottom}px at bottom of page`);
    } else {
      console.log(`✅ Whitespace looks reasonable: ${distanceFromBottom}px at bottom`);
    }

    // Also check for elements with large py- classes
    const largePaddingElements = await page.locator('[class*="py-12"], [class*="py-16"], [class*="py-20"]').count();
    console.log(`Found ${largePaddingElements} elements with large vertical padding`);

    // Check space-y classes
    const spaceYElements = await page.locator('[class*="space-y-8"], [class*="space-y-12"], [class*="space-y-16"]').count();
    console.log(`Found ${spaceYElements} elements with large vertical spacing`);
  });
});