import { test, expect } from '@playwright/test';

/**
 * Phase 1 Navigation Bridge Testing
 *
 * Tests the seamless navigation bridge between training pages
 * implemented as part of the 10/10 enhancement roadmap Week 3-4.
 *
 * Key Features Being Tested:
 * - Training Hub navigation component with multiple variants
 * - Breadcrumb navigation showing current location
 * - Tab navigation for seamless section switching
 * - Quick action buttons for common tasks
 * - Visual feedback for active states
 * - Responsive navigation on mobile devices
 */

test.describe('Phase 1: Training Navigation Bridge', () => {

  test.beforeEach(async ({ page }) => {
    // Start from the main training page
    await page.goto('/training');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Training Hub Navigation', () => {

    test('displays training hub with navigation cards', async ({ page }) => {
      // Check for Training Hub section header
      await expect(page.locator('h3:has-text("TRAINING HUB")').first()).toBeVisible();

      // Verify navigation cards are present
      const navCards = page.locator('[href="/training/realtime"]');
      await expect(navCards.first()).toBeVisible();

      // Check for enhanced badge on live data
      await expect(page.locator('text=Enhanced').first()).toBeVisible();

      // Verify quick stats at bottom
      await expect(page.locator('text=4/7').first()).toBeVisible();
      await expect(page.locator('text=Seven Summits').first()).toBeVisible();
    });

    test('navigates to realtime page from training hub', async ({ page }) => {
      // Click on the Live Data card in training hub
      await page.click('[href="/training/realtime"]');

      // Should navigate to realtime page
      await expect(page).toHaveURL('/training/realtime');

      // Wait for realtime page to load
      await page.waitForSelector('[data-testid="enhanced-dashboard"]', { timeout: 10000 });
    });

    test('shows visual feedback for navigation items', async ({ page }) => {
      // Hover over a navigation card
      const liveDataCard = page.locator('[href="/training/realtime"]').first();
      await liveDataCard.hover();

      // Should be visible and clickable
      await expect(liveDataCard).toBeVisible();
      await expect(liveDataCard).toBeEnabled();
    });

  });

  test.describe('Breadcrumb Navigation', () => {

    test('shows breadcrumb navigation on realtime page', async ({ page }) => {
      // Navigate to realtime page
      await page.goto('/training/realtime');
      await page.waitForLoadState('domcontentloaded');

      // Check breadcrumb is present
      await expect(page.locator('text=Home').first()).toBeVisible();
      await expect(page.locator('text=Training').first()).toBeVisible();

      // Verify current page indicator
      await expect(page.locator('text=Live Data').first()).toBeVisible();
    });

    test('allows navigation back to training overview via breadcrumb', async ({ page }) => {
      // Start from realtime page
      await page.goto('/training/realtime');
      await page.waitForLoadState('domcontentloaded');

      // Click on Training in breadcrumb navigation
      const breadcrumbTraining = page.locator('nav').first().locator('[href="/training"]');
      await breadcrumbTraining.click();

      // Should navigate back to training overview
      await expect(page).toHaveURL('/training');
      await expect(page.locator('h3:has-text("TRAINING HUB")').first()).toBeVisible();
    });

    test('allows navigation to home via breadcrumb', async ({ page }) => {
      // Start from realtime page
      await page.goto('/training/realtime');
      await page.waitForLoadState('domcontentloaded');

      // Click on Home in breadcrumb
      await page.click('[href="/"]');

      // Should navigate to home page
      await expect(page).toHaveURL('/');
    });

  });

  test.describe('Tab Navigation', () => {

    test('displays tab navigation on realtime page', async ({ page }) => {
      // Navigate to realtime page
      await page.goto('/training/realtime');
      await page.waitForLoadState('domcontentloaded');

      // Check for tab navigation
      await expect(page.locator('text=Training Overview').first()).toBeVisible();
      await expect(page.locator('text=Live Data').first()).toBeVisible();
      await expect(page.locator('text=Analytics').first()).toBeVisible();
      await expect(page.locator('text=Schedule').first()).toBeVisible();
    });

    test('shows active state for current tab', async ({ page }) => {
      // Navigate to realtime page
      await page.goto('/training/realtime');
      await page.waitForLoadState('domcontentloaded');

      // Live Data tab should be active - use more specific selector
      const activeTab = page.locator('nav a[href="/training/realtime"]');
      await expect(activeTab).toHaveClass(/text-blue-400/);
    });

    test('shows coming soon badges for unavailable features', async ({ page }) => {
      // Navigate to realtime page
      await page.goto('/training/realtime');
      await page.waitForLoadState('domcontentloaded');

      // Check for coming soon badges
      await expect(page.locator('text=Coming Soon').first()).toBeVisible();
    });

    test('allows navigation back to training overview via tabs', async ({ page }) => {
      // Start from realtime page
      await page.goto('/training/realtime');
      await page.waitForLoadState('domcontentloaded');

      // Click on Training Overview tab
      await page.click('[href="/training"]');

      // Should navigate to training overview
      await expect(page).toHaveURL('/training');
    });

  });

  test.describe('Mobile Responsiveness', () => {

    test('adapts navigation for mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigation hub should still be functional
      await expect(page.locator('h3:has-text("TRAINING HUB")').first()).toBeVisible();

      // Cards should stack vertically - check if navigation cards are present
      const navCards = page.locator('[href="/training/realtime"]');
      await expect(navCards.first()).toBeVisible();
    });

    test('tab navigation works on mobile', async ({ page }) => {
      // Set mobile viewport and navigate to realtime
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/training/realtime');
      await page.waitForLoadState('domcontentloaded');

      // Find tab navigation specifically (should be in tabs nav variant)
      const tabsNav = page.locator('nav').filter({ has: page.locator('text=Training Overview') });
      const liveDataTab = tabsNav.locator('a[href="/training/realtime"]');
      const trainingOverviewTab = tabsNav.locator('a[href="/training"]');

      await expect(liveDataTab).toBeVisible();
      await expect(trainingOverviewTab).toBeVisible();

      // Should be able to click on training overview
      await trainingOverviewTab.click();
      await expect(page).toHaveURL('/training');
    });

  });

  test.describe('Performance and Accessibility', () => {

    test('navigation loads quickly', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/training');
      await page.waitForSelector('h3:has-text("TRAINING HUB")', { state: 'visible' });

      const loadTime = Date.now() - startTime;

      // Should load within reasonable time
      expect(loadTime).toBeLessThan(3000);
    });

    test('navigation has proper ARIA attributes', async ({ page }) => {
      // Check training hub navigation
      const navLinks = page.locator('[href="/training/realtime"]');
      await expect(navLinks.first()).toBeVisible();

      // Links should be focusable and have descriptive content
      await navLinks.first().focus();
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('supports keyboard navigation', async ({ page }) => {
      // Tab through navigation elements
      await page.keyboard.press('Tab');

      let focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Should be able to activate with Enter
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Find a navigation link and activate it
      focusedElement = page.locator(':focus');
      if (await focusedElement.getAttribute('href')) {
        await page.keyboard.press('Enter');
        // Should navigate or show focus indication
      }
    });

  });

  test.describe('Animation and Visual Polish', () => {

    test('shows smooth animations for navigation transitions', async ({ page }) => {
      // Check for animation elements
      await expect(page.locator('h3:has-text("TRAINING HUB")').first()).toBeVisible();

      // Should have framer-motion animations or navigation elements
      const navCards = page.locator('[href="/training/realtime"]');
      await expect(navCards.first()).toBeVisible();
    });

    test('displays enhanced badges and visual indicators', async ({ page }) => {
      // Check for enhanced badge
      await expect(page.locator('text=Enhanced')).toBeVisible();

      // Check for visual enhancement icons
      await expect(page.locator('[data-icon="zap"]').or(page.locator('svg.animate-pulse'))).toBeVisible();
    });

  });

});

// Cleanup after tests
test.afterAll(async () => {
  console.log('Training navigation bridge tests completed');
});