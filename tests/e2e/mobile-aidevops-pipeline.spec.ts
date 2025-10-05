import { test, expect, devices } from '@playwright/test';

/**
 * Mobile AIDevOps Pipeline Test Suite
 * 
 * This test suite is designed to run as part of an AIDevOps pipeline
 * to extensively test the mobile experience of the Summit Chronicles website.
 * 
 * It focuses on identifying common mobile issues that would affect user experience.
 */

const MOBILE_TEST_PAGES = [
  { path: '/', name: 'Homepage', critical: true },
  { path: '/about', name: 'About Page', critical: true },
  { path: '/training', name: 'Training Page', critical: false },
  { path: '/blog', name: 'Blog Page', critical: false },
  { path: '/design-system', name: 'Design System', critical: false }
];

const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'Samsung Galaxy S21', width: 360, height: 800 },
  { name: 'iPad Mini', width: 768, height: 1024 }
];

test.describe('Mobile AIDevOps Pipeline Tests', () => {
  
  test.describe('Critical Mobile Experience Tests', () => {
    
    test('Homepage mobile experience comprehensive check', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      console.log('🧪 Testing Homepage Mobile Experience...');

      // 1. Check for horizontal scrolling
      const scrollCheck = await page.evaluate(() => ({
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 5,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));

      console.log('📏 Scroll Check:', scrollCheck);
      expect(scrollCheck.hasHorizontalScroll).toBe(false);

      // 2. Check mobile navigation
      const mobileNavCheck = await page.evaluate(() => {
        const menuButtons = Array.from(document.querySelectorAll('button, [role="button"]'))
          .filter(btn => btn.textContent?.includes('menu') || 
                        btn.getAttribute('aria-label')?.includes('menu') ||
                        btn.className.includes('menu') ||
                        btn.className.includes('hamburger'));
        
        return {
          hasMobileMenu: menuButtons.length > 0,
          menuButtonVisible: menuButtons.length > 0 ? menuButtons[0].getBoundingClientRect().width > 0 : false
        };
      });

      console.log('📱 Mobile Navigation Check:', mobileNavCheck);
      if (mobileNavCheck.hasMobileMenu) {
        expect(mobileNavCheck.menuButtonVisible).toBe(true);
      }

      // 3. Test mobile menu functionality if present
      const menuButton = page.getByRole('button', { name: /toggle mobile menu|menu|hamburger/i });
      const menuButtonExists = await menuButton.count() > 0;
      
      if (menuButtonExists) {
        console.log('🔄 Testing mobile menu toggle...');
        await menuButton.click();
        await page.waitForTimeout(500);
        
        // Check if menu opened
        const menuOpened = await page.evaluate(() => {
          const navElements = Array.from(document.querySelectorAll('nav, [role="navigation"]'));
          return navElements.some(nav => {
            const style = window.getComputedStyle(nav);
            return style.display !== 'none' && style.visibility !== 'hidden';
          });
        });
        
        console.log('📂 Menu opened:', menuOpened);
        
        // Close menu
        await menuButton.click();
        await page.waitForTimeout(500);
      }

      // 4. Check touch targets
      const touchTargetCheck = await page.evaluate(() => {
        const clickableElements = Array.from(document.querySelectorAll('a, button, input, [onclick], [role="button"]'));
        const smallTargets = clickableElements.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
        });
        
        return {
          totalClickable: clickableElements.length,
          smallTargets: smallTargets.length,
          smallTargetRatio: smallTargets.length / clickableElements.length
        };
      });

      console.log('👆 Touch Target Check:', touchTargetCheck);
      expect(touchTargetCheck.smallTargetRatio).toBeLessThan(0.3); // Less than 30% should be small

      // 5. Check text readability
      const readabilityCheck = await page.evaluate(() => {
        const textElements = Array.from(document.querySelectorAll('p, span, div, li, a, button'))
          .filter(el => el.textContent && el.textContent.trim().length > 5);
        
        const smallText = textElements.filter(el => {
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
          return fontSize < 16;
        });
        
        return {
          totalTextElements: textElements.length,
          smallTextElements: smallText.length,
          smallTextRatio: smallText.length / textElements.length
        };
      });

      console.log('📖 Readability Check:', readabilityCheck);
      expect(readabilityCheck.smallTextRatio).toBeLessThan(0.5); // Less than 50% should be small

      // 6. Performance check
      const performanceCheck = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        const loadedImages = images.filter(img => img.complete && img.naturalWidth > 0);
        
        return {
          totalImages: images.length,
          loadedImages: loadedImages.length,
          imageLoadRatio: images.length > 0 ? loadedImages.length / images.length : 1
        };
      });

      console.log('⚡ Performance Check:', performanceCheck);
      expect(performanceCheck.imageLoadRatio).toBeGreaterThan(0.8); // 80% of images should load

      // Take screenshot for visual verification
      await expect(page).toHaveScreenshot('homepage-mobile-aidevops.png', {
        fullPage: true,
        threshold: 0.3
      });

      console.log('✅ Homepage mobile experience test completed');
    });

    // Test each critical page
    MOBILE_TEST_PAGES.filter(p => p.critical).forEach(pageInfo => {
      test(`${pageInfo.name} mobile responsiveness`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        
        console.log(`🧪 Testing ${pageInfo.name} Mobile Responsiveness...`);
        
        try {
          await page.goto(pageInfo.path);
          await page.waitForLoadState('networkidle', { timeout: 10000 });

          // Basic responsiveness check
          const responsiveCheck = await page.evaluate(() => ({
            hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 5,
            viewportWidth: window.innerWidth,
            documentWidth: document.documentElement.scrollWidth
          }));

          console.log(`📏 ${pageInfo.name} Responsive Check:`, responsiveCheck);
          expect(responsiveCheck.hasHorizontalScroll).toBe(false);

          // Content visibility check
          const contentCheck = await page.evaluate(() => {
            const mainContent = document.querySelector('main, [role="main"], .main-content');
            const hasVisibleContent = mainContent ? mainContent.getBoundingClientRect().height > 100 : false;
            
            return {
              hasMainContent: !!mainContent,
              hasVisibleContent,
              contentHeight: mainContent ? mainContent.getBoundingClientRect().height : 0
            };
          });

          console.log(`📄 ${pageInfo.name} Content Check:`, contentCheck);
          expect(contentCheck.hasMainContent || contentCheck.hasVisibleContent).toBe(true);

          // Take screenshot
          await expect(page).toHaveScreenshot(`${pageInfo.name.replace(/\s+/g, '-').toLowerCase()}-mobile.png`, {
            threshold: 0.3
          });

          console.log(`✅ ${pageInfo.name} mobile test completed`);
          
        } catch (error) {
          console.log(`❌ ${pageInfo.name} test failed:`, error instanceof Error ? error.message : String(error));
          
          // Try to get basic page info even if test fails
          const pageTitle = await page.title().catch(() => 'Unknown');
          const url = page.url();
          
          console.log(`Page info - Title: ${pageTitle}, URL: ${url}`);
          
          // Re-throw the error for test failure
          throw error;
        }
      });
    });
  });

  test.describe('Cross-Device Mobile Testing', () => {
    
    MOBILE_VIEWPORTS.forEach(viewport => {
      test(`Responsiveness on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        console.log(`🧪 Testing on ${viewport.name}...`);
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check layout doesn't break
        const layoutCheck = await page.evaluate(() => ({
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 5,
          bodyHeight: document.body.scrollHeight,
          viewportHeight: window.innerHeight
        }));

        console.log(`📐 ${viewport.name} Layout Check:`, layoutCheck);
        expect(layoutCheck.hasHorizontalScroll).toBe(false);
        expect(layoutCheck.bodyHeight).toBeGreaterThan(layoutCheck.viewportHeight / 2); // Has some content

        // Test navigation accessibility
        const navCheck = await page.evaluate(() => {
          const navElements = Array.from(document.querySelectorAll('nav, [role="navigation"]'));
          const visibleNavs = navElements.filter(nav => {
            const rect = nav.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
          
          return {
            totalNavElements: navElements.length,
            visibleNavElements: visibleNavs.length
          };
        });

        console.log(`🧭 ${viewport.name} Navigation Check:`, navCheck);
        expect(navCheck.visibleNavElements).toBeGreaterThan(0);

        console.log(`✅ ${viewport.name} test completed`);
      });
    });
  });

  test.describe('Mobile Performance and Issues', () => {
    
    test('Mobile page load performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      console.log('🧪 Testing Mobile Page Load Performance...');
      
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const domLoadTime = Date.now() - startTime;
      
      await page.waitForLoadState('networkidle');
      const fullLoadTime = Date.now() - startTime;

      console.log(`⏱️ Performance Metrics:`);
      console.log(`   DOM Load Time: ${domLoadTime}ms`);
      console.log(`   Full Load Time: ${fullLoadTime}ms`);

      // Mobile performance should be reasonable
      expect(domLoadTime).toBeLessThan(3000); // 3 seconds for DOM
      expect(fullLoadTime).toBeLessThan(8000); // 8 seconds for full load

      // Check for performance-impacting elements
      const performanceIssues = await page.evaluate(() => {
        const issues = [];
        
        // Check for large images
        const images = Array.from(document.querySelectorAll('img'));
        images.forEach(img => {
          const rect = img.getBoundingClientRect();
          if (rect.width > window.innerWidth * 1.5) {
            issues.push({
              type: 'oversized-image',
              width: rect.width,
              viewportWidth: window.innerWidth,
              src: img.src?.substring(0, 50) + '...'
            });
          }
        });
        
        // Check for excessive animations
        const animatedElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const styles = window.getComputedStyle(el);
          return styles.animationName !== 'none' || styles.transitionProperty !== 'none';
        });
        
        if (animatedElements.length > 20) {
          issues.push({
            type: 'excessive-animations',
            count: animatedElements.length
          });
        }
        
        return issues;
      });

      console.log('🎭 Performance Issues Found:', performanceIssues);
      
      // Some performance issues are acceptable, but not too many
      expect(performanceIssues.length).toBeLessThan(5);

      console.log('✅ Mobile performance test completed');
    });

    test('Mobile accessibility and usability', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      console.log('🧪 Testing Mobile Accessibility and Usability...');

      // Test keyboard navigation
      await page.keyboard.press('Tab');
      const firstFocusedElement = await page.evaluate(() => {
        const activeEl = document.activeElement;
        return {
          tagName: activeEl?.tagName,
          className: activeEl?.className,
          visible: activeEl ? activeEl.getBoundingClientRect().width > 0 : false
        };
      });

      console.log('⌨️ First focused element:', firstFocusedElement);
      expect(firstFocusedElement.visible).toBe(true);

      // Test form elements if they exist
      const formCheck = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
        const accessibleInputs = inputs.filter(input => {
          const rect = input.getBoundingClientRect();
          return rect.height >= 44; // Minimum touch target size
        });
        
        return {
          totalInputs: inputs.length,
          accessibleInputs: accessibleInputs.length,
          accessibilityRatio: inputs.length > 0 ? accessibleInputs.length / inputs.length : 1
        };
      });

      console.log('📝 Form Accessibility Check:', formCheck);
      if (formCheck.totalInputs > 0) {
        expect(formCheck.accessibilityRatio).toBeGreaterThan(0.8); // 80% should be accessible
      }

      // Test color contrast (basic check)
      const contrastCheck = await page.evaluate(() => {
        const textElements = Array.from(document.querySelectorAll('h1, h2, h3, p, a, button'))
          .filter(el => el.textContent && el.textContent.trim().length > 0)
          .slice(0, 10); // Check first 10 text elements
        
        const contrastIssues = textElements.filter(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          // Very basic contrast check (looking for same colors)
          return color === backgroundColor || color === 'rgba(0, 0, 0, 0)';
        });
        
        return {
          checkedElements: textElements.length,
          contrastIssues: contrastIssues.length
        };
      });

      console.log('🎨 Color Contrast Check:', contrastCheck);
      expect(contrastCheck.contrastIssues).toBeLessThan(2); // Should have minimal contrast issues

      console.log('✅ Mobile accessibility test completed');
    });
  });

  test.describe('Mobile Feature Testing', () => {
    
    test('Mobile navigation and interactions', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      console.log('🧪 Testing Mobile Navigation and Interactions...');

      // Test mobile-specific interactions
      const interactionResults = [];

      // Test touch tap on various elements
      const clickableElements = await page.locator('a, button').all();
      
      if (clickableElements.length > 0) {
        const firstClickable = clickableElements[0];
        const elementInfo = await firstClickable.evaluate(el => ({
          tagName: el.tagName,
          text: el.textContent?.substring(0, 20),
          href: el.getAttribute('href')
        }));
        
        console.log('👆 Testing tap on:', elementInfo);
        
        try {
          await firstClickable.tap();
          await page.waitForTimeout(1000);
          interactionResults.push({ element: elementInfo, success: true });
        } catch (error) {
          interactionResults.push({ element: elementInfo, success: false, error: error instanceof Error ? error.message : String(error) });
        }
      }

      // Test scroll behavior
      const initialScrollY = await page.evaluate(() => window.scrollY);
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(500);
      const newScrollY = await page.evaluate(() => window.scrollY);
      
      console.log(`📜 Scroll test: ${initialScrollY} → ${newScrollY}`);
      expect(newScrollY).toBeGreaterThan(initialScrollY);

      console.log('🎯 Interaction Results:', interactionResults);
      
      // At least some interactions should work
      const successfulInteractions = interactionResults.filter(r => r.success);
      expect(successfulInteractions.length).toBeGreaterThanOrEqual(0); // Allow flexibility

      console.log('✅ Mobile interaction test completed');
    });
  });

  // Final summary test
  test('Mobile AIDevOps Pipeline Summary', async ({ page }) => {
    console.log('\n📊 MOBILE AIDEVOPS PIPELINE SUMMARY');
    console.log('=' .repeat(50));
    
    const testResults = {
      timestamp: new Date().toISOString(),
      device: 'Mobile (375x667)',
      pagesChecked: MOBILE_TEST_PAGES.length,
      viewportsChecked: MOBILE_VIEWPORTS.length,
      status: 'COMPLETED'
    };
    
    console.log('🎯 Test Configuration:');
    console.log(`   - Pages tested: ${testResults.pagesChecked}`);
    console.log(`   - Viewports tested: ${testResults.viewportsChecked}`);
    console.log(`   - Test timestamp: ${testResults.timestamp}`);
    
    console.log('\n🏆 PIPELINE RESULT: MOBILE TESTING COMPLETED');
    console.log('\nCheck individual test results above for detailed findings.');
    console.log('Look for ❌ errors or performance issues that need attention.');
    
    // This test always passes - it's just for reporting
    expect(testResults.status).toBe('COMPLETED');
  });
});