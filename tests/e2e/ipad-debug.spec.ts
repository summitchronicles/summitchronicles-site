import { test, expect } from '@playwright/test';

test.describe('iPad Header Debug', () => {
  test('debug iPad header layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');

    await expect(page.locator('header')).toBeVisible();

    // Check all elements in header
    console.log('=== iPad Header Debug ===');

    // Check desktop nav visibility
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    const isDesktopNavVisible = await desktopNav.isVisible();
    console.log(`Desktop nav visible: ${isDesktopNavVisible}`);

    // Check CTA buttons visibility
    const ctaContainer = page.locator('div.hidden.md\\:flex');
    const isCtaVisible = await ctaContainer.isVisible();
    console.log(`CTA container visible: ${isCtaVisible}`);

    // Check mobile menu button
    const mobileButton = page.locator('button[aria-label="Toggle mobile menu"]');
    const isMobileButtonVisible = await mobileButton.isVisible();
    console.log(`Mobile button visible: ${isMobileButtonVisible}`);

    // Find all buttons in header
    const allButtons = await page.locator('header button').all();
    console.log(`Total buttons in header: ${allButtons.length}`);

    for (let i = 0; i < allButtons.length; i++) {
      const btn = allButtons[i];
      const text = await btn.textContent();
      const box = await btn.boundingBox();
      console.log(`Button ${i}: "${text}" at x=${box?.x}, y=${box?.y}, width=${box?.width}`);
    }

    // Find all links in header
    const allLinks = await page.locator('header a').all();
    console.log(`Total links in header: ${allLinks.length}`);

    for (let i = 0; i < allLinks.length; i++) {
      const link = allLinks[i];
      const text = await link.textContent();
      const box = await link.boundingBox();
      console.log(`Link ${i}: "${text}" at x=${box?.x}, y=${box?.y}, width=${box?.width}`);
    }

    // Check specific support button
    const supportButtons = await page.locator('text=Support Journey').all();
    console.log(`Support Journey buttons found: ${supportButtons.length}`);

    for (let i = 0; i < supportButtons.length; i++) {
      const btn = supportButtons[i];
      const isVisible = await btn.isVisible();
      const box = await btn.boundingBox();
      console.log(`Support button ${i}: visible=${isVisible}, x=${box?.x}, y=${box?.y}`);
    }

    // Check overall header structure
    const headerContainer = page.locator('header .max-w-7xl');
    const containerBox = await headerContainer.boundingBox();
    console.log(`Header container: x=${containerBox?.x}, width=${containerBox?.width}`);

    const headerFlex = page.locator('header .flex.items-center.justify-between');
    const flexBox = await headerFlex.boundingBox();
    console.log(`Header flex: x=${flexBox?.x}, width=${flexBox?.width}`);
  });
});