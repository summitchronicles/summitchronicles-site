import { test, expect } from '@playwright/test';

test('Upload Week 41 training plan and verify API response', async ({ page }) => {
  // Navigate to upload page
  await page.goto('http://localhost:3000/training/upload', { waitUntil: 'networkidle' });
  
  // Verify page loaded
  await expect(page).toHaveTitle(/Journey to the Summit/);
  console.log('✓ Upload page loaded');
  
  // Set input file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('/Users/sunith/Downloads/Week_41_Training_Plan_SummitChronicles.xlsx');
  console.log('✓ File selected');
  
  // Click upload button
  const uploadButton = page.locator('button:has-text("Upload")');
  await uploadButton.click();
  console.log('✓ Upload button clicked');
  
  // Wait for network response
  await page.waitForTimeout(3000);
  
  // Check API response
  const response = await page.request.get('http://localhost:3000/api/training/workouts');
  const data = await response.json();
  console.log('Week number returned:', data.currentWeek?.week);
  console.log('Workouts:', Object.keys(data.currentWeek?.workouts || {}));
  
  // Verify Week 41 data
  if (data.currentWeek?.week === 41) {
    console.log('✓ Week 41 data correctly loaded!');
    expect(data.currentWeek.week).toBe(41);
  } else {
    console.log('✗ Expected Week 41, got Week', data.currentWeek?.week);
    expect(data.currentWeek.week).toBe(41);
  }
});
