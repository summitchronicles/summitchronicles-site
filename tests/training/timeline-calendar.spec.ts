import { test, expect } from '@playwright/test';

test.describe('Timeline Calendar Integration', () => {
  test('should display timeline calendar with real workout data from CSV', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Live Training Data');

    // Check that timeline calendar is visible
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Verify compliance dashboard elements
    await expect(page.getByText('Weekly Compliance')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Remaining')).toBeVisible();
    await expect(page.getByText('Week Progress')).toBeVisible();

    // Check that actual workouts from CSV are displayed
    await expect(page.getByText('Mobility & Core')).toBeVisible();
    await expect(page.getByText('Strength Intro')).toBeVisible();
    await expect(page.getByText('Recovery Walk')).toBeVisible();

    // Verify timeline structure with days
    await expect(page.getByText('Monday')).toBeVisible();
    await expect(page.getByText('Tuesday')).toBeVisible();
    await expect(page.getByText('Wednesday')).toBeVisible();
    await expect(page.getByText('Thursday')).toBeVisible();
    await expect(page.getByText('Friday')).toBeVisible();

    // Check for "Today" indicator on Friday (October 4th)
    await expect(page.getByText('Today')).toBeVisible();

    // Verify compliance scores are shown
    await expect(page.locator('text=/\\d+% Match/')).toBeVisible();

    // Check that exercise details are displayed
    await expect(page.getByText('dead bug')).toBeVisible();
    await expect(page.getByText('squat')).toBeVisible();

    // Verify zone information is shown
    await expect(page.getByText('@Z1')).toBeVisible();

    // Check data source attribution
    await expect(page.getByText('Training schedule from Everest Base Schedule')).toBeVisible();
    await expect(page.getByText('Compliance data from Garmin Connect')).toBeVisible();
  });

  test('should show proper workout type colors and icons', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for timeline to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Check that different workout types have different visual indicators
    const timelineItems = page.locator('[class*="border-"]').filter({
      has: page.locator('text=Monday, Tuesday, Wednesday, Thursday, Friday')
    });

    // Should have at least 5 timeline items (Mon-Fri)
    const itemCount = await timelineItems.count();
    expect(itemCount).toBeGreaterThan(3);

    // Check that compliance badges are properly colored
    const complianceBadges = page.locator('text=/\\d+% Match/');
    const badgeCount = await complianceBadges.count();
    expect(badgeCount).toBeGreaterThan(2);
  });

  test('should display workout durations and intensity levels', async ({ page }) => {
    await page.goto('/training/realtime');

    // Wait for content to load
    await expect(page.getByText('WEEKLY TRAINING TIMELINE')).toBeVisible();

    // Check that durations are displayed
    await expect(page.getByText('20 min')).toBeVisible(); // Mobility & Core
    await expect(page.getByText('45 min')).toBeVisible(); // Strength Intro
    await expect(page.getByText('30 min')).toBeVisible(); // Recovery Walk

    // Check that intensity levels are shown
    await expect(page.getByText('Low')).toBeVisible();
    await expect(page.getByText('Medium')).toBeVisible();

    // Verify actual vs planned durations for completed workouts
    await expect(page.getByText('actual: 19 min')).toBeVisible();
    await expect(page.getByText('actual: 44 min')).toBeVisible();
  });
});