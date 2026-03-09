import { test, expect } from '@playwright/test';

test.describe('Realtime Training Page', () => {
  test('should load realtime page with Garmin wellness data', async ({ page }) => {
    await page.goto('/training/realtime');

    await expect(page.getByText('Wellness Metrics')).toBeVisible();
    await expect(page.getByText('Training Performance')).toBeVisible();
    await expect(page.getByText('Data Integration')).toBeVisible();

    await expect(page.getByText('Resting HR')).toBeVisible();
    await expect(page.getByText('Stress Level')).toBeVisible();
    await expect(page.getByText('Sleep Quality')).toBeVisible();
    await expect(page.getByText('Readiness')).toBeVisible();
    await expect(page.getByText('Body Battery')).toBeVisible();
    await expect(page.getByText('Hydration')).toBeVisible();
  });

  test('should show core training performance cards', async ({ page }) => {
    await page.goto('/training/realtime');

    await expect(page.getByText('Total Activities')).toBeVisible();
    await expect(page.getByText('Elevation Gain')).toBeVisible();
    await expect(page.getByText('Weekly Goal')).toBeVisible();
    await expect(page.getByText('Everest 2027')).toBeVisible();
  });

  test('should display live data integration status', async ({ page }) => {
    await page.goto('/training/realtime');

    await expect(page.getByText('Data Integration')).toBeVisible();
    await expect(page.getByText(/Source: garmin/i)).toBeVisible();
    await expect(page.getByText(/Connected|Offline/)).toBeVisible();
  });
});
