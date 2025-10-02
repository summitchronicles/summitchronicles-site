const { chromium } = require('playwright');

async function testExpeditionsPage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  console.log('🧪 Starting comprehensive UI/UX testing...\n');

  // Test different viewport sizes
  const viewports = [
    { name: 'Mobile', width: 375, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Large Desktop', width: 1920, height: 1080 }
  ];

  for (const viewport of viewports) {
    console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);

    const page = await context.newPage();
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    try {
      // Navigate to expeditions page
      await page.goto('http://localhost:3000/expeditions');
      await page.waitForTimeout(2000);

      // Test 1: Hero Section
      console.log('  ✅ Testing hero section...');
      const heroTitle = await page.locator('h1').first();
      const heroVisible = await heroTitle.isVisible();
      if (!heroVisible) {
        console.log('  ❌ Hero title not visible');
      }

      // Test 2: Timeline visibility
      console.log('  ✅ Testing timeline...');
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.waitForTimeout(1000);

      const timelineLine = await page.locator('[class*="bg-gradient-to-b"]').first();
      const timelineVisible = await timelineLine.isVisible();
      if (!timelineVisible) {
        console.log('  ❌ Timeline line not visible');
      }

      // Test 3: Card layout and spacing
      console.log('  ✅ Testing card layout...');
      const cards = await page.locator('[class*="md:ml-32"]').all();
      console.log(`    📊 Found ${cards.length} expedition cards`);

      for (let i = 0; i < Math.min(cards.length, 3); i++) {
        const card = cards[i];
        const cardBounds = await card.boundingBox();
        if (cardBounds) {
          console.log(`    Card ${i + 1}: ${cardBounds.width}x${cardBounds.height}`);

          // Check if card is too narrow
          if (cardBounds.width < 300) {
            console.log(`    ⚠️  Card ${i + 1} too narrow: ${cardBounds.width}px`);
          }
        }
      }

      // Test 4: Typography readability
      console.log('  ✅ Testing typography...');
      const mountainNames = await page.locator('h3[class*="text-3xl"]').all();
      for (let i = 0; i < Math.min(mountainNames.length, 2); i++) {
        const fontSize = await mountainNames[i].evaluate(el => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.fontSize);
        });
        console.log(`    Mountain name ${i + 1} font size: ${fontSize}px`);

        if (fontSize < 16) {
          console.log(`    ⚠️  Mountain name ${i + 1} too small: ${fontSize}px`);
        }
      }

      // Test 5: Image loading and sizing
      console.log('  ✅ Testing images...');
      const images = await page.locator('img').all();
      let loadedImages = 0;
      for (const img of images.slice(0, 3)) {
        const isLoaded = await img.evaluate(img => img.complete && img.naturalWidth > 0);
        if (isLoaded) loadedImages++;
      }
      console.log(`    📸 ${loadedImages}/${Math.min(images.length, 3)} images loaded`);

      // Test 6: Interactive elements
      console.log('  ✅ Testing interactions...');
      if (cards.length > 0) {
        const firstCard = cards[0];

        // Test hover effect
        await firstCard.hover();
        await page.waitForTimeout(500);

        // Test click expansion
        await firstCard.click();
        await page.waitForTimeout(1000);

        const expandedContent = await page.locator('[class*="border-t border-gray-700"]').first();
        const isExpanded = await expandedContent.isVisible();
        console.log(`    🎯 Card expansion: ${isExpanded ? 'Working' : 'Not working'}`);

        // Close expanded content
        await firstCard.click();
        await page.waitForTimeout(500);
      }

      // Test 7: Scroll behavior
      console.log('  ✅ Testing scroll behavior...');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      // Take screenshot for manual review
      await page.screenshot({
        path: `expeditions-test-${viewport.name.toLowerCase()}.png`,
        fullPage: true
      });
      console.log(`    📸 Screenshot saved: expeditions-test-${viewport.name.toLowerCase()}.png`);

      await page.close();

    } catch (error) {
      console.log(`  ❌ Error testing ${viewport.name}: ${error.message}`);
      await page.close();
    }

    console.log('');
  }

  // Detailed Desktop Analysis
  console.log('🔍 Detailed Desktop Analysis...');
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/expeditions');
  await page.waitForTimeout(2000);

  // Scroll to timeline
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);

  // Analyze card alignment
  console.log('📐 Checking card alignment...');
  const cardContainers = await page.locator('[class*="md:ml-32"]').all();

  for (let i = 0; i < Math.min(cardContainers.length, 3); i++) {
    const container = cardContainers[i];
    const bounds = await container.boundingBox();
    if (bounds) {
      console.log(`Card ${i + 1}: x=${bounds.x}, y=${bounds.y}, width=${bounds.width}`);
    }
  }

  // Check timeline node positions
  console.log('🎯 Checking timeline nodes...');
  const timelineNodes = await page.locator('[class*="hidden md:block absolute left-10"]').all();

  for (let i = 0; i < Math.min(timelineNodes.length, 3); i++) {
    const node = timelineNodes[i];
    const bounds = await node.boundingBox();
    if (bounds) {
      console.log(`Node ${i + 1}: x=${bounds.x}, y=${bounds.y}`);
    }
  }

  // Check year label positions
  console.log('📅 Checking year labels...');
  const yearLabels = await page.locator('[class*="md:absolute md:left-28"]').all();

  for (let i = 0; i < Math.min(yearLabels.length, 3); i++) {
    const label = yearLabels[i];
    const bounds = await label.boundingBox();
    if (bounds) {
      const text = await label.textContent();
      console.log(`Year ${text}: x=${bounds.x}, y=${bounds.y}`);
    }
  }

  // Check image aspect ratios
  console.log('🖼️  Checking image ratios...');
  const expeditionImages = await page.locator('[alt*="expedition"]').all();

  for (let i = 0; i < Math.min(expeditionImages.length, 3); i++) {
    const img = expeditionImages[i];
    const bounds = await img.boundingBox();
    if (bounds) {
      const ratio = bounds.width / bounds.height;
      console.log(`Image ${i + 1}: ${bounds.width}x${bounds.height} (ratio: ${ratio.toFixed(2)})`);

      if (ratio < 1.0 || ratio > 2.5) {
        console.log(`  ⚠️  Unusual aspect ratio: ${ratio.toFixed(2)}`);
      }
    }
  }

  // Check text overflow
  console.log('📝 Checking text overflow...');
  const storyTexts = await page.locator('p[class*="text-gray-200"]').all();

  for (let i = 0; i < Math.min(storyTexts.length, 2); i++) {
    const text = storyTexts[i];
    const bounds = await text.boundingBox();
    const content = await text.textContent();

    if (bounds && content) {
      const isOverflowing = await text.evaluate(el => {
        return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
      });

      console.log(`Story ${i + 1}: ${content.length} chars, overflow: ${isOverflowing}`);

      if (isOverflowing) {
        console.log(`  ⚠️  Text overflow detected`);
      }
    }
  }

  await page.close();
  await browser.close();

  console.log('\n✅ Comprehensive testing complete!');
  console.log('📁 Check the generated screenshots for visual review.');
}

testExpeditionsPage().catch(console.error);