import { expect, test } from '@playwright/test';

test.describe('Training Summary', () => {
  test('training page loads without injected hero summary cards', async ({ page }) => {
    const summaryResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/training/summary') &&
        response.request().method() === 'GET'
    );

    await page.goto('/training');

    const response = await summaryResponse;
    expect(response.ok()).toBeTruthy();

    await expect(
      page.getByRole('heading', { name: 'Mission Log' })
    ).toBeVisible();
    await expect(page.getByText('Active Plan')).toHaveCount(0);
    await expect(page.getByText('Next Session')).toHaveCount(0);
    await expect(page.getByText('Sync Status')).toHaveCount(0);
  });
});
