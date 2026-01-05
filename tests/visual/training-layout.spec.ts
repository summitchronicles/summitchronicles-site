import { test, expect } from '@playwright/test';

test.describe('Training Page Layout Consistency', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/training');
    // Scroll to bottom to load components
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000); // Allow animations to settle
  });

  const VIEWPORTS = [
    { name: 'Desktop Large', width: 1920, height: 1080 },
    { name: 'Desktop Standard', width: 1440, height: 900 },
    { name: 'Tablet', width: 834, height: 1194 },
    { name: 'Mobile', width: 390, height: 844 },
  ];

  for (const viewport of VIEWPORTS) {
    test(`should render correctly on ${viewport.name}`, async ({ page, browserName }) => {
      // Skip mobile-safari on desktop/tablet viewports >= 834px (webkit has different grid rendering)
      if (browserName === 'webkit' && viewport.width >= 834) {
        test.skip();
      }

      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500); // Wait for resize adjustment

      const missionLog = page.getByTestId('mission-log-container');
      const roadmap = page.getByTestId('roadmap-container');
      const joinMission = page.getByTestId('join-mission-container');

      // 1. Visibility Check
      await expect(missionLog).toBeVisible();
      await expect(roadmap).toBeVisible();
      await expect(joinMission).toBeVisible();

      // 2. Layout & Dimensions Check
      const logBox = await missionLog.boundingBox();
      const roadmapBox = await roadmap.boundingBox();

      if (!logBox || !roadmapBox) throw new Error('Elements not found');

      if (viewport.width >= 640) {
        // DESKTOP/TABLET: Side-by-side with flexible heights (sm breakpoint and above)
        console.log(`${viewport.name}: Checking Desktop/Tablet Layout (Side-by-side)`);

        // Equal Width (approximate due to gap/rounding)
        expect(Math.abs(logBox.width - roadmapBox.width)).toBeLessThan(20);

        // Side-by-side alignment (Y positions should match)
        expect(Math.abs(logBox.y - roadmapBox.y)).toBeLessThan(20);

        // Verify minimum height is respected (at least 500px)
        expect(logBox.height).toBeGreaterThanOrEqual(500);
        expect(roadmapBox.height).toBeGreaterThanOrEqual(500);
      } else {
        // MOBILE: Stacked
        console.log(`${viewport.name}: Checking Mobile Layout (Stacked)`);

        // Stacked vertically: Log above Roadmap
        expect(roadmapBox.y).toBeGreaterThan(logBox.y + logBox.height);

        // Full width fitting (should be close to screen width minus padding)
        expect(Math.abs(logBox.width - roadmapBox.width)).toBeLessThan(20);

        // Verify minimum height is respected (at least 500px)
        expect(logBox.height).toBeGreaterThanOrEqual(500);
        expect(roadmapBox.height).toBeGreaterThanOrEqual(500);
      }
    });
  }
});
