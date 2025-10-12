import { test, expect } from '@playwright/test';

test.describe('FloatingAIButton - World-Class UX Design', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page where AI button should appear
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should display floating AI button with correct styling', async ({ page }) => {
    // Wait for button to be visible (after hydration)
    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });

    // Take screenshot of the button in default state
    await page.screenshot({
      path: 'test-results/ai-button-default.png',
      fullPage: false
    });

    // Verify button has correct dimensions
    const buttonBox = await aiButton.boundingBox();
    expect(buttonBox?.width).toBeGreaterThanOrEqual(60);
    expect(buttonBox?.height).toBeGreaterThanOrEqual(60);
  });

  test('should show tooltip after hovering', async ({ page }) => {
    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });

    // Hover over the button
    await aiButton.hover();

    // Wait a bit for tooltip to appear
    await page.waitForTimeout(500);

    // Take screenshot with tooltip
    await page.screenshot({
      path: 'test-results/ai-button-hover-tooltip.png',
      fullPage: false
    });

    // Verify tooltip text is visible
    await expect(page.locator('text=Ask me anything!')).toBeVisible();
    // Use more specific selector for ⌘K in tooltip (not the button badge)
    await expect(page.locator('kbd.font-mono:has-text("⌘K")')).toBeVisible();
  });

  test('should open modal when clicked', async ({ page }) => {
    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });

    // Click the button
    await aiButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Verify modal is visible
    await expect(page.locator('h2:has-text("Ask Sunith")')).toBeVisible();
    // Check for either desktop or mobile version of the text
    const desktopText = page.locator('text=Expert mountaineering guidance & training insights');
    const mobileText = page.locator('p.text-xs:has-text("Expert mountaineering guidance")');
    await expect(desktopText.or(mobileText).first()).toBeVisible();

    // Take screenshot of opened modal
    await page.screenshot({
      path: 'test-results/ai-button-modal-open.png',
      fullPage: true
    });

    // Verify modal has search input
    const searchInput = page.locator('input[placeholder*="Ask about mountaineering"]');
    await expect(searchInput).toBeVisible();

    // Verify example questions are visible (from cmdk Command.Group)
    await expect(page.locator('text=How should I train for high altitude acclimatization?')).toBeVisible();
    await expect(page.locator('text=Example Questions')).toBeVisible();
  });

  test('should close modal with ESC key', async ({ page }) => {
    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });

    // Open modal
    await aiButton.click();
    await page.waitForTimeout(300);

    // Verify modal is open
    await expect(page.locator('h2:has-text("Ask Sunith")')).toBeVisible();

    // Press ESC key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(page.locator('h2:has-text("Ask Sunith")')).not.toBeVisible();
  });

  test('should open modal with Cmd+K keyboard shortcut', async ({ page }) => {
    // Wait for button to be fully ready
    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);

    // Press Cmd+K (or Ctrl+K on Windows/Linux)
    const isMac = process.platform === 'darwin';
    if (isMac) {
      await page.keyboard.press('Meta+k');
    } else {
      await page.keyboard.press('Control+k');
    }

    // Wait for modal animation
    await page.waitForTimeout(500);

    // Verify modal opened - use more flexible selector
    const modalTitle = page.locator('h2', { hasText: 'Ask Sunith' });
    await expect(modalTitle).toBeVisible({ timeout: 5000 });

    // Take screenshot
    await page.screenshot({
      path: 'test-results/ai-button-keyboard-shortcut.png',
      fullPage: true
    });
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });

    // Open modal
    await aiButton.click();
    await page.waitForTimeout(500);

    // Verify modal is open first
    await expect(page.locator('h2:has-text("Ask Sunith")')).toBeVisible();

    // Click backdrop - click at bottom-left corner where the backdrop is definitely visible
    // Get viewport size and click near the edge
    const viewport = page.viewportSize();
    if (viewport) {
      await page.mouse.click(10, viewport.height - 10);
    } else {
      // Fallback if viewport not available
      await page.mouse.click(10, 700);
    }
    await page.waitForTimeout(500);

    // Verify modal is closed
    await expect(page.locator('h2:has-text("Ask Sunith")')).not.toBeVisible();
  });

  test('should show keyboard shortcut badge on hover', async ({ page }) => {
    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });

    // Hover over button
    await aiButton.hover();
    await page.waitForTimeout(300);

    // Take screenshot showing keyboard shortcut badge
    await page.screenshot({
      path: 'test-results/ai-button-keyboard-badge.png',
      fullPage: false
    });

    // Verify ⌘K badge is visible (via title attribute)
    const title = await aiButton.getAttribute('title');
    expect(title).toContain('⌘K');
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });

    // Verify ARIA label
    const ariaLabel = await aiButton.getAttribute('aria-label');
    expect(ariaLabel).toContain('Ask Sunith');
    expect(ariaLabel).toContain('⌘K');

    // Open modal and verify close button accessibility
    await aiButton.click();
    await page.waitForTimeout(300);

    const closeButton = page.locator('button[aria-label*="Close"]');
    await expect(closeButton).toBeVisible();
    const closeAriaLabel = await closeButton.getAttribute('aria-label');
    expect(closeAriaLabel).toContain('ESC');
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const aiButton = page.locator('button[aria-label*="Ask Sunith"]');
    await expect(aiButton).toBeVisible({ timeout: 5000 });

    // Take mobile screenshot
    await page.screenshot({
      path: 'test-results/ai-button-mobile.png',
      fullPage: false
    });

    // Open modal on mobile
    await aiButton.click();
    await page.waitForTimeout(500);

    // Take mobile modal screenshot
    await page.screenshot({
      path: 'test-results/ai-button-modal-mobile.png',
      fullPage: true
    });

    // Verify modal is responsive
    await expect(page.locator('h2:has-text("Ask Sunith")')).toBeVisible();
  });
});
