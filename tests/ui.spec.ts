import { test, expect } from '@playwright/test';

test('Homepage loads correctly', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000');

  // Check page title
  await expect(page).toHaveTitle(/Summit Chronicles/);

  // Check logo link via testid
  await expect(page.getByTestId('logo-link')).toBeVisible();

  // Check footer text via testid
  await expect(page.getByTestId('footer-text')).toBeVisible();

  // Screenshot
  await page.screenshot({ path: 'playwright-report/homepage.png' });
});

test('Navigation works', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000');

  // Click About via testid
  await page.getByTestId('nav-about').click();

  // Check URL
  await expect(page).toHaveURL(/.*about/);

  // Check About page heading (using a testid is also possible if you add one)
  await expect(page.getByRole('heading', { name: /About/i })).toBeVisible();

  // Screenshot
  await page.screenshot({ path: 'playwright-report/about.png' });
});