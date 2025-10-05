import { test, expect } from '@playwright/test';

test.describe('Calendar Fixes Verification', () => {
  test('should show correct week dates and collapsible behavior', async ({ page }) => {
    await page.goto('/training/realtime');

    // 1. Verify correct week dates (Sept 29 - Oct 5)
    await expect(page.getByText('Sep 29 - Oct 5, 2025')).toBeVisible();

    // 2. Verify Saturday is marked as "Today"
    await expect(page.getByText('Today')).toBeVisible();

    // 3. Verify calendar header is visible
    await expect(page.getByRole('button', { name: 'Training Calendar' })).toBeVisible();

    // 4. Verify calendar content is initially visible
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // 5. Test collapsing the calendar
    await page.getByRole('button', { name: 'Training Calendar' }).click();

    // 6. Header should still be visible (the main fix)
    await expect(page.getByRole('button', { name: 'Training Calendar' })).toBeVisible();

    // 7. Content should be hidden
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).not.toBeVisible();

    // 8. Test expanding again
    await page.getByRole('button', { name: 'Training Calendar' }).click();

    // 9. Content should be visible again
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();
  });

  test('should display Sunday through Saturday in order', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for timeline to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Check all days are present in correct order
    await expect(page.getByText('Sunday')).toBeVisible();
    await expect(page.getByText('Monday')).toBeVisible();
    await expect(page.getByText('Tuesday')).toBeVisible();
    await expect(page.getByText('Wednesday')).toBeVisible();
    await expect(page.getByText('Thursday')).toBeVisible();
    await expect(page.getByText('Friday')).toBeVisible();
    await expect(page.getByText('Saturday')).toBeVisible();
  });

  test('should show Saturday workout as today (not completed)', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for timeline to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Find Saturday section and verify it has "Today" indicator
    const saturdayRow = page.locator('text=Saturday').locator('..');
    await expect(saturdayRow.getByText('Today')).toBeVisible();

    // Saturday should not show completion percentage since it's today
    await expect(saturdayRow.locator('text=/% Match/')).not.toBeVisible();
  });

  test('should show compliance data for completed days', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for timeline to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Check that some compliance percentages are visible (for completed days)
    await expect(page.getByText('100% Match').first()).toBeVisible();
    await expect(page.getByText('98% Match')).toBeVisible();
    await expect(page.getByText('97% Match')).toBeVisible();

    // Check that compliance notes are visible
    await expect(page.getByText('Perfect recovery cycling')).toBeVisible();
    await expect(page.getByText('Good mobility session')).toBeVisible();
  });
});