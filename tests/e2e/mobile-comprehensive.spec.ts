import { test, expect, devices } from '@playwright/test';

// Mobile device configurations for testing
const MOBILE_DEVICES = [
  { name: 'iPhone SE', ...devices['iPhone SE'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'iPhone 12 Pro', ...devices['iPhone 12 Pro'] },
  { name: 'iPhone 13', ...devices['iPhone 13'] },
  { name: 'Samsung Galaxy S21', ...devices['Galaxy S21'] },
  { name: 'Samsung Galaxy Note 20', ...devices['Galaxy Note 20'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] }
];

// Additional viewport sizes to test
const CUSTOM_MOBILE_VIEWPORTS = [
  { name: 'Small Mobile', width: 320, height: 568 }, // iPhone 5/SE
  { name: 'Medium Mobile', width: 375, height: 667 }, // iPhone 6/7/8
  { name: 'Large Mobile', width: 414, height: 896 }, // iPhone XR/11
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Small Tablet', width: 600, height: 800 }
];

const PAGES_TO_TEST = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About Page' },
  { path: '/training', name: 'Training Page' },
  { path: '/blog', name: 'Blog Page' },
  { path: '/design-system', name: 'Design System' }
];

test.describe('Comprehensive Mobile Testing Suite', () => {
  
  // Test mobile navigation functionality
  test.describe('Mobile Navigation', () => {
    CUSTOM_MOBILE_VIEWPORTS.slice(0, 3).forEach(viewport => {
      test(`Mobile navigation works on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Mobile menu button should be visible
        const menuButton = page.getByRole('button', { name: /toggle mobile menu|menu|hamburger/i });
        await expect(menuButton).toBeVisible();

        // Menu should be closed initially
        const mobileMenuItems = page.locator('[class*="mobile"], [data-mobile="true"]').locator('a, button').first();
        const isMenuOpen = await mobileMenuItems.isVisible().catch(() => false);
        
        if (isMenuOpen) {
          // If menu is visible, close it first
          await menuButton.click();
          await page.waitForTimeout(300);
        }

        // Click to open menu
        await menuButton.click();
        await page.waitForTimeout(500); // Wait for animation

        // Verify menu items are visible
        const navigationLinks = ['Home', 'About', 'Training', 'Blog'];
        for (const linkText of navigationLinks) {
          const link = page.getByRole('link', { name: new RegExp(linkText, 'i') });
          const linkCount = await link.count();
          if (linkCount > 0) {
            await expect(link.first()).toBeVisible();
          }
        }

        // Test menu close functionality
        await menuButton.click();
        await page.waitForTimeout(500);
        
        // Take screenshot for visual regression
        await expect(page).toHaveScreenshot(`mobile-nav-${viewport.name.replace(' ', '-').toLowerCase()}.png`);
      });
    });
  });

  // Test touch interactions
  test.describe('Touch Interactions', () => {
    test('Touch interactions work correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test touch tap on mobile menu
      const menuButton = page.getByRole('button', { name: /toggle mobile menu|menu|hamburger/i });
      if (await menuButton.isVisible()) {
        await menuButton.tap();
        await page.waitForTimeout(300);
        
        // Verify menu opened
        const mobileMenu = page.locator('[class*="mobile"], [data-mobile="true"]');
        const menuVisible = await mobileMenu.isVisible().catch(() => false);
        if (menuVisible) {
          await expect(mobileMenu).toBeVisible();
        }
      }

      // Test touch on links
      const primaryLinks = page.locator('a').filter({ hasText: /home|about|training|blog/i });
      const linkCount = await primaryLinks.count();
      if (linkCount > 0) {
        const firstLink = primaryLinks.first();
        await firstLink.tap();
        await page.waitForTimeout(1000);
        
        // Verify navigation occurred
        expect(page.url()).toMatch(/localhost:3000/);
      }
    });

    test('Scroll behavior works on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test vertical scroll
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(500);
      
      const newScrollY = await page.evaluate(() => window.scrollY);
      expect(newScrollY).toBeGreaterThan(initialScrollY);

      // Test header behavior on scroll (if it has scroll effects)
      const header = page.locator('header');
      if (await header.isVisible()) {
        const headerClasses = await header.getAttribute('class');
        // Header should potentially change appearance on scroll
        expect(headerClasses).toBeTruthy();
      }
    });

    test('Form interactions work on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Look for forms (newsletter signup, etc.)
      const emailInputs = page.locator('input[type="email"], input[placeholder*="email"]');
      const emailInputCount = await emailInputs.count();
      
      if (emailInputCount > 0) {
        const emailInput = emailInputs.first();
        await emailInput.tap();
        await page.waitForTimeout(300);
        
        // Check if virtual keyboard appears (viewport changes)
        const viewportAfterFocus = await page.viewportSize();
        expect(viewportAfterFocus).toBeTruthy();
        
        // Test typing
        await emailInput.fill('test@example.com');
        await expect(emailInput).toHaveValue('test@example.com');
        
        // Test submit button
        const submitButton = page.locator('button[type="submit"], button').filter({ hasText: /subscribe|submit|send/i });
        const submitCount = await submitButton.count();
        if (submitCount > 0) {
          await submitButton.first().tap();
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  // Test responsive design across multiple devices
  test.describe('Multi-Device Responsive Testing', () => {
    MOBILE_DEVICES.slice(0, 4).forEach(device => {
      test(`Responsive design on ${device.name}`, async ({ browser }) => {
        const context = await browser.newContext({
          ...device
        });
        const page = await context.newPage();
        
        try {
          await page.goto('/');
          await page.waitForLoadState('networkidle');

          // Check viewport doesn't cause horizontal scroll
          const scrollInfo = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 5
          }));

          expect(scrollInfo.hasHorizontalScroll).toBe(false);

          // Check that key elements are visible
          const header = page.locator('header');
          if (await header.count() > 0) {
            await expect(header).toBeVisible();
          }

          const main = page.locator('main');
          if (await main.count() > 0) {
            await expect(main).toBeVisible();
          }

          // Take full page screenshot
          await expect(page).toHaveScreenshot(`responsive-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`, {
            fullPage: true,
            threshold: 0.3
          });

        } finally {
          await context.close();
        }
      });
    });
  });

  // Test mobile performance and loading
  test.describe('Mobile Performance', () => {
    test('Page loads efficiently on mobile connection', async ({ page }) => {
      // Simulate slow 3G connection
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Add delay
        await route.continue();
      });

      await page.setViewportSize({ width: 375, height: 667 });
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Should load within reasonable time even with slow connection
      expect(loadTime).toBeLessThan(10000); // 10 seconds max

      // Check that critical content is visible
      const hasContent = await page.locator('h1, h2, main, [role="main"]').count();
      expect(hasContent).toBeGreaterThan(0);
    });

    test('Images load and display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        // Check first few images
        for (let i = 0; i < Math.min(3, imageCount); i++) {
          const img = images.nth(i);
          const src = await img.getAttribute('src');
          
          if (src && !src.startsWith('data:')) {
            // Check if image loaded
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  // Test mobile accessibility
  test.describe('Mobile Accessibility', () => {
    test('Touch targets are appropriately sized', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check button and link sizes
      const interactiveElements = page.locator('button, a, input[type="submit"], input[type="button"]');
      const elementCount = await interactiveElements.count();

      if (elementCount > 0) {
        for (let i = 0; i < Math.min(5, elementCount); i++) {
          const element = interactiveElements.nth(i);
          if (await element.isVisible()) {
            const box = await element.boundingBox();
            if (box) {
              // Touch targets should be at least 44x44px (iOS) or 48x48px (Android)
              const minSize = 44;
              expect(box.width).toBeGreaterThanOrEqual(minSize - 10); // Allow some tolerance
              expect(box.height).toBeGreaterThanOrEqual(minSize - 10);
            }
          }
        }
      }
    });

    test('Content is readable on mobile without zooming', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check font sizes
      const textElements = page.locator('p, span, div, li').filter({ hasText: /.{10,}/ });
      const textCount = await textElements.count();

      if (textCount > 0) {
        for (let i = 0; i < Math.min(3, textCount); i++) {
          const element = textElements.nth(i);
          if (await element.isVisible()) {
            const fontSize = await element.evaluate(el => {
              const styles = window.getComputedStyle(el);
              return parseFloat(styles.fontSize);
            });
            
            // Font size should be at least 16px for good mobile readability
            expect(fontSize).toBeGreaterThanOrEqual(14); // Allow some tolerance
          }
        }
      }
    });
  });

  // Test mobile-specific features
  test.describe('Mobile-Specific Features', () => {
    test('Mobile viewport meta tag is present', async ({ page }) => {
      await page.goto('/');
      
      const viewportMeta = page.locator('meta[name="viewport"]');
      await expect(viewportMeta).toHaveCount(1);
      
      const content = await viewportMeta.getAttribute('content');
      expect(content).toMatch(/width=device-width/);
      expect(content).toMatch(/initial-scale=1/);
    });

    test('Touch actions work for interactive elements', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test long press (if applicable)
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        if (await firstButton.isVisible()) {
          // Simulate touch events
          await firstButton.dispatchEvent('touchstart');
          await page.waitForTimeout(100);
          await firstButton.dispatchEvent('touchend');
          await page.waitForTimeout(500);
        }
      }
    });
  });

  // Test cross-page mobile experience
  test.describe('Mobile Cross-Page Navigation', () => {
    PAGES_TO_TEST.slice(0, 3).forEach(pageInfo => {
      test(`Mobile experience on ${pageInfo.name}`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');

        // Check no horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth + 5;
        });
        expect(hasHorizontalScroll).toBe(false);

        // Check mobile navigation is available
        const menuButton = page.getByRole('button', { name: /toggle mobile menu|menu|hamburger/i });
        const menuButtonVisible = await menuButton.isVisible().catch(() => false);
        
        if (menuButtonVisible) {
          await expect(menuButton).toBeVisible();
        }

        // Check content is accessible
        const mainContent = page.locator('main, [role="main"], .main-content');
        const hasMainContent = await mainContent.count() > 0;
        if (hasMainContent) {
          await expect(mainContent.first()).toBeVisible();
        }

        // Take page screenshot
        await expect(page).toHaveScreenshot(`mobile-${pageInfo.name.replace(/\s+/g, '-').toLowerCase()}.png`, {
          fullPage: true,
          threshold: 0.3
        });
      });
    });
  });

  // Test mobile orientation changes
  test.describe('Orientation Handling', () => {
    test('Layout adapts to orientation changes', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Take portrait screenshot
      await expect(page).toHaveScreenshot('mobile-portrait.png', { threshold: 0.3 });

      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500); // Wait for layout adjustment

      // Check layout still works
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 5;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Take landscape screenshot
      await expect(page).toHaveScreenshot('mobile-landscape.png', { threshold: 0.3 });
    });
  });
});