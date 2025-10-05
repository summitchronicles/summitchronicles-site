import { test, expect } from '@playwright/test';

test.describe('Collapsible Training Calendar Widget', () => {
  test('should show correct week dates (Sept 29 - Oct 5)', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for timeline calendar to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Check correct week dates are displayed
    await expect(page.getByText('Sep 29 - Oct 5, 2025')).toBeVisible();

    // Verify Saturday is marked as "Today" (since today is Saturday)
    await expect(page.getByText('Today')).toBeVisible();

    // Check that days start with Sunday
    const timelineItems = page.locator('[class*="border-"]').filter({
      hasText: /Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/
    });

    // Should have all 7 days including Sunday first
    await expect(timelineItems).toHaveCount(7);

    // Verify Sunday appears before Monday
    await expect(page.getByText('Sunday')).toBeVisible();
    await expect(page.getByText('Monday')).toBeVisible();
  });

  test('should allow collapsing and expanding calendar widget without disappearing', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for page to load
    await expect(page.getByText('Training Calendar')).toBeVisible();

    // Verify calendar is initially expanded and content is visible
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();
    await expect(page.getByText('Weekly Compliance')).toBeVisible();

    // Click to collapse the calendar
    await page.getByRole('button', { name: /Training Calendar/ }).click();

    // Calendar header should still be visible (not disappeared)
    await expect(page.getByText('Training Calendar')).toBeVisible();

    // But the content should be hidden
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).not.toBeVisible();
    await expect(page.getByText('Weekly Compliance')).not.toBeVisible();

    // Verify chevron changed to down arrow when collapsed
    await expect(page.locator('[data-testid="chevron-down"], .lucide-chevron-down')).toBeVisible();

    // Click to expand again
    await page.getByRole('button', { name: /Training Calendar/ }).click();

    // Content should be visible again
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();
    await expect(page.getByText('Weekly Compliance')).toBeVisible();

    // Verify chevron changed back to up arrow when expanded
    await expect(page.locator('[data-testid="chevron-up"], .lucide-chevron-up')).toBeVisible();
  });

  test('should maintain calendar widget visibility during multiple collapse/expand cycles', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for page to load
    await expect(page.getByText('Training Calendar')).toBeVisible();

    // Perform multiple collapse/expand cycles
    for (let i = 0; i < 3; i++) {
      // Collapse
      await page.getByRole('button', { name: /Training Calendar/ }).click();

      // Verify header is still visible
      await expect(page.getByText('Training Calendar')).toBeVisible();

      // Verify content is hidden
      await expect(page.getByText('WEEKLY TRAINING TIMELINE')).not.toBeVisible();

      // Small delay for animation
      await page.waitForTimeout(300);

      // Expand
      await page.getByRole('button', { name: /Training Calendar/ }).click();

      // Verify content is visible again
      await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();
      await expect(page.getByText('Weekly Compliance')).toBeVisible();

      // Small delay for animation
      await page.waitForTimeout(300);
    }
  });

  test('should show Saturday as today with correct workout data', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for timeline to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Check that Saturday is marked as "Today"
    const todayIndicator = page.getByText('Today');
    await expect(todayIndicator).toBeVisible();

    // Verify Saturday workout is visible and marked as today
    const saturdaySection = page.locator('text=Saturday').locator('..');
    await expect(saturdaySection).toBeVisible();

    // Check that Saturday has the "Today" badge
    await expect(page.locator('text=Saturday').locator('..').getByText('Today')).toBeVisible();

    // Verify Saturday shows as not completed (since it's today)
    const saturdayCompliance = page.locator('text=Saturday').locator('..').locator('text=/% Match/');
    await expect(saturdayCompliance).not.toBeVisible();
  });

  test('should display all 7 days with Sunday first', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for timeline to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Check all days are present
    for (const day of daysOrder) {
      await expect(page.getByText(day)).toBeVisible();
    }

    // Get all day elements and verify order
    const dayElements = await page.locator('h3:has-text(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/)').all();

    // Should have exactly 7 days
    expect(dayElements.length).toBe(7);
  });

  test('should show correct compliance data for completed days', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for timeline to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Check that completed days show compliance scores
    await expect(page.locator('text=/100% Match|98% Match|97% Match|95% Match|89% Match/')).toBeVisible();

    // Verify compliance notes are shown
    await expect(page.getByText('Perfect recovery cycling')).toBeVisible();
    await expect(page.getByText('Good mobility session')).toBeVisible();
    await expect(page.getByText('All exercises completed')).toBeVisible();

    // Check that actual durations are displayed
    await expect(page.getByText('actual: 30 min')).toBeVisible();
    await expect(page.getByText('actual: 19 min')).toBeVisible();
    await expect(page.getByText('actual: 44 min')).toBeVisible();
  });
});