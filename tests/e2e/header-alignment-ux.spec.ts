import { test, expect } from '@playwright/test';

test.describe('Header and Hero UX Alignment Tests', () => {

  test('should verify header alignment on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000');

    // Wait for header to load
    await expect(page.locator('header')).toBeVisible();

    // Check logo position (should be close to left edge)
    const logo = page.locator('a.brand');
    const logoBox = await logo.boundingBox();
    console.log(`Desktop Logo left position: ${logoBox?.x}px`);

    // Check support button position (should be close to right edge)
    const supportButton = page.locator('a:has-text("Support Journey")');
    const supportBox = await supportButton.boundingBox();
    const viewportWidth = page.viewportSize()?.width || 1280;
    const supportRightEdge = (supportBox?.x || 0) + (supportBox?.width || 0);
    const distanceFromRight = viewportWidth - supportRightEdge;
    console.log(`Desktop Support button right distance: ${distanceFromRight}px`);

    // Logo should be within 20px of left edge
    expect(logoBox?.x).toBeLessThan(20);
    // Support button should be within 20px of right edge
    expect(distanceFromRight).toBeLessThan(20);
  });

  test('should verify header alignment on iPad', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');

    await expect(page.locator('header')).toBeVisible();

    const logo = page.locator('a.brand');
    const logoBox = await logo.boundingBox();
    console.log(`iPad Logo left position: ${logoBox?.x}px`);

    const supportButton = page.locator('a:has-text("Support Journey")');
    const supportBox = await supportButton.boundingBox();
    const viewportWidth = page.viewportSize()?.width || 768;
    const supportRightEdge = (supportBox?.x || 0) + (supportBox?.width || 0);
    const distanceFromRight = viewportWidth - supportRightEdge;
    console.log(`iPad Support button right distance: ${distanceFromRight}px`);

    // Check if elements are properly aligned on iPad
    expect(logoBox?.x).toBeLessThan(25);
    expect(distanceFromRight).toBeLessThan(25);
  });

  test('should verify header alignment on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');

    await expect(page.locator('header')).toBeVisible();

    const logo = page.locator('a.brand');
    const logoBox = await logo.boundingBox();
    console.log(`Mobile Logo left position: ${logoBox?.x}px`);

    const mobileMenuButton = page.locator('button[aria-label="Toggle mobile menu"]');
    const menuBox = await mobileMenuButton.boundingBox();
    const viewportWidth = page.viewportSize()?.width || 375;
    const menuRightEdge = (menuBox?.x || 0) + (menuBox?.width || 0);
    const distanceFromRight = viewportWidth - menuRightEdge;
    console.log(`Mobile Menu button right distance: ${distanceFromRight}px`);

    expect(logoBox?.x).toBeLessThan(20);
    expect(distanceFromRight).toBeLessThan(20);
  });

  test('should verify hero text alignment across viewports', async ({ page }) => {
    const viewports = [
      { name: 'Desktop', width: 1280, height: 720 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000');

      // Check main hero heading
      const heroHeading = page.locator('h1:has-text("SUMMIT CHRONICLES")');
      await expect(heroHeading).toBeVisible();
      const heroBox = await heroHeading.boundingBox();
      const heroCenter = (heroBox?.x || 0) + (heroBox?.width || 0) / 2;
      const viewportCenter = viewport.width / 2;
      const centerOffset = Math.abs(heroCenter - viewportCenter);

      console.log(`${viewport.name} Hero heading center offset: ${centerOffset}px`);

      // Check subtitle - be more specific to avoid conflicts
      const subtitle = page.locator('p:has-text("Seven Summits • One Journey")');
      await expect(subtitle).toBeVisible();
      const subtitleBox = await subtitle.boundingBox();
      const subtitleCenter = (subtitleBox?.x || 0) + (subtitleBox?.width || 0) / 2;
      const subtitleOffset = Math.abs(subtitleCenter - viewportCenter);

      console.log(`${viewport.name} Subtitle center offset: ${subtitleOffset}px`);

      // Check professional titles
      const profTitles = page.locator('text=MOUNTAINEER');
      if (await profTitles.isVisible()) {
        const profBox = await profTitles.boundingBox();
        const profCenter = (profBox?.x || 0) + (profBox?.width || 0) / 2;
        const profOffset = Math.abs(profCenter - viewportCenter);

        console.log(`${viewport.name} Professional titles center offset: ${profOffset}px`);

        // Professional titles should be reasonably centered within 200px (decorative element)
        expect(profOffset).toBeLessThan(200);
      }

      // Hero elements should be centered within 5px
      expect(centerOffset).toBeLessThan(5);
      expect(subtitleOffset).toBeLessThan(5);
    }
  });

  test('should check header container max-width behavior', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000');

    // Check if header container respects max-width
    const headerContainer = page.locator('header .max-w-7xl');
    await expect(headerContainer).toBeVisible();

    const containerBox = await headerContainer.boundingBox();
    console.log(`Header container width: ${containerBox?.width}px`);

    // Container should not exceed 1280px (max-w-7xl)
    expect(containerBox?.width).toBeLessThanOrEqual(1280);

    // Check margins are equal on both sides when container hits max-width
    if (containerBox && containerBox.width < 1440) {
      const leftMargin = containerBox.x;
      const rightMargin = 1440 - (containerBox.x + containerBox.width);
      const marginDifference = Math.abs(leftMargin - rightMargin);

      console.log(`Left margin: ${leftMargin}px, Right margin: ${rightMargin}px`);
      console.log(`Margin difference: ${marginDifference}px`);

      // Margins should be equal within 2px
      expect(marginDifference).toBeLessThan(2);
    }
  });

  test('should verify text hierarchy and spacing', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad focus
    await page.goto('http://localhost:3000');

    // Check hero section structure
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Get all text elements in hero
    const heroTitle = page.locator('h1:has-text("SUMMIT CHRONICLES")');
    const heroSubtitle = page.locator('p:has-text("Seven Summits • One Journey")');
    const profTitles = page.locator('text=MOUNTAINEER');

    const titleBox = await heroTitle.boundingBox();
    const subtitleBox = await heroSubtitle.boundingBox();

    console.log(`Hero title position: x=${titleBox?.x}, y=${titleBox?.y}`);
    console.log(`Hero subtitle position: x=${subtitleBox?.x}, y=${subtitleBox?.y}`);

    if (await profTitles.isVisible()) {
      const profBox = await profTitles.boundingBox();
      console.log(`Professional titles position: x=${profBox?.x}, y=${profBox?.y}`);

      // Professional titles should be below subtitle
      expect(profBox?.y).toBeGreaterThan(subtitleBox?.y || 0);
    }

    // Title should be above subtitle
    expect(titleBox?.y).toBeLessThan(subtitleBox?.y || Infinity);
  });
});