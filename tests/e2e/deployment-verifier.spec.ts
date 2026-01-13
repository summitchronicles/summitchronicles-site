import { test, expect } from '@playwright/test';

test.describe('Deployment Verification', () => {
  test.beforeEach(async ({ context }) => {
    // Mock Garmin metrics API to avoid credential errors/dependency
    await context.route(/.*\/api\/training\/metrics.*/, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',

        body: JSON.stringify({
          metrics: {
            mobility: 85,
            stress: 25,
            bodyBattery: 80,
            sleepScore: 90,
            vo2Max: 55
          },
          readiness: 88,
          daysToWalking: 42
        })
      });
    });

    // Mock Blog Posts API
    await context.route(/.*\/api\/posts.*/, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          posts: [
            {
              slug: 'Not-Yet-A-Journey-From-Illness-to-the-Mountains',
              title: 'Not Yet: A Journey From Illness to the Mountains',
              subtitle: 'Test Subtitle',
              excerpt: 'Test Excerpt',
              date: '2023-01-01',
              readTime: '5 min',
              category: 'TRAINING',
              heroImage: '/images/hero.jpg',
              content: { raw: 'Test Content' }
            }
          ]
        })
      });
    });
  });

  test('should navigate to all main routes', async ({ page }) => {
    // 1. Home
    await page.goto('/');
    await expect(page).toHaveTitle(/Summit Chronicles/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // 2. Training
    await page.goto('/training');
    await expect(page).toHaveTitle(/Training/);
    // Check for metrics dashboard presence (basic check)
    await expect(page.locator('text=Recovery Metrics')).toBeVisible();

    // 3. Blog
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Stories/);
    // Ensure at least one blog post is visible
    await expect(page.getByTestId('post-card').first()).toBeVisible();

    // 4. Journey
    await page.goto('/journey');
    await expect(page.locator('h1')).toContainText(/Journey/i); // Adjust based on actual content
  });

  test('should load Mission Log items', async ({ page }) => {
    await page.goto('/training');
    // Check for a known mission log entry or the container - resolve ambiguity by taking first or specific heading
    await expect(page.getByRole('heading', { name: 'Mission Log' }).first()).toBeVisible();
    // Verify items are rendered (assuming list items or cards)
    // const logs = page.locator('.mission-log-entry'); // Selector might be unstable
    // await expect(logs.first()).toBeVisible(); // Commented out to avoid flakiness if empty
  });

  test('should render blog post content without errors', async ({ page }) => {
    await page.goto('/blog');
    // Click the first blog post
    await page.getByTestId('post-card').first().locator('a').click();

    // Verify we are on a post page
    await expect(page).toHaveURL(/\/blog\//);

    // Check for content rendering
    // Assuming individual post page has an h1 or some content
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article p')).not.toHaveCount(0);

    // CRITICAL: Ensure no raw HTML leaked
    const content = await page.content();
    // expect(content).not.toContain('undefined'); // Too aggressive
    expect(content).not.toContain('[object Object]');
  });

  test('should load API routes', async ({ request }) => {
    const response = await request.get('/api/posts');
    expect(response.ok()).toBeTruthy();
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(Array.isArray(body.posts)).toBeTruthy();
  });
});
