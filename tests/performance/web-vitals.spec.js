const { test, expect } = require('@playwright/test');

test.describe('Web Vitals Performance Tests', () => {
  const pages = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Blog', url: '/blog' },
    { name: 'Journey', url: '/journey' },
    { name: 'Training', url: '/training' }
  ];

  for (const pageInfo of pages) {
    test.describe(`${pageInfo.name} Page Performance`, () => {
      
      test(`should have good Largest Contentful Paint (LCP) - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const lcp = await page.evaluate(() => {
          return new Promise((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              resolve(lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Fallback timeout
            setTimeout(() => resolve(null), 10000);
          });
        });
        
        if (lcp !== null) {
          expect(lcp).toBeLessThan(2500); // 2.5 seconds for good LCP
          console.log(`LCP for ${pageInfo.name}: ${lcp}ms`);
        }
      });

      test(`should have low Cumulative Layout Shift (CLS) - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        // Wait for page to settle
        await page.waitForTimeout(3000);
        
        const cls = await page.evaluate(() => {
          return new Promise((resolve) => {
            let clsValue = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                }
              }
              resolve(clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
            
            // Wait a bit and resolve
            setTimeout(() => resolve(clsValue), 2000);
          });
        });
        
        expect(cls).toBeLessThan(0.1); // 0.1 for good CLS
        console.log(`CLS for ${pageInfo.name}: ${cls}`);
      });

      test(`should have fast First Contentful Paint (FCP) - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const fcp = await page.evaluate(() => {
          return new Promise((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
              resolve(fcpEntry ? fcpEntry.startTime : null);
            }).observe({ entryTypes: ['paint'] });
            
            setTimeout(() => resolve(null), 5000);
          });
        });
        
        if (fcp !== null) {
          expect(fcp).toBeLessThan(1800); // 1.8 seconds for good FCP
          console.log(`FCP for ${pageInfo.name}: ${fcp}ms`);
        }
      });

      test(`should have reasonable Time to Interactive (TTI) - ${pageInfo.name}`, async ({ page }) => {
        const startTime = Date.now();
        await page.goto(pageInfo.url);
        
        // Wait for the page to be interactive
        await page.waitForLoadState('networkidle');
        
        // Check if main thread is not blocked
        const isInteractive = await page.evaluate(() => {
          const start = performance.now();
          // Simulate some work
          while (performance.now() - start < 50) {
            // Busy wait for 50ms
          }
          return performance.now() - start < 100; // Should complete within reasonable time
        });
        
        const tti = Date.now() - startTime;
        expect(tti).toBeLessThan(5000); // 5 seconds TTI threshold
        expect(isInteractive).toBe(true);
        console.log(`TTI for ${pageInfo.name}: ${tti}ms`);
      });

      test(`should load critical resources quickly - ${pageInfo.name}`, async ({ page }) => {
        await page.goto(pageInfo.url);
        
        const resourceTimings = await page.evaluate(() => {
          return performance.getEntriesByType('resource').map(entry => ({
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            type: entry.initiatorType
          }));
        });
        
        // Check CSS files load quickly
        const cssFiles = resourceTimings.filter(r => r.name.includes('.css') || r.type === 'css');
        cssFiles.forEach(css => {
          expect(css.duration).toBeLessThan(1000); // CSS should load within 1 second
        });
        
        // Check JavaScript files
        const jsFiles = resourceTimings.filter(r => r.name.includes('.js') || r.type === 'script');
        jsFiles.forEach(js => {
          expect(js.duration).toBeLessThan(2000); // JS should load within 2 seconds
        });
        
        console.log(`Resource count for ${pageInfo.name}:`, resourceTimings.length);
      });

      test(`should not have memory leaks - ${pageInfo.name}`, async ({ page }) => {
        if (!page.evaluate(() => 'memory' in performance)) {
          test.skip('Memory API not available');
        }
        
        const initialMemory = await page.evaluate(() => performance.memory.usedJSHeapSize);
        
        // Navigate and interact with the page
        await page.goto(pageInfo.url);
        await page.reload();
        await page.goto(pageInfo.url);
        
        // Force garbage collection if available
        await page.evaluate(() => {
          if (window.gc) window.gc();
        });
        
        await page.waitForTimeout(1000);
        
        const finalMemory = await page.evaluate(() => performance.memory.usedJSHeapSize);
        const memoryIncrease = finalMemory - initialMemory;
        
        // Memory increase should be reasonable (less than 10MB)
        expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
        console.log(`Memory increase for ${pageInfo.name}: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
      });

    });
  }

  test('Bundle size analysis', async ({ page }) => {
    await page.goto('/');
    
    const bundles = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('/_next/static/'))
        .map(entry => ({
          name: entry.name.split('/').pop(),
          size: entry.transferSize,
          compressed: entry.encodedBodySize,
          uncompressed: entry.decodedBodySize
        }));
    });
    
    // Check main bundle size
    const mainBundle = bundles.find(b => b.name.includes('main'));
    if (mainBundle) {
      expect(mainBundle.size).toBeLessThan(250 * 1024); // 250KB main bundle limit
      console.log(`Main bundle size: ${(mainBundle.size / 1024).toFixed(2)}KB`);
    }
    
    // Check total bundle size
    const totalSize = bundles.reduce((sum, bundle) => sum + bundle.size, 0);
    expect(totalSize).toBeLessThan(1024 * 1024); // 1MB total bundle limit
    console.log(`Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
  });

});