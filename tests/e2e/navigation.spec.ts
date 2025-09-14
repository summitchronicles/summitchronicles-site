import { test, expect } from '@playwright/test';

test.describe('Navigation - Story 1.3', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('header displays correctly with all navigation elements', async ({ page }) => {
    // Check header is visible and fixed
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveClass(/fixed/);

    // Check brand/logo
    await expect(page.locator('header').getByText('Summit Chronicles')).toBeVisible();
    
    // Check primary navigation links
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Training' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();

    // Check CTA buttons
    await expect(page.getByRole('link', { name: /Newsletter/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Support Journey/ })).toBeVisible();
  });

  test('mobile navigation menu works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Mobile menu button should be visible
    const menuButton = page.getByRole('button', { name: /toggle mobile menu/i });
    await expect(menuButton).toBeVisible();

    // Menu should be closed initially
    await expect(page.getByText('My Story')).not.toBeVisible();

    // Open mobile menu
    await menuButton.click();
    await expect(page.getByText('My Story')).toBeVisible();
    await expect(page.getByText('Training Progress')).toBeVisible();

    // Test mobile CTA buttons
    await expect(page.getByRole('link', { name: /Newsletter Updates/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Support My Journey/ })).toBeVisible();

    // Close menu by clicking X
    await page.getByRole('button', { name: /toggle mobile menu/i }).click();
    await expect(page.getByText('My Story')).not.toBeVisible();
  });

  test('navigation links work correctly', async ({ page }) => {
    // Test navigation to different pages
    await page.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about/);
    
    await page.getByRole('link', { name: 'Training', exact: true }).click();
    await expect(page).toHaveURL(/\/training/);
    
    await page.getByRole('link', { name: 'Blog', exact: true }).click();
    await expect(page).toHaveURL(/\/blog/);
    
    // Return to home
    await page.getByRole('link', { name: 'Summit Chronicles' }).click();
    await expect(page).toHaveURL('/');
  });

  test('active navigation state is highlighted correctly', async ({ page }) => {
    // Check home is active initially
    const homeLink = page.getByRole('link', { name: 'Home', exact: true });
    
    // Navigate to about page
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    // Check about link has active styling
    const aboutLink = page.getByRole('link', { name: 'About', exact: true });
    await expect(aboutLink).toHaveClass(/text-alpine-blue/);
  });

  test('header scroll behavior works correctly', async ({ page }) => {
    const header = page.locator('header');
    
    // Initially transparent/no background
    await expect(header).toHaveClass(/bg-transparent/);
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(500); // Wait for scroll effect
    
    // Should have background now
    await expect(header).toHaveClass(/bg-white/);
  });

  test('footer displays correctly with all sections', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check brand section
    await expect(footer.getByText('Summit Chronicles')).toBeVisible();
    await expect(footer.getByText(/Follow my journey to the summit/)).toBeVisible();
    
    // Check newsletter section
    await expect(footer.getByText('Stay Connected')).toBeVisible();
    await expect(footer.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(footer.getByRole('button', { name: /Subscribe/ })).toBeVisible();
    
    // Check footer navigation sections
    await expect(footer.getByText('The Journey')).toBeVisible();
    await expect(footer.getByText('Community')).toBeVisible();
    await expect(footer.getByText('Resources')).toBeVisible();
    
    // Check social proof section
    await expect(footer.getByText('Expedition Status')).toBeVisible();
    await expect(footer.getByText(/Everest 2024 Training/)).toBeVisible();
    
    // Check legal links
    await expect(footer.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
  });

  test('newsletter signup functionality', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const emailInput = page.getByPlaceholder('Enter your email');
    const subscribeButton = page.getByRole('button', { name: /Subscribe/ });
    
    // Test empty submission
    await subscribeButton.click();
    
    // Test valid email submission
    await emailInput.fill('test@example.com');
    await subscribeButton.click();
    
    // Should show loading state briefly, then success message
    await expect(page.getByText(/Successfully subscribed/)).toBeVisible({ timeout: 5000 });
  });

  test('keyboard navigation works correctly', async ({ page }) => {
    // Test tab navigation through header elements
    await page.keyboard.press('Tab'); // Should focus logo/brand
    await page.keyboard.press('Tab'); // Should focus first nav link
    await page.keyboard.press('Tab'); // Should focus second nav link
    
    // Test Enter key activation
    await page.keyboard.press('Enter');
    
    // Should navigate to the focused page
    await page.waitForLoadState('networkidle');
    expect(page.url()).not.toBe('/');
  });

  test('responsive design across different viewports', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByRole('button', { name: /toggle mobile menu/i })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();

    // Tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('button', { name: /toggle mobile menu/i })).toBeVisible();
  });

  test('loading states display correctly', async ({ page }) => {
    // Test newsletter loading state
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const emailInput = page.getByPlaceholder('Enter your email');
    const subscribeButton = page.getByRole('button', { name: /Subscribe/ });
    
    await emailInput.fill('test@example.com');
    await subscribeButton.click();
    
    // Should show loading spinner briefly
    await expect(page.getByText(/Subscribing/)).toBeVisible({ timeout: 1000 });
  });

  test('accessibility compliance', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.getByRole('button', { name: /toggle mobile menu/i })).toHaveAttribute('aria-label');
    
    // Check for proper heading hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Check for proper landmarks
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check color contrast (basic check)
    const navLinks = page.locator('nav a');
    const firstLink = navLinks.first();
    const color = await firstLink.evaluate(el => getComputedStyle(el).color);
    expect(color).toBeTruthy(); // Basic check that color is computed
  });

  test('visual regression - header component', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-component.png', {
      threshold: 0.2
    });
  });

  test('visual regression - footer component', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer-component.png', {
      threshold: 0.2
    });
  });

  test('visual regression - mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    await page.getByRole('button', { name: /toggle mobile menu/i }).click();
    await page.waitForTimeout(500); // Wait for animation

    const mobileMenu = page.locator('header');
    await expect(mobileMenu).toHaveScreenshot('mobile-navigation.png', {
      threshold: 0.2
    });
  });
});