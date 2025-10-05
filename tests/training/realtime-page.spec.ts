import { test, expect } from '@playwright/test';

test.describe('Realtime Training Page', () => {
  test('should load realtime page with Garmin wellness data', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Live Training Data');

    // Check that wellness metrics are visible
    await expect(page.getByText('Wellness Metrics')).toBeVisible();
    await expect(page.getByText('Training Performance')).toBeVisible();

    // Verify specific wellness metrics are shown
    await expect(page.getByText('Resting HR')).toBeVisible();
    await expect(page.getByText('Stress Level')).toBeVisible();
    await expect(page.getByText('Sleep Quality')).toBeVisible();
    await expect(page.getByText('Readiness')).toBeVisible();
    await expect(page.getByText('Body Battery')).toBeVisible();
    await expect(page.getByText('Hydration')).toBeVisible();

    // Check that data is loaded (not showing loading state)
    await expect(page.locator('text=...')).toHaveCount(0);

    // Check refresh button works
    await page.click('button:has-text("Refresh")');

    // Verify training calendar is present
    await expect(page.getByText('Training Calendar')).toBeVisible();
    await expect(page.getByText('Sep 30 - Oct 6, 2025')).toBeVisible();

    // Check for current week activities
    await expect(page.getByText('Treadmill Hike')).toBeVisible();
    await expect(page.getByText('Saturday Endurance')).toBeVisible();

    // Verify compliance scoring is shown for completed activities
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('%')).toBeVisible(); // Compliance percentages
  });

  test('should show correct training calendar data for current week', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for calendar to load
    await expect(page.getByText('Training Calendar')).toBeVisible();

    // Check that current week is shown (Sep 30 - Oct 6, 2025)
    await expect(page.getByText('Sep 30 - Oct 6, 2025')).toBeVisible();

    // Verify planned activities for October 4th and 5th
    await expect(page.getByText('Treadmill Hike')).toBeVisible();
    await expect(page.getByText('Saturday Endurance')).toBeVisible();

    // Check training phase
    await expect(page.getByText('Base Training')).toBeVisible();

    // Verify some completed activities show compliance scores
    await expect(page.locator('text=/\\d+% Match/')).toBeVisible();
  });

  test('should display live data integration status', async ({ page }) => {
    await page.goto('/training/realtime');

    // Check data integration section
    await expect(page.getByText('Data Integration')).toBeVisible();
    await expect(page.getByText('Live sync from Garmin wellness data')).toBeVisible();

    // Verify connection status indicators
    await expect(page.getByText('Connected')).toBeVisible();
  });
});