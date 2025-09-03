import { test, expect } from '@playwright/test';
import { DesignReviewer } from '../agents/design-reviewer';

test.describe('Summit Chronicles Design Review', () => {
  test('Complete design review - localhost:3000', async ({ page }) => {
    const reviewer = new DesignReviewer(page);
    const report = await reviewer.reviewSite('http://localhost:3000');
    
    // Quality gates for Summit Chronicles
    expect(report.summary.overallScore).toBeGreaterThan(70);
    expect(report.summary.criticalIssues).toBeLessThan(5);
    expect(report.console.javascriptErrors).toBe(0);
    
    // Brand-specific checks
    expect(report.visualQuality.score).toBeGreaterThan(80);
    expect(report.responsive.failedViewports.length).toBe(0);
  });

  test('Visual brand compliance check', async ({ page }) => {
    const reviewer = new DesignReviewer(page);
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check for brand colors in CSS
    const brandColors = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        alpineBlue: root.getPropertyValue('--color-alpine-blue').trim(),
        summitGold: root.getPropertyValue('--color-summit-gold').trim(),
        charcoal: root.getPropertyValue('--color-charcoal').trim()
      };
    });
    
    expect(brandColors.alpineBlue).toBe('#1e3a8a');
    expect(brandColors.summitGold).toBe('#fbbf24');
    expect(brandColors.charcoal).toBe('#1f2937');
  });

  test('Strava integration health check', async ({ page }) => {
    const reviewer = new DesignReviewer(page);
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check if Strava section loads
    const stravaSection = page.locator('section:has-text("Recent Activities")');
    await expect(stravaSection).toBeVisible();
    
    // Should either show activities or fallback message
    const hasActivities = await page.locator('div:has-text("km")').count() > 0;
    const hasFallback = await page.locator('text=No activities found').count() > 0;
    
    expect(hasActivities || hasFallback).toBeTruthy();
  });
});

// Production site testing
test.describe('Summit Chronicles Production Review', () => {
  test('Production site design review', async ({ page }) => {
    test.skip(!process.env.TEST_PRODUCTION, 'Skipping production tests');
    
    const reviewer = new DesignReviewer(page);
    const report = await reviewer.reviewSite('https://summitchronicles.com');
    
    // Production should have higher standards
    expect(report.summary.overallScore).toBeGreaterThan(85);
    expect(report.summary.criticalIssues).toBe(0);
    expect(report.console.javascriptErrors).toBe(0);
    expect(report.console.networkErrors).toBeLessThan(2);
  });
});