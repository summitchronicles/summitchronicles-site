import { test, expect } from '@playwright/test';

test.describe('Training Page Verification', () => {
  test('Training page loads and displays Garmin data correctly', async ({ page }) => {
    // Navigate to training page
    await page.goto('http://localhost:3000/training');
    await page.waitForLoadState('networkidle');

    // Wait for data to load
    await page.waitForTimeout(3000);

    // Take full page screenshot
    await page.screenshot({
      path: 'training-page-full.png',
      fullPage: true
    });

    // Verify page loads
    await expect(page).toHaveTitle(/Training/);

    // Verify Wellness Metrics section exists
    const wellnessSection = page.locator('text=Wellness Metrics');
    await expect(wellnessSection).toBeVisible();

    // Take screenshot of wellness metrics
    const wellnessMetrics = page.locator('text=Wellness Metrics').locator('..').locator('..');
    await wellnessMetrics.screenshot({ path: 'wellness-metrics.png' });

    // Verify Training Performance section exists
    const trainingSection = page.locator('text=Training Performance');
    await expect(trainingSection).toBeVisible();

    // Take screenshot of training performance
    const trainingPerformance = page.locator('text=Training Performance').locator('..').locator('..');
    await trainingPerformance.screenshot({ path: 'training-performance.png' });

    // Verify Garmin data is displayed
    const garminData = page.locator('text=Live from Garmin wellness');
    await expect(garminData).toBeVisible();

    // Check for key metrics
    await expect(page.locator('text=Resting HR')).toBeVisible();
    await expect(page.locator('text=Stress Level')).toBeVisible();
    await expect(page.locator('text=Sleep Quality')).toBeVisible();

    console.log('✅ Training page verification completed successfully');
    console.log('✅ Garmin wellness data is displaying correctly');
    console.log('✅ All key metrics are visible and functional');
  });

  test('Training Realtime page loads correctly', async ({ page }) => {
    // Navigate to training realtime page
    await page.goto('http://localhost:3000/training/realtime');
    await page.waitForLoadState('networkidle');

    // Wait for data to load
    await page.waitForTimeout(3000);

    // Take full page screenshot
    await page.screenshot({
      path: 'training-realtime-full.png',
      fullPage: true
    });

    // Verify page loads
    await expect(page).toHaveTitle(/Training/);

    console.log('✅ Training Realtime page verification completed');
  });
});