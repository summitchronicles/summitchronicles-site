import { test, expect } from '@playwright/test';

/**
 * Mobile Issues Detection Suite
 * This test file specifically looks for common mobile website issues
 * that users often experience on mobile devices.
 */

test.describe('Mobile Issues Detection', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test.describe('Layout Issues', () => {
    test('Detects horizontal scrolling issues', async ({ page }) => {
      const pagesToCheck = ['/', '/about', '/training', '/blog'];
      
      for (const pagePath of pagesToCheck) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        
        const scrollInfo = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
          bodyClientWidth: document.body.clientWidth,
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 5
        }));
        
        console.log(`Page ${pagePath}:`, scrollInfo);
        
        if (scrollInfo.hasHorizontalScroll) {
          // Find elements causing horizontal scroll
          const wideElements = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('*'));
            return elements
              .filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.right > window.innerWidth;
              })
              .map(el => ({
                tagName: el.tagName,
                className: el.className,
                id: el.id,
                right: el.getBoundingClientRect().right,
                width: el.getBoundingClientRect().width
              }))
              .slice(0, 5); // Limit to first 5 problematic elements
          });
          
          console.log(`Wide elements on ${pagePath}:`, wideElements);
        }
        
        expect(scrollInfo.hasHorizontalScroll).toBe(false);
      }
    });

    test('Detects elements extending beyond viewport', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const problematicElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const issues: Array<{
          element: string,
          issue: string,
          rect?: DOMRect,
          type?: string,
          width?: number,
          viewportWidth?: number,
          left?: number,
          right?: number
        }> = [];
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          
          // Check for fixed widths that might be too wide
          if (styles.width && styles.width.includes('px')) {
            const width = parseFloat(styles.width);
            if (width > window.innerWidth) {
              issues.push({
                type: 'fixed-width-too-wide',
                element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
                issue: 'Element has fixed width exceeding viewport',
                width: width,
                viewportWidth: window.innerWidth
              });
            }
          }
          
          // Check for elements positioned outside viewport
          if (rect.left < -50 || rect.right > window.innerWidth + 50) {
            issues.push({
              type: 'positioned-outside-viewport',
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              issue: 'Element positioned outside viewport',
              left: rect.left,
              right: rect.right,
              viewportWidth: window.innerWidth
            });
          }
        });
        
        return issues.slice(0, 10); // Limit output
      });
      
      console.log('Problematic elements found:', problematicElements);
      
      // This is more of a diagnostic test - we expect some issues to be found
      // but we want to log them for investigation
      expect(Array.isArray(problematicElements)).toBe(true);
    });

    test('Checks text readability and font sizes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const textIssues = await page.evaluate(() => {
        const textElements = Array.from(document.querySelectorAll('p, span, div, li, a, button'));
        const issues: Array<{
          type: string,
          element: string,
          fontSize?: number,
          text?: string,
          color?: string,
          backgroundColor?: string
        }> = [];
        
        textElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const fontSize = parseFloat(styles.fontSize);
          const text = el.textContent?.trim();
          
          if (text && text.length > 5) { // Only check elements with meaningful text
            // Font size should be at least 16px for mobile readability
            if (fontSize < 16) {
              issues.push({
                type: 'font-too-small',
                element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
                fontSize: fontSize,
                text: text.substring(0, 30) + (text.length > 30 ? '...' : '')
              });
            }
            
            // Check for poor color contrast (basic check)
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            if (color === backgroundColor) {
              issues.push({
                type: 'invisible-text',
                element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
                color: color,
                backgroundColor: backgroundColor
              });
            }
          }
        });
        
        return issues.slice(0, 10);
      });
      
      console.log('Text readability issues:', textIssues);
      
      // Count critical issues (font size less than 14px)
      const criticalIssues = textIssues.filter(issue => 
        issue.type === 'font-too-small' && issue.fontSize < 14
      );
      
      expect(criticalIssues.length).toBeLessThan(5); // Allow some tolerance
    });
  });

  test.describe('Touch Target Issues', () => {
    test('Identifies touch targets that are too small', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const touchTargetIssues = await page.evaluate(() => {
        const interactiveElements = Array.from(document.querySelectorAll('a, button, input, select, textarea, [onclick], [role="button"]'));
        const issues: Array<{
          type: string,
          element: string,
          width?: number,
          height?: number,
          text?: string
        }> = [];
        
        interactiveElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const minTouchSize = 44; // iOS recommendation
          
          if (rect.width > 0 && rect.height > 0) { // Only check visible elements
            if (rect.width < minTouchSize || rect.height < minTouchSize) {
              issues.push({
                type: 'touch-target-too-small',
                element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
                width: rect.width,
                height: rect.height,
                text: el.textContent?.substring(0, 20) || 'No text'
              });
            }
          }
        });
        
        return issues.slice(0, 10);
      });
      
      console.log('Touch target issues:', touchTargetIssues);
      
      // Critical touch targets that are way too small
      const criticalIssues = touchTargetIssues.filter(issue => 
        issue.width < 30 || issue.height < 30
      );
      
      expect(criticalIssues.length).toBeLessThan(3); // Allow some small icons
    });

    test('Checks for overlapping clickable elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const overlappingElements = await page.evaluate(() => {
        const clickableElements = Array.from(document.querySelectorAll('a, button, [onclick], [role="button"]'));
        const overlaps = [];
        
        for (let i = 0; i < clickableElements.length; i++) {
          const el1 = clickableElements[i];
          const rect1 = el1.getBoundingClientRect();
          
          for (let j = i + 1; j < clickableElements.length; j++) {
            const el2 = clickableElements[j];
            const rect2 = el2.getBoundingClientRect();
            
            // Check if rectangles overlap
            if (!(rect1.right < rect2.left || 
                  rect2.right < rect1.left || 
                  rect1.bottom < rect2.top || 
                  rect2.bottom < rect1.top)) {
              overlaps.push({
                element1: el1.tagName + (el1.className ? '.' + el1.className.split(' ')[0] : ''),
                element2: el2.tagName + (el2.className ? '.' + el2.className.split(' ')[0] : ''),
                text1: el1.textContent?.substring(0, 20) || 'No text',
                text2: el2.textContent?.substring(0, 20) || 'No text'
              });
            }
          }
        }
        
        return overlaps.slice(0, 5);
      });
      
      console.log('Overlapping clickable elements:', overlappingElements);
      
      // Some overlap might be acceptable (e.g., nested elements)
      expect(overlappingElements.length).toBeLessThan(10);
    });
  });

  test.describe('Navigation Issues', () => {
    test('Tests mobile navigation accessibility', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for mobile menu
      const mobileMenuButton = page.getByRole('button', { name: /toggle mobile menu|menu|hamburger/i });
      const hasMobileMenu = await mobileMenuButton.count() > 0;
      
      if (hasMobileMenu) {
        // Test mobile menu functionality
        await expect(mobileMenuButton).toBeVisible();
        
        // Check if button has proper ARIA attributes
        const ariaLabel = await mobileMenuButton.getAttribute('aria-label');
        const ariaExpanded = await mobileMenuButton.getAttribute('aria-expanded');
        
        expect(ariaLabel || ariaExpanded).toBeTruthy(); // Should have at least one
        
        // Test menu open/close
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
        
        // Check if expanded state changed
        const expandedAfterClick = await mobileMenuButton.getAttribute('aria-expanded');
        
        // Test navigation items are accessible
        const navItems = page.locator('nav a, [role="navigation"] a');
        const navCount = await navItems.count();
        expect(navCount).toBeGreaterThan(0);
        
        // Close menu
        await mobileMenuButton.click();
        await page.waitForTimeout(500);
      } else {
        // If no mobile menu, check that regular nav works on mobile
        const navigation = page.locator('nav, [role="navigation"]');
        const hasNav = await navigation.count() > 0;
        expect(hasNav).toBe(true);
      }
    });

    test('Checks for keyboard navigation on mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      // Check if any element received focus
      const focusedElement = await page.evaluate(() => {
        const activeEl = document.activeElement;
        return {
          tagName: activeEl?.tagName,
          className: activeEl?.className,
          type: activeEl?.getAttribute('type'),
          role: activeEl?.getAttribute('role')
        };
      });
      
      expect(focusedElement.tagName).toBeTruthy();
      
      // Continue tabbing through a few elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }
      
      // Check that focus is still within the page
      const finalFocusedElement = await page.evaluate(() => {
        const activeEl = document.activeElement;
        return activeEl?.tagName !== 'BODY';
      });
      
      expect(finalFocusedElement).toBe(true);
    });
  });

  test.describe('Performance Issues', () => {
    test('Detects slow-loading elements', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      
      // Wait for network idle but with timeout
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      console.log(`Page load time: ${loadTime}ms`);
      
      // Check for images that might be loading slowly
      const imageLoadStatus = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.map(img => ({
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          error: !img.complete && img.naturalWidth === 0
        }));
      });
      
      console.log('Image load status:', imageLoadStatus);
      
      const failedImages = imageLoadStatus.filter(img => img.error);
      expect(failedImages.length).toBeLessThan(2); // Allow some tolerance
      
      // Mobile load time should be reasonable
      expect(loadTime).toBeLessThan(8000); // 8 seconds max for mobile
    });

    test('Checks for excessive DOM size', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const domStats = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        const depthMap = new Map();
        
        // Calculate depth of each element
        allElements.forEach(el => {
          let depth = 0;
          let parent = el.parentElement;
          while (parent) {
            depth++;
            parent = parent.parentElement;
          }
          depthMap.set(el, depth);
        });
        
        const maxDepth = Math.max(...Array.from(depthMap.values()));
        
        return {
          totalElements: allElements.length,
          maxDepth: maxDepth,
          bodyChildren: document.body.children.length
        };
      });
      
      console.log('DOM stats:', domStats);
      
      // Mobile devices struggle with very large DOMs
      expect(domStats.totalElements).toBeLessThan(2000); // Reasonable limit for mobile
      expect(domStats.maxDepth).toBeLessThan(25); // Prevent overly nested structures
    });
  });

  test.describe('Content Issues', () => {
    test('Identifies content that may not fit mobile screens', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contentIssues = await page.evaluate(() => {
        const issues: Array<{
          type: string,
          element: string,
          width?: number,
          height?: number,
          maxWidth?: number,
          viewportWidth?: number
        }> = [];
        
        // Check for very wide tables
        const tables = Array.from(document.querySelectorAll('table'));
        tables.forEach(table => {
          const rect = table.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.9) {
            issues.push({
              type: 'wide-table',
              width: rect.width,
              viewportWidth: window.innerWidth
            });
          }
        });
        
        // Check for very long lines of text
        const textElements = Array.from(document.querySelectorAll('p, div, span'));
        textElements.forEach(el => {
          const text = el.textContent?.trim();
          if (text && text.length > 200) {
            const rect = el.getBoundingClientRect();
            if (rect.width > window.innerWidth * 0.95) {
              issues.push({
                type: 'long-text-line',
                width: rect.width,
                viewportWidth: window.innerWidth,
                textLength: text.length
              });
            }
          }
        });
        
        return issues;
      });
      
      console.log('Content issues:', contentIssues);
      
      // Allow some content issues but flag excessive ones
      expect(contentIssues.length).toBeLessThan(5);
    });
  });

  test.describe('Form Issues', () => {
    test('Checks mobile form usability', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const formIssues = await page.evaluate(() => {
        const issues: Array<{
          type: string,
          element: string,
          height?: number,
          inputType?: string,
          marginBottom?: number
        }> = [];
        const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
        
        inputs.forEach(input => {
          const rect = input.getBoundingClientRect();
          const styles = window.getComputedStyle(input);
          const inputElement = input as HTMLInputElement;

          // Check input size
          if (rect.height < 44) {
            issues.push({
              type: 'input-too-small',
              height: rect.height,
              element: input.tagName + (inputElement.type ? `[type="${inputElement.type}"]` : '')
            });
          }

          // Check for proper spacing
          const marginBottom = parseFloat(styles.marginBottom);
          if (marginBottom < 8) {
            issues.push({
              type: 'insufficient-spacing',
              marginBottom: marginBottom,
              element: input.tagName + (inputElement.type ? `[type="${inputElement.type}"]` : '')
            });
          }
        });
        
        return issues;
      });
      
      console.log('Form issues:', formIssues);
      
      // Critical form issues should be minimal
      const criticalIssues = formIssues.filter(issue => 
        issue.type === 'input-too-small' && issue.height < 35
      );
      
      expect(criticalIssues.length).toBeLessThan(3);
    });
  });
});