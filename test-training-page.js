const { chromium } = require('playwright');

async function testTrainingPage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  console.log('📋 Testing Training Page Content Accuracy...\n');

  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  try {
    await page.goto('http://localhost:3000/training');
    await page.waitForTimeout(3000);

    console.log('📅 Checking Training Phase Timeline...');

    // Check training phases
    const phaseElements = await page.locator('[class*="border border-gray-800"]').all();
    console.log(`Found ${phaseElements.length} training phases`);

    for (let i = 0; i < phaseElements.length; i++) {
      const phase = phaseElements[i];
      const phaseText = await phase.textContent();

      if (phaseText) {
        console.log(`\nPhase ${i + 1}:`);

        // Extract key information
        if (phaseText.includes('Base Building')) {
          const hasCorrectYear = phaseText.includes('2022');
          console.log(`  Base Building: ${hasCorrectYear ? '✅' : '❌'} Year 2022 ${hasCorrectYear ? 'found' : 'missing'}`);
        }

        if (phaseText.includes('Kilimanjaro')) {
          const hasCorrectDates = phaseText.includes('2022');
          console.log(`  Kilimanjaro Prep: ${hasCorrectDates ? '✅' : '❌'} 2022 dates ${hasCorrectDates ? 'found' : 'missing'}`);
        }

        if (phaseText.includes('Technical Mountains')) {
          const hasCorrectRange = phaseText.includes('2022') && phaseText.includes('2024');
          console.log(`  Technical Mountains: ${hasCorrectRange ? '✅' : '❌'} 2022-2024 range ${hasCorrectRange ? 'found' : 'missing'}`);
        }

        if (phaseText.includes('Everest Specific')) {
          const isCurrentPhase = phaseText.includes('IN PROGRESS') || phaseText.includes('CURRENT');
          const hasCorrectStart = phaseText.includes('2024');
          console.log(`  Everest Specific: ${isCurrentPhase ? '✅' : '❌'} Current status ${isCurrentPhase ? 'correct' : 'incorrect'}`);
          console.log(`  Everest Specific: ${hasCorrectStart ? '✅' : '❌'} 2024 start ${hasCorrectStart ? 'found' : 'missing'}`);
        }
      }
    }

    console.log('\n📊 Checking Current Stats...');

    // Check current statistics
    const statElements = await page.locator('[class*="text-3xl font-light"]').all();
    console.log(`Found ${statElements.length} statistics`);

    for (const stat of statElements) {
      const text = await stat.textContent();
      if (text) {
        console.log(`  Stat: "${text}"`);

        if (text.includes('4/7')) {
          console.log(`    ✅ Seven Summits progress correctly shows 4/7`);
        }
        if (text.includes('11')) {
          console.log(`    ✅ Training years correctly shows 11 (since 2014)`);
        }
      }
    }

    console.log('\n📖 Checking Content Accuracy...');

    // Check for key story elements
    const pageContent = await page.textContent('body');

    const keyElements = [
      { text: 'tuberculosis', description: 'TB recovery story' },
      { text: 'Kilimanjaro (2022)', description: 'Correct Kilimanjaro year' },
      { text: 'Aconcagua (2023)', description: 'Correct Aconcagua year' },
      { text: 'Elbrus (2023)', description: 'Correct Elbrus year' },
      { text: 'Denali (2024)', description: 'Correct Denali year' },
      { text: 'four of the Seven Summits', description: 'Correct completion count' }
    ];

    keyElements.forEach(element => {
      const found = pageContent.toLowerCase().includes(element.text.toLowerCase());
      console.log(`  ${found ? '✅' : '❌'} ${element.description}: ${found ? 'Found' : 'Missing'}`);
    });

    console.log('\n📸 Taking screenshots for verification...');

    // Scroll to training phases section
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'training-phases-updated.png',
      fullPage: false
    });
    console.log('✅ Training phases screenshot saved: training-phases-updated.png');

    // Take full page screenshot
    await page.screenshot({
      path: 'training-page-corrected.png',
      fullPage: true
    });
    console.log('✅ Full page screenshot saved: training-page-corrected.png');

  } catch (error) {
    console.log(`❌ Error during testing: ${error.message}`);
  }

  await page.close();
  await browser.close();

  console.log('\n✅ Training page testing complete!');
}

testTrainingPage().catch(console.error);