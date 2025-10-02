import { test, expect } from '@playwright/test';

test.describe('Header Layout Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should have proper corner positioning for logo and support button', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if the header exists
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check logo positioning (left corner)
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();

    // Check support button positioning (right corner)
    const supportButton = page.locator('text=Support Journey');
    await expect(supportButton).toBeVisible();

    // Get bounding boxes to check positioning
    const logoBox = await logo.boundingBox();
    const supportBox = await supportButton.boundingBox();
    const headerBox = await header.boundingBox();

    console.log('Logo position:', logoBox);
    console.log('Support button position:', supportBox);
    console.log('Header dimensions:', headerBox);

    // Logo should be closer to the left edge
    if (logoBox && headerBox) {
      expect(logoBox.x).toBeLessThan(headerBox.width / 3);
    }

    // Support button should be closer to the right edge
    if (supportBox && headerBox) {
      expect(supportBox.x + supportBox.width).toBeGreaterThan((headerBox.width * 2) / 3);
    }
  });

  test('should check grid layout implementation', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check if grid layout is applied
    const headerContainer = page.locator('header > div > div').first();

    // Get computed styles
    const gridStyles = await headerContainer.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
      };
    });

    console.log('Header container styles:', gridStyles);

    // Verify grid layout is applied
    expect(gridStyles.display).toBe('grid');
  });

  test('should take screenshot for visual verification', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Take a screenshot of the header
    const header = page.locator('header');
    await expect(header).toBeVisible();

    await page.screenshot({
      path: 'tests/screenshots/header-layout.png',
      fullPage: false,
      clip: { x: 0, y: 0, width: 1400, height: 100 }
    });
  });

  test('should verify navigation center positioning', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check navigation on desktop view
    await page.setViewportSize({ width: 1200, height: 800 });

    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    const navBox = await nav.boundingBox();
    const viewportWidth = 1200;

    console.log('Navigation position:', navBox);
    console.log('Viewport width:', viewportWidth);

    // Navigation should be roughly centered
    if (navBox) {
      const navCenter = navBox.x + navBox.width / 2;
      const viewportCenter = viewportWidth / 2;

      // Allow some tolerance for centering (within 100px)
      expect(Math.abs(navCenter - viewportCenter)).toBeLessThan(100);
    }
  });
});