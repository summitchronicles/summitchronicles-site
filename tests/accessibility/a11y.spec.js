const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {
  const pages = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Blog', url: '/blog' },
    { name: 'Journey', url: '/journey' },
    { name: 'Training', url: '/training' }
  ];

  for (const pageInfo of pages) {
    test.describe(`${pageInfo.name} Page Accessibility`, () => {
      
      test(`should have proper heading hierarchy - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => 
          elements.map(el => ({
            level: parseInt(el.tagName[1]),
            text: el.textContent.trim()
          }))
        );
        
        // Should have at least one h1
        const h1s = headings.filter(h => h.level === 1);
        expect(h1s.length).toBeGreaterThanOrEqual(1);
        expect(h1s.length).toBeLessThanOrEqual(1); // Should have exactly one h1
        
        // Check heading hierarchy
        for (let i = 1; i < headings.length; i++) {
          const currentLevel = headings[i].level;
          const prevLevel = headings[i - 1].level;
          
          // Heading levels should not skip (e.g., h1 -> h3)
          if (currentLevel > prevLevel) {
            expect(currentLevel - prevLevel).toBeLessThanOrEqual(1);
          }
        }
        
        console.log(`${pageInfo.name} headings:`, headings.map(h => `h${h.level}: ${h.text}`));
      });

      test(`should have alt text for all images - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const images = await page.$$eval('img', imgs => 
          imgs.map(img => ({
            src: img.src,
            alt: img.alt,
            hasAlt: img.hasAttribute('alt')
          }))
        );
        
        // Filter out decorative images (empty alt is ok for decorative images)
        const contentImages = images.filter(img => !img.alt === '');
        
        contentImages.forEach(img => {
          expect(img.hasAlt).toBe(true);
          if (img.alt !== '') {
            expect(img.alt.length).toBeGreaterThan(0);
            expect(img.alt.length).toBeLessThan(125); // Reasonable alt text length
          }
        });
        
        console.log(`${pageInfo.name} images with alt text: ${contentImages.length}/${images.length}`);
      });

      test(`should have accessible form elements - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const formElements = await page.$$eval('input, textarea, select', elements =>
          elements.map(el => ({
            type: el.type || el.tagName.toLowerCase(),
            hasLabel: el.hasAttribute('aria-label') || 
                     el.hasAttribute('aria-labelledby') || 
                     !!document.querySelector(`label[for="${el.id}"]`),
            id: el.id,
            name: el.name
          }))
        );
        
        formElements.forEach(element => {
          expect(element.hasLabel).toBe(true);
        });
        
        if (formElements.length > 0) {
          console.log(`${pageInfo.name} form elements: ${formElements.length} all have labels`);
        }
      });

      test(`should have proper color contrast - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        // Inject axe-core for color contrast testing
        await page.addScriptTag({
          url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
        });
        
        const colorContrastResults = await page.evaluate(() => {
          return axe.run({
            rules: {
              'color-contrast': { enabled: true }
            }
          }).then(results => results.violations);
        });
        
        expect(colorContrastResults.length).toBe(0);
        
        if (colorContrastResults.length > 0) {
          console.log(`${pageInfo.name} color contrast violations:`, colorContrastResults);
        }
      });

      test(`should be keyboard navigable - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        // Get all focusable elements
        const focusableElements = await page.$$eval(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          elements => elements.length
        );
        
        if (focusableElements === 0) {
          test.skip('No focusable elements found');
        }
        
        // Test tab navigation
        let tabCount = 0;
        const maxTabs = Math.min(focusableElements, 20); // Limit to prevent infinite loops
        
        for (let i = 0; i < maxTabs; i++) {
          await page.keyboard.press('Tab');
          tabCount++;
          
          const focusedElement = await page.evaluate(() => {
            const focused = document.activeElement;
            return {
              tagName: focused.tagName,
              type: focused.type || null,
              text: focused.textContent?.trim().substring(0, 50),
              hasVisibleFocus: getComputedStyle(focused).outline !== 'none'
            };
          });
          
          // Element should be focusable and have visible focus
          expect(focusedElement.tagName).toBeTruthy();
        }
        
        console.log(`${pageInfo.name} keyboard navigation: ${tabCount} focusable elements`);
      });

      test(`should have ARIA landmarks - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const landmarks = await page.$$eval('[role], main, nav, header, footer, aside, section', elements =>
          elements.map(el => ({
            role: el.getAttribute('role') || el.tagName.toLowerCase(),
            hasLabel: el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')
          }))
        );
        
        // Should have at least main landmark
        const mainLandmarks = landmarks.filter(l => l.role === 'main');
        expect(mainLandmarks.length).toBeGreaterThanOrEqual(1);
        
        // Navigation landmarks should have labels if there are multiple
        const navLandmarks = landmarks.filter(l => l.role === 'navigation' || l.role === 'nav');
        if (navLandmarks.length > 1) {
          navLandmarks.forEach(nav => {
            expect(nav.hasLabel).toBe(true);
          });
        }
        
        console.log(`${pageInfo.name} landmarks:`, landmarks.map(l => l.role));
      });

      test(`should not have accessibility violations - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        // Inject axe-core
        await page.addScriptTag({
          url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
        });
        
        const accessibilityResults = await page.evaluate(() => {
          return axe.run().then(results => ({
            violations: results.violations,
            passes: results.passes.length,
            incomplete: results.incomplete.length
          }));
        });
        
        // Should have no violations
        expect(accessibilityResults.violations.length).toBe(0);
        
        if (accessibilityResults.violations.length > 0) {
          console.log(`${pageInfo.name} accessibility violations:`, 
            accessibilityResults.violations.map(v => ({
              id: v.id,
              description: v.description,
              nodes: v.nodes.length
            }))
          );
        }
        
        console.log(`${pageInfo.name} accessibility: ${accessibilityResults.passes} passes, ${accessibilityResults.incomplete} incomplete`);
      });

      test(`should support screen reader navigation - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        // Check for skip links
        const skipLinks = await page.$$eval('a[href^="#"]', links =>
          links.filter(link => 
            link.textContent.toLowerCase().includes('skip') ||
            link.textContent.toLowerCase().includes('jump')
          ).length
        );
        
        // Should have skip navigation link
        expect(skipLinks).toBeGreaterThanOrEqual(1);
        
        // Check for live regions
        const liveRegions = await page.$$eval('[aria-live], [role="status"], [role="alert"]', elements =>
          elements.length
        );
        
        console.log(`${pageInfo.name} skip links: ${skipLinks}, live regions: ${liveRegions}`);
      });

    });
  }

  test('Focus management', async ({ page }) => {
    await page.goto('/');
    
    // Test modal focus trap (if any modals exist)
    const modalTriggers = await page.$$('button[data-modal], [aria-haspopup="dialog"]');
    
    for (const trigger of modalTriggers) {
      await trigger.click();
      await page.waitForTimeout(500);
      
      // Check if focus is trapped in modal
      const modal = await page.$('[role="dialog"], .modal');
      if (modal) {
        // Tab through modal elements
        await page.keyboard.press('Tab');
        const focusedElement = await page.evaluate(() => document.activeElement);
        
        // Focus should stay within modal
        const isWithinModal = await modal.evaluate((modal, focused) => 
          modal.contains(focused), focusedElement
        );
        
        expect(isWithinModal).toBe(true);
        
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
  });

});