const { chromium } = require('playwright');

async function testOverlapFixes() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  console.log('🔧 Testing Overlap and Spacing Fixes...\n');

  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  try {
    await page.goto('http://localhost:3000/expeditions');
    await page.waitForTimeout(3000);

    // Scroll to see expedition cards
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(2000);

    console.log('📏 Testing Element Positioning and Overlaps...');

    // Test year label positioning
    const yearLabels = await page.locator('[class*="bg-gradient-to-r from-yellow-400"]').all();
    console.log(`Found ${yearLabels.length} year labels`);

    for (let i = 0; i < Math.min(yearLabels.length, 3); i++) {
      const yearLabel = yearLabels[i];
      const yearBounds = await yearLabel.boundingBox();
      const yearText = await yearLabel.textContent();

      if (yearBounds) {
        console.log(`Year "${yearText}": Position (${yearBounds.x}, ${yearBounds.y}), Size ${yearBounds.width}x${yearBounds.height}`);

        // Find the corresponding Seven Summits badge
        const card = await yearLabel.locator('..').locator('..').locator('[class*="md:ml-32"]');
        const sevenSummitsBadges = await card.locator('[class*="SEVEN SUMMITS"]').all();

        for (const badge of sevenSummitsBadges) {
          const badgeBounds = await badge.boundingBox();
          if (badgeBounds) {
            console.log(`  Seven Summits badge: Position (${badgeBounds.x}, ${badgeBounds.y}), Size ${badgeBounds.width}x${badgeBounds.height}`);

            // Check for overlap
            const overlapX = !(yearBounds.x + yearBounds.width < badgeBounds.x || badgeBounds.x + badgeBounds.width < yearBounds.x);
            const overlapY = !(yearBounds.y + yearBounds.height < badgeBounds.y || badgeBounds.y + badgeBounds.height < yearBounds.y);
            const hasOverlap = overlapX && overlapY;

            if (hasOverlap) {
              console.log(`  ❌ Overlap detected between year "${yearText}" and Seven Summits badge!`);
            } else {
              console.log(`  ✅ No overlap between year "${yearText}" and Seven Summits badge`);
            }
          }
        }
      }
    }

    console.log('\n🏷️  Testing Badge Spacing Inside Images...');

    // Test badge spacing inside image containers
    const imageContainers = await page.locator('[class*="md:col-span-2 relative"]').all();
    console.log(`Found ${imageContainers.length} image containers`);

    for (let i = 0; i < Math.min(imageContainers.length, 3); i++) {
      const container = imageContainers[i];
      const containerBounds = await container.boundingBox();

      if (containerBounds) {
        console.log(`\nImage Container ${i + 1}: ${containerBounds.width}x${containerBounds.height}`);

        // Check status badges
        const statusBadges = await container.locator('[class*="absolute top-4 left-4"]').all();
        const sevenSummitsBadges = await container.locator('[class*="absolute top-16 left-4"]').all();
        const elevationBadges = await container.locator('[class*="absolute bottom-4 left-4"]').all();

        console.log(`  Status badges: ${statusBadges.length}`);
        console.log(`  Seven Summits badges: ${sevenSummitsBadges.length}`);
        console.log(`  Elevation badges: ${elevationBadges.length}`);

        // Check for proper spacing between badges
        for (const statusBadge of statusBadges) {
          const statusBounds = await statusBadge.boundingBox();
          if (statusBounds) {
            console.log(`    Status badge: Position (${statusBounds.x}, ${statusBounds.y})`);

            for (const sevenSummitsBadge of sevenSummitsBadges) {
              const summitsBounds = await sevenSummitsBadge.boundingBox();
              if (summitsBounds) {
                const verticalSpacing = summitsBounds.y - (statusBounds.y + statusBounds.height);
                console.log(`    Seven Summits badge: Position (${summitsBounds.x}, ${summitsBounds.y}), Spacing: ${verticalSpacing}px`);

                if (verticalSpacing < 8) {
                  console.log(`    ⚠️  Tight spacing between status and Seven Summits badges: ${verticalSpacing}px`);
                } else {
                  console.log(`    ✅ Good spacing between status and Seven Summits badges: ${verticalSpacing}px`);
                }
              }
            }
          }
        }

        // Check edge distances
        for (const badge of [...statusBadges, ...sevenSummitsBadges, ...elevationBadges]) {
          const badgeBounds = await badge.boundingBox();
          if (badgeBounds && containerBounds) {
            const leftMargin = badgeBounds.x - containerBounds.x;
            const topMargin = badgeBounds.y - containerBounds.y;
            const rightMargin = (containerBounds.x + containerBounds.width) - (badgeBounds.x + badgeBounds.width);
            const bottomMargin = (containerBounds.y + containerBounds.height) - (badgeBounds.y + badgeBounds.height);

            console.log(`    Badge margins: Left=${leftMargin}px, Top=${topMargin}px, Right=${rightMargin}px, Bottom=${bottomMargin}px`);

            if (leftMargin < 4 || topMargin < 4 || rightMargin < 4 || bottomMargin < 4) {
              console.log(`    ⚠️  Badge too close to container edge`);
            }
          }
        }
      }
    }

    console.log('\n📸 Taking updated screenshots...');

    // Take focused screenshots of first few cards
    for (let i = 0; i < Math.min(imageContainers.length, 2); i++) {
      const container = imageContainers[i];
      await container.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      await container.screenshot({
        path: `card-${i + 1}-overlap-test.png`
      });
      console.log(`✅ Card ${i + 1} screenshot saved: card-${i + 1}-overlap-test.png`);
    }

    // Take full timeline screenshot
    await page.screenshot({
      path: 'expeditions-overlap-fixed.png',
      fullPage: true
    });
    console.log('✅ Full page screenshot saved: expeditions-overlap-fixed.png');

  } catch (error) {
    console.log(`❌ Error during testing: ${error.message}`);
  }

  await page.close();
  await browser.close();

  console.log('\n✅ Overlap testing complete!');
}

testOverlapFixes().catch(console.error);