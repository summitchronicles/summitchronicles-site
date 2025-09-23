import { test, expect } from '@playwright/test';

test('Test stories page content', async ({ page }) => {
  // Navigate to stories page
  await page.goto('http://localhost:3000/blog');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take screenshot for debugging
  await page.screenshot({ path: 'stories-page-debug.png', fullPage: true });

  // Check for the header
  const header = page.locator('h1:has-text("FIELD STORIES")');
  await expect(header).toBeVisible();

  // Check for expedition reports section
  const expeditionReports = page.locator('h2:has-text("EXPEDITION REPORTS")');
  await expect(expeditionReports).toBeVisible();

  // Check if there's an empty state or content
  const emptyState = page.locator('h3:has-text("Stories Coming Soon")');
  const postContent = page.locator('[data-testid="post-card"]');

  // Log what we find
  const hasEmptyState = await emptyState.isVisible();
  const hasPostContent = await postContent.count() > 0;

  console.log('Empty state visible:', hasEmptyState);
  console.log('Post content count:', await postContent.count());

  // Check the page content
  const pageContent = await page.content();
  console.log('Page contains "Not Yet":', pageContent.includes('Not Yet'));
  console.log('Page contains "Journey From Illness":', pageContent.includes('Journey From Illness'));

  // Check if the RedBullBlogGrid component is working
  const blogGrid = page.locator('.bg-black.text-white');
  await expect(blogGrid).toBeVisible();

  // Check for any JavaScript errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error:', msg.text());
    }
  });
});