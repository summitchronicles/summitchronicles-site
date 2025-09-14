import { test, expect } from '@playwright/test';

test.describe('Swiss Spa Design System - Story 1.2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system');
    await page.waitForLoadState('networkidle');
  });

  test('design system page loads with all components', async ({ page }) => {
    // Check main heading
    await expect(page.getByText('Swiss Spa Design System')).toBeVisible();
    
    // Verify all main sections are present
    await expect(page.getByText('Color Palette')).toBeVisible();
    await expect(page.getByText('Typography')).toBeVisible();
    await expect(page.getByText('Buttons')).toBeVisible();
    await expect(page.getByText('Cards & Elevation')).toBeVisible();
    await expect(page.getByText('Form Elements')).toBeVisible();
    await expect(page.getByText('Status Badges')).toBeVisible();
    await expect(page.getByText('Icons')).toBeVisible();
    await expect(page.getByText('Layout Examples')).toBeVisible();
  });

  test('color palette displays correctly', async ({ page }) => {
    // Check that all Swiss spa colors are displayed
    const colorNames = [
      'Alpine Blue',
      'Summit Gold', 
      'Spa Stone',
      'Spa Mist',
      'Spa Cloud',
      'Spa Slate',
      'Spa Charcoal'
    ];

    for (const colorName of colorNames) {
      await expect(page.getByText(colorName)).toBeVisible();
    }
  });

  test('typography hierarchy is properly rendered', async ({ page }) => {
    // Check typography sizes and hierarchy
    await expect(page.getByText('Premium Mountain Experience')).toBeVisible();
    await expect(page.getByText('Swiss Spa Aesthetics')).toBeVisible();
    await expect(page.getByText('Journey to the Summit')).toBeVisible();
    await expect(page.getByText('Training & Preparation')).toBeVisible();
  });

  test('button variants and interactions work correctly', async ({ page }) => {
    // Test button variants are visible
    await expect(page.getByRole('button', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Secondary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ghost' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Summit' })).toBeVisible();

    // Test button hover states
    const primaryButton = page.getByRole('button', { name: 'Primary' }).first();
    await primaryButton.hover();
    
    // Test button sizes
    await expect(page.getByRole('button', { name: 'Small' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Medium' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Large' })).toBeVisible();
  });

  test('form elements function correctly', async ({ page }) => {
    // Test input fields
    const emailInput = page.getByPlaceholder('john@example.com');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Test textarea
    const textarea = page.getByPlaceholder('Enter your message...');
    await textarea.fill('This is a test message');
    await expect(textarea).toHaveValue('This is a test message');
  });

  test('status badges display correctly', async ({ page }) => {
    // Check all badge variants
    await expect(page.getByText('Default')).toBeVisible();
    await expect(page.getByText('Success')).toBeVisible();
    await expect(page.getByText('Warning')).toBeVisible();
    await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText('Info')).toBeVisible();
    await expect(page.getByText('Summit')).toBeVisible();
  });

  test('icons render properly', async ({ page }) => {
    // Check that icons section has icons
    const iconsSection = page.locator('section').filter({ hasText: 'Icons' });
    
    // Verify some common icons are present
    await expect(iconsSection.getByText('Mountain')).toBeVisible();
    await expect(iconsSection.getByText('Trophy')).toBeVisible();
    await expect(iconsSection.getByText('Calendar')).toBeVisible();
  });

  test('layout example showcases swiss spa design', async ({ page }) => {
    // Check the training progress layout example
    await expect(page.getByText('Training Progress Update')).toBeVisible();
    await expect(page.getByText('Week 12 of 24')).toBeVisible();
    await expect(page.getByText('On Track')).toBeVisible();
    
    // Check metrics display
    await expect(page.getByText('127')).toBeVisible(); // Distance
    await expect(page.getByText('2,840')).toBeVisible(); // Elevation
    await expect(page.getByText('18.5')).toBeVisible(); // Duration
  });

  test('visual regression - full page screenshot', async ({ page }) => {
    // Take full page screenshot for visual regression testing
    await expect(page).toHaveScreenshot('design-system-full-page.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('visual regression - typography section', async ({ page }) => {
    const typographySection = page.locator('section').filter({ hasText: 'Typography' });
    await expect(typographySection).toHaveScreenshot('typography-section.png', {
      threshold: 0.2
    });
  });

  test('visual regression - buttons section', async ({ page }) => {
    const buttonsSection = page.locator('section').filter({ hasText: 'Buttons' });
    await expect(buttonsSection).toHaveScreenshot('buttons-section.png', {
      threshold: 0.2
    });
  });

  test('responsive design - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that layout adapts to mobile
    await expect(page.getByText('Swiss Spa Design System')).toBeVisible();
    
    // Take mobile screenshot
    await expect(page).toHaveScreenshot('design-system-mobile.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('responsive design - tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that layout adapts to tablet
    await expect(page.getByText('Swiss Spa Design System')).toBeVisible();
    
    // Take tablet screenshot
    await expect(page).toHaveScreenshot('design-system-tablet.png', {
      fullPage: true,
      threshold: 0.2
    });
  });
});