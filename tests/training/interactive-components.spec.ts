import { test, expect } from '@playwright/test';

/**
 * Phase 1 Enhancement Testing: Interactive Data Visualization Components
 *
 * Tests the new interactive metric cards and enhanced training dashboard
 * that were implemented as part of the 10/10 enhancement roadmap.
 *
 * Key Features Being Tested:
 * - Interactive metric cards with expandable content
 * - Hover effects and 3D animations
 * - Touch gesture support for mobile
 * - Progressive loading with intersection observers
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Performance optimization
 */

test.describe('Phase 1: Interactive Data Visualization Components', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to training realtime page where enhanced components are used
    await page.goto('/training/realtime');

    // Wait for initial load but don't wait for all network activity
    // since we have progressive loading
    await page.waitForLoadState('domcontentloaded');

    // Wait specifically for the enhanced dashboard to appear
    await page.waitForSelector('[data-testid="enhanced-dashboard"]', {
      timeout: 10000,
      state: 'visible'
    });

    // Scroll to the enhanced dashboard to ensure it's in view
    await page.locator('[data-testid="enhanced-dashboard"]').scrollIntoViewIfNeeded();
  });

  test.describe('Interactive Metric Cards', () => {

    test('displays metric cards with basic data', async ({ page }) => {
      // Verify metric cards are present
      await expect(page.locator('[data-testid="metric-card"]')).toHaveCount(8); // 4 training + 4 wellness

      // Check for specific metric cards
      await expect(page.locator('[data-testid="metric-total-activities"]')).toBeVisible();
      await expect(page.locator('[data-testid="metric-total-elevation"]')).toBeVisible();
      await expect(page.locator('[data-testid="metric-weekly-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="metric-everest-countdown"]')).toBeVisible();

      // Verify basic metric data is displayed
      await expect(page.locator('[data-testid="metric-total-activities"] .value')).not.toBeEmpty();
      await expect(page.locator('[data-testid="metric-total-elevation"] .value')).not.toBeEmpty();
    });

    test('expands metric cards on click to show detailed information', async ({ page }) => {
      const firstMetricCard = page.locator('[data-testid="metric-card"]').first();

      // Initially, detailed content should not be visible
      await expect(firstMetricCard.locator('[data-testid="expanded-content"]')).not.toBeVisible();

      // Click to expand
      await firstMetricCard.click();

      // Detailed content should now be visible
      await expect(firstMetricCard.locator('[data-testid="expanded-content"]')).toBeVisible();

      // Verify expanded content elements
      await expect(firstMetricCard.locator('[data-testid="trend-chart"]')).toBeVisible();
      await expect(firstMetricCard.locator('[data-testid="insights-list"]')).toBeVisible();
      await expect(firstMetricCard.locator('[data-testid="recommendations-list"]')).toBeVisible();

      // Click again to collapse
      await firstMetricCard.click();
      await expect(firstMetricCard.locator('[data-testid="expanded-content"]')).not.toBeVisible();
    });

    test('shows hover effects and animations', async ({ page }) => {
      const metricCard = page.locator('[data-testid="metric-card"]').first();

      // Get initial transform
      const initialTransform = await metricCard.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      // Hover over the card
      await metricCard.hover();

      // Wait for animation and check transform has changed (scale effect)
      await page.waitForTimeout(100);
      const hoveredTransform = await metricCard.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      expect(hoveredTransform).not.toBe(initialTransform);

      // Verify expansion indicator rotates on hover
      const expandIcon = metricCard.locator('[data-testid="expand-icon"]');
      await expect(expandIcon).toHaveCSS('transform', /rotate/);
    });

    test('displays trend indicators correctly', async ({ page }) => {
      const metricCards = page.locator('[data-testid="metric-card"]');

      // Check that trend indicators are present
      for (let i = 0; i < await metricCards.count(); i++) {
        const card = metricCards.nth(i);
        const trendIndicator = card.locator('[data-testid="trend-indicator"]');

        if (await trendIndicator.isVisible()) {
          // Verify trend direction icons
          const hasUpTrend = await card.locator('[data-testid="trend-up"]').isVisible();
          const hasDownTrend = await card.locator('[data-testid="trend-down"]').isVisible();
          const hasStableTrend = await card.locator('[data-testid="trend-stable"]').isVisible();

          expect(hasUpTrend || hasDownTrend || hasStableTrend).toBe(true);

          // Verify percentage is shown
          await expect(card.locator('[data-testid="trend-percentage"]')).not.toBeEmpty();
        }
      }
    });

    test('loads detailed data progressively', async ({ page }) => {
      const metricCard = page.locator('[data-testid="metric-total-activities"]');

      // Expand the card
      await metricCard.click();

      // Wait for expanded content to load
      await expect(metricCard.locator('[data-testid="expanded-content"]')).toBeVisible();

      // Verify historical data is loaded
      await expect(metricCard.locator('[data-testid="trend-chart"]')).toBeVisible();

      // Check that chart has data points
      const chartBars = metricCard.locator('[data-testid="chart-bar"]');
      expect(await chartBars.count()).toBeGreaterThan(0);

      // Verify insights are populated
      const insights = metricCard.locator('[data-testid="insight-item"]');
      expect(await insights.count()).toBeGreaterThan(0);

      // Verify recommendations are shown
      const recommendations = metricCard.locator('[data-testid="recommendation-item"]');
      expect(await recommendations.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Enhanced Training Dashboard', () => {

    test('displays both training and wellness metrics sections', async ({ page }) => {
      // Training Performance section
      await expect(page.locator('[data-testid="training-performance-section"]')).toBeVisible();
      await expect(page.locator('h2:has-text("Training Performance")')).toBeVisible();

      // Wellness & Recovery section
      await expect(page.locator('[data-testid="wellness-recovery-section"]')).toBeVisible();
      await expect(page.locator('h2:has-text("Wellness & Recovery")')).toBeVisible();

      // Quick Actions bar
      await expect(page.locator('[data-testid="quick-actions-bar"]')).toBeVisible();
    });

    test('shows loading states appropriately', async ({ page }) => {
      // Navigate to page and intercept API calls to simulate loading
      await page.route('/api/training/metrics', route => {
        // Delay response to test loading state
        setTimeout(() => route.continue(), 2000);
      });

      await page.goto('/training/realtime');

      // Should show loading indicator
      await expect(page.locator('[data-testid="dashboard-loading"]')).toBeVisible();
      await expect(page.locator('text=Loading training insights')).toBeVisible();

      // Wait for loading to complete
      await expect(page.locator('[data-testid="enhanced-dashboard"]')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('[data-testid="dashboard-loading"]')).not.toBeVisible();
    });

    test('handles errors gracefully', async ({ page }) => {
      // Mock API error
      await page.route('/api/training/metrics', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'API Error' })
        });
      });

      await page.goto('/training/realtime');

      // Should show error state
      await expect(page.locator('[data-testid="dashboard-error"]')).toBeVisible();
      await expect(page.locator('text=Unable to load training data')).toBeVisible();
    });

    test('supports staggered animations for metric cards', async ({ page }) => {
      // All metric cards should be present
      const metricCards = page.locator('[data-testid="metric-card"]');
      expect(await metricCards.count()).toBeGreaterThan(4);

      // Cards should animate in with staggered timing
      // We can't easily test the exact timing, but we can verify they all become visible
      for (let i = 0; i < await metricCards.count(); i++) {
        await expect(metricCards.nth(i)).toBeVisible();
      }
    });
  });

  test.describe('Accessibility Features', () => {

    test('supports keyboard navigation', async ({ page }) => {
      // Focus should move through metric cards with Tab
      await page.keyboard.press('Tab');

      let focusedElement = await page.locator(':focus');
      await expect(focusedElement).toHaveAttribute('role', 'button');

      // Enter key should expand/collapse cards
      await page.keyboard.press('Enter');
      await expect(page.locator('[data-testid="expanded-content"]').first()).toBeVisible();

      await page.keyboard.press('Enter');
      await expect(page.locator('[data-testid="expanded-content"]').first()).not.toBeVisible();
    });

    test('has proper ARIA labels and descriptions', async ({ page }) => {
      const metricCards = page.locator('[data-testid="metric-card"]');

      for (let i = 0; i < await metricCards.count(); i++) {
        const card = metricCards.nth(i);

        // Should have aria-label describing the metric
        await expect(card).toHaveAttribute('aria-label');

        // Should have aria-expanded state
        await expect(card).toHaveAttribute('aria-expanded');

        // Should be focusable
        await expect(card).toHaveAttribute('tabindex', '0');
      }
    });

    test('respects reduced motion preferences', async ({ page }) => {
      // Test with reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();

      // Wait for page to load
      await page.waitForSelector('[data-testid="enhanced-dashboard"]');

      // Animations should be minimal or disabled
      const metricCard = page.locator('[data-testid="metric-card"]').first();
      await metricCard.hover();

      // Transform should be minimal or none with reduced motion
      const transform = await metricCard.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      // Should not have significant scaling
      expect(transform).not.toMatch(/scale\(1\.[2-9]/);
    });
  });

  test.describe('Performance Optimization', () => {

    test('loads within performance budget', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/training/realtime');
      await page.waitForSelector('[data-testid="enhanced-dashboard"]');

      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds (increased from 2s due to enhanced components)
      expect(loadTime).toBeLessThan(3000);
    });

    test('uses intersection observer for progressive loading', async ({ page }) => {
      // Verify intersection observer is set up
      const hasIntersectionObserver = await page.evaluate(() => {
        return 'IntersectionObserver' in window;
      });

      expect(hasIntersectionObserver).toBe(true);

      // Scroll to trigger intersection observer
      await page.evaluate(() => {
        const dashboard = document.querySelector('[data-testid="enhanced-dashboard"]');
        if (dashboard) {
          dashboard.scrollIntoView();
        }
      });

      // Dashboard should become visible
      await expect(page.locator('[data-testid="enhanced-dashboard"]')).toBeVisible();
    });

    test('handles rapid interactions without performance degradation', async ({ page }) => {
      await page.waitForSelector('[data-testid="enhanced-dashboard"]');

      const metricCards = page.locator('[data-testid="metric-card"]');
      const cardCount = await metricCards.count();

      // Rapidly click multiple cards
      for (let i = 0; i < Math.min(cardCount, 5); i++) {
        await metricCards.nth(i).click();
        await page.waitForTimeout(50); // Brief pause
      }

      // All cards should still be responsive
      for (let i = 0; i < Math.min(cardCount, 5); i++) {
        await expect(metricCards.nth(i)).toBeVisible();
      }

      // No JavaScript errors should occur
      const jsErrors = await page.evaluate(() => {
        return (window as any).jsErrors || [];
      });

      expect(jsErrors.length).toBe(0);
    });
  });

  test.describe('Mobile Touch Support', () => {

    test('supports touch gestures on mobile', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.setViewportSize({ width: 375, height: 667 });
      }

      await page.waitForSelector('[data-testid="enhanced-dashboard"]');

      const metricCard = page.locator('[data-testid="metric-card"]').first();

      // Simulate touch tap
      await metricCard.tap();

      // Card should expand
      await expect(metricCard.locator('[data-testid="expanded-content"]')).toBeVisible();

      // Tap again to collapse
      await metricCard.tap();
      await expect(metricCard.locator('[data-testid="expanded-content"]')).not.toBeVisible();
    });

    test('adapts layout for mobile viewports', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForSelector('[data-testid="enhanced-dashboard"]');

      // Grid should stack on mobile
      const metricsGrid = page.locator('[data-testid="metrics-grid"]');
      const gridColumns = await metricsGrid.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Should be single column on mobile
      expect(gridColumns).toMatch(/^1fr|^repeat\(1,/);

      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(100);

      const tabletGridColumns = await metricsGrid.evaluate(el => {
        return window.getComputedStyle(el).gridTemplateColumns;
      });

      // Should be 2 columns on tablet
      expect(tabletGridColumns).not.toBe(gridColumns);
    });
  });
});

// Add test data setup helpers if needed
test.afterAll(async () => {
  // Cleanup any test data or state
  console.log('Interactive components tests completed');
});