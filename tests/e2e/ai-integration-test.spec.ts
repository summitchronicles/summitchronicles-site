import { test, expect } from '@playwright/test';

test.describe('AI Integration Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('floating AI button should be visible and functional', async ({ page }) => {
    // Check if floating AI button exists
    const floatingButton = page.locator('button[aria-label="Ask Sunith - Expert Mountaineering AI"]');
    await expect(floatingButton).toBeVisible();

    // Check button styling and icon
    await expect(floatingButton).toHaveClass(/fixed bottom-6 right-6/);

    // Click to open modal
    await floatingButton.click();

    // Check modal opens with correct content
    await expect(page.locator('text=Ask Sunith')).toBeVisible();
    await expect(page.locator('text=Expert mountaineering guidance')).toBeVisible();

    // Check SmartSearch component is loaded
    await expect(page.locator('input[placeholder*="Ask Sunith about mountaineering"]')).toBeVisible();

    // Check mode buttons exist
    await expect(page.locator('button:has-text("Semantic Search")')).toBeVisible();
    await expect(page.locator('button:has-text("Ask Sunith")')).toBeVisible();

    // Close modal with X button
    await page.locator('button[aria-label="Close AI Assistant"]').click();
    await expect(page.locator('text=Ask Sunith')).not.toBeVisible();
  });

  test('training calendar should be visible on training/realtime page', async ({ page }) => {
    await page.goto('http://localhost:3000/training/realtime');

    // Wait for page to load
    await expect(page.locator('h1:has-text("Real-time Training Dashboard")')).toBeVisible();

    // Check training calendar section exists
    await expect(page.locator('h2:has-text("Weekly Training Calendar")')).toBeVisible();

    // Check calendar controls
    await expect(page.locator('button:has-text("Upload Excel")')).toBeVisible();
    await expect(page.locator('text=Week')).toBeVisible();

    // Check day headers
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (const day of days) {
      await expect(page.locator(`text=${day}`)).toBeVisible();
    }

    // Check sample training activities exist
    await expect(page.locator('text=Morning Hike')).toBeVisible();
    await expect(page.locator('text=Strength Training')).toBeVisible();
  });

  test('smart search component should have expert persona', async ({ page }) => {
    // Open floating AI modal
    await page.locator('button[aria-label="Ask Sunith - Expert Mountaineering AI"]').click();

    // Check placeholder text is personalized
    const searchInput = page.locator('input[placeholder*="Ask Sunith about mountaineering"]');
    await expect(searchInput).toBeVisible();

    // Check example queries are mountaineering-focused
    await expect(page.locator('text=How should I train for high altitude')).toBeVisible();
    await expect(page.locator('text=What are Sunith\'s preferred techniques')).toBeVisible();

    // Switch to Ask mode and verify button text
    await page.locator('button:has-text("Ask Sunith")').click();
    await expect(page.locator('button:has-text("Ask Sunith"):last-of-type')).toBeVisible();
  });

  test('training activities should be interactive', async ({ page }) => {
    await page.goto('http://localhost:3000/training/realtime');

    // Wait for training calendar to load
    await expect(page.locator('h2:has-text("Weekly Training Calendar")')).toBeVisible();

    // Find a training activity card and check it's clickable
    const activityCard = page.locator('.cursor-pointer').first();
    await expect(activityCard).toBeVisible();

    // Check activity has expected elements
    await expect(page.locator('[class*="duration"]')).toBeVisible(); // Time indication

    // Check progress indicators exist
    await expect(page.locator('text=Progress')).toBeVisible();
    await expect(page.locator('.bg-alpine-blue')).toBeVisible(); // Progress bar
  });

  test('excel upload functionality should be present', async ({ page }) => {
    await page.goto('http://localhost:3000/training/realtime');

    // Check upload button exists
    const uploadButton = page.locator('button:has-text("Upload Excel")');
    await expect(uploadButton).toBeVisible();

    // Check upload instructions
    await expect(page.locator('text=Excel Upload Format')).toBeVisible();
    await expect(page.locator('text=Week Number, Phase, Day')).toBeVisible();

    // Check supported types are listed
    await expect(page.locator('text=cardio, strength, technical, rest, expedition')).toBeVisible();
  });

  test('floating AI button should not interfere with page navigation', async ({ page }) => {
    // Check floating button is visible on home page
    await expect(page.locator('button[aria-label="Ask Sunith - Expert Mountaineering AI"]')).toBeVisible();

    // Navigate to different pages and ensure button persists
    await page.locator('nav a[href="/training"]').click();
    await expect(page.locator('button[aria-label="Ask Sunith - Expert Mountaineering AI"]')).toBeVisible();

    await page.locator('nav a[href="/blog"]').click();
    await expect(page.locator('button[aria-label="Ask Sunith - Expert Mountaineering AI"]')).toBeVisible();

    await page.locator('nav a[href="/about"]').click();
    await expect(page.locator('button[aria-label="Ask Sunith - Expert Mountaineering AI"]')).toBeVisible();
  });

  test('modal should close with escape key', async ({ page }) => {
    // Open modal
    await page.locator('button[aria-label="Ask Sunith - Expert Mountaineering AI"]').click();
    await expect(page.locator('text=Ask Sunith')).toBeVisible();

    // Press escape key
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(page.locator('text=Expert mountaineering guidance')).not.toBeVisible();
  });
});