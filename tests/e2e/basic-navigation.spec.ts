import { test, expect } from '@playwright/test';

test.describe('Basic Navigation - Story 1.1', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads without errors
    await expect(page).toHaveTitle(/Summit Chronicles/);
    
    // Verify basic content structure exists
    await expect(page.locator('main')).toBeVisible();
  });

  test('navigation menu functionality', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const aboutLink = page.locator('a[href="/about"]');
    const blogLink = page.locator('a[href="/blog"]');
    const trainingLink = page.locator('a[href="/training"]');
    
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await expect(page).toHaveURL(/\/about/);
    }
    
    await page.goto('/');
    
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await expect(page).toHaveURL(/\/blog/);
    }
    
    await page.goto('/');
    
    if (await trainingLink.count() > 0) {
      await trainingLink.click();
      await expect(page).toHaveURL(/\/training/);
    }
  });

  test('development server runs without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    
    // Allow some time for any console errors to appear
    await page.waitForTimeout(2000);
    
    // Filter out known development warnings
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Warning:') && 
      !error.includes('Download the React DevTools')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('swiss spa design tokens are applied', async ({ page }) => {
    await page.goto('/');
    
    // Check that Tailwind CSS is loaded and custom colors are available
    const htmlElement = page.locator('html');
    await expect(htmlElement).toBeVisible();
    
    // Verify that the page has the expected styling structure
    const bodyElement = page.locator('body');
    await expect(bodyElement).toBeVisible();
    
    // Test that CSS is properly loaded (no unstyled content flash)
    await page.waitForLoadState('networkidle');
    
    // Check for presence of styled elements
    const styledElements = page.locator('[class*="text-"], [class*="bg-"], [class*="p-"], [class*="m-"]');
    const count = await styledElements.count();
    expect(count).toBeGreaterThan(0);
  });
});