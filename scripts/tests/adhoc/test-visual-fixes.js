const { chromium } = require('playwright');

async function testVisualFixes() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  console.log('🔍 Testing Visual Fixes for Expeditions Page...\n');

  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  try {
    // Navigate to expeditions page
    await page.goto('http://localhost:3000/expeditions');
    await page.waitForTimeout(3000);

    // Scroll to timeline
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(2000);

    console.log('📅 Testing Year Label Visibility...');

    // Test year labels specifically
    const yearLabels = await page.locator('[class*="text-4xl"]').all();
    console.log(`Found ${yearLabels.length} potential year labels`);

    for (let i = 0; i < Math.min(yearLabels.length, 5); i++) {
      const label = yearLabels[i];
      const text = await label.textContent();
      const isVisible = await label.isVisible();
      const bounds = await label.boundingBox();

      if (text && text.match(/^\d{4}$/)) { // Check if it's a year
        console.log(`Year ${text}: Visible=${isVisible}, Position=${bounds ? `${bounds.x},${bounds.y}` : 'none'}`);

        if (!isVisible) {
          console.log(`❌ Year ${text} is not visible!`);
        } else if (!bounds) {
          console.log(`❌ Year ${text} has no bounds!`);
        } else {
          console.log(`✅ Year ${text} is properly visible`);
        }
      }
    }

    console.log('\n🖼️  Testing Image Layout...');

    // Test image containers
    const imageContainers = await page.locator('[class*="md:col-span-2"]').all();
    console.log(`Found ${imageContainers.length} image containers`);

    for (let i = 0; i < Math.min(imageContainers.length, 3); i++) {
      const container = imageContainers[i];
      const bounds = await container.boundingBox();

      if (bounds) {
        console.log(`Image Container ${i + 1}: ${bounds.width}x${bounds.height}`);

        // Check for empty space (height too large with no content)
        if (bounds.height < 300) {
          console.log(`⚠️  Container ${i + 1} too short: ${bounds.height}px`);
        } else if (bounds.height > 600) {
          console.log(`⚠️  Container ${i + 1} too tall: ${bounds.height}px`);
        } else {
          console.log(`✅ Container ${i + 1} height is good: ${bounds.height}px`);
        }

        // Check for proper image fill
        const images = await container.locator('img').all();
        for (const img of images) {
          const imgBounds = await img.boundingBox();
          if (imgBounds) {
            const fillRatio = (imgBounds.width * imgBounds.height) / (bounds.width * bounds.height);
            console.log(`  Image fill ratio: ${(fillRatio * 100).toFixed(1)}%`);

            if (fillRatio < 0.8) {
              console.log(`  ❌ Image not filling container properly: ${(fillRatio * 100).toFixed(1)}%`);
            } else {
              console.log(`  ✅ Image fills container well: ${(fillRatio * 100).toFixed(1)}%`);
            }
          }
        }
      }
    }

    console.log('\n🎯 Testing Card Structure...');

    // Test card content layout
    const cards = await page.locator('[class*="md:ml-32"]').all();
    console.log(`Found ${cards.length} expedition cards`);

    for (let i = 0; i < Math.min(cards.length, 3); i++) {
      const card = cards[i];
      const bounds = await card.boundingBox();

      if (bounds) {
        console.log(`Card ${i + 1}: ${bounds.width}x${bounds.height}`);

        // Check for consistent card heights
        if (bounds.height < 400) {
          console.log(`  ⚠️  Card ${i + 1} too short: ${bounds.height}px`);
        } else if (bounds.height > 800) {
          console.log(`  ⚠️  Card ${i + 1} too tall: ${bounds.height}px`);
        } else {
          console.log(`  ✅ Card ${i + 1} height is appropriate: ${bounds.height}px`);
        }
      }
    }

    console.log('\n📸 Taking detailed screenshots...');

    // Take focused screenshot of first card
    if (cards.length > 0) {
      const firstCard = cards[0];
      await firstCard.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      await firstCard.screenshot({
        path: 'first-card-detailed.png'
      });
      console.log('✅ First card screenshot saved: first-card-detailed.png');
    }

    // Take full page screenshot
    await page.screenshot({
      path: 'expeditions-visual-test.png',
      fullPage: true
    });
    console.log('✅ Full page screenshot saved: expeditions-visual-test.png');

    console.log('\n🔬 Testing Specific Visual Elements...');

    // Test year label contrast and readability
    const yearElements = await page.locator('div:has-text("2014"), div:has-text("2022"), div:has-text("2023")').all();
    console.log(`Found ${yearElements.length} year elements`);

    for (const yearEl of yearElements) {
      const text = await yearEl.textContent();
      const styles = await yearEl.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          fontSize: computed.fontSize,
          zIndex: computed.zIndex
        };
      });

      console.log(`Year "${text}": Background=${styles.backgroundColor}, Color=${styles.color}, Size=${styles.fontSize}, Z-Index=${styles.zIndex}`);
    }

    // Test for empty spaces in image areas
    console.log('\n🕳️  Testing for Empty Spaces...');

    const blackAreas = await page.locator('[style*="background-color: black"], [class*="bg-black"]').all();
    console.log(`Found ${blackAreas.length} potentially problematic black areas`);

    for (let i = 0; i < Math.min(blackAreas.length, 5); i++) {
      const area = blackAreas[i];
      const bounds = await area.boundingBox();
      if (bounds && bounds.width > 100 && bounds.height > 100) {
        console.log(`Large black area ${i + 1}: ${bounds.width}x${bounds.height}`);

        if (bounds.height > 200) {
          console.log(`  ⚠️  Potentially empty space: ${bounds.width}x${bounds.height}`);
        }
      }
    }

  } catch (error) {
    console.log(`❌ Error during testing: ${error.message}`);
  }

  await page.close();
  await browser.close();

  console.log('\n✅ Visual testing complete!');
  console.log('📁 Check the generated screenshots for manual review.');
}

testVisualFixes().catch(console.error);