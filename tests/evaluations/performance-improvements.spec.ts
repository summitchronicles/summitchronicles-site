import { test, expect } from '@playwright/test';

test.describe('Performance Improvements Evaluation', () => {
  const baseUrl = 'http://localhost:3000';

  test('should have improved Core Web Vitals', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Measure performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics: Record<string, number> = {};
          
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              const layoutShiftEntry = entry as PerformanceEntry & { value: number; hadRecentInput?: boolean };
              if (!layoutShiftEntry.hadRecentInput) {
                metrics.cls = (metrics.cls || 0) + layoutShiftEntry.value;
              }
            }
          });
          
          if (metrics.lcp && metrics.cls !== undefined) {
            resolve(metrics);
          }
        }).observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve({}), 5000);
      });
    });

    console.log('Performance metrics:', performanceMetrics);
    
    // Assert performance improvements
    if ((performanceMetrics as any).lcp) {
      expect((performanceMetrics as any).lcp).toBeLessThan(2500); // LCP should be under 2.5s
    }
    
    if ((performanceMetrics as any).cls !== undefined) {
      expect((performanceMetrics as any).cls).toBeLessThan(0.1); // CLS should be under 0.1
    }
  });

  test('should have optimized images loading', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check for lazy loading implementation
    const images = await page.locator('img').all();
    let hasLazyLoading = false;
    
    for (const img of images) {
      const loading = await img.getAttribute('loading');
      if (loading === 'lazy') {
        hasLazyLoading = true;
        break;
      }
    }
    
    expect(hasLazyLoading).toBeTruthy();
  });

  test('should have reduced bundle size', async ({ page }) => {
    // Test for dynamic imports and code splitting
    const response = await page.goto(baseUrl);
    const networkLogs: string[] = [];
    
    page.on('response', (response) => {
      if (response.url().includes('/_next/static/chunks/')) {
        networkLogs.push(response.url());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Should have multiple chunks indicating code splitting
    expect(networkLogs.length).toBeGreaterThan(1);
    
    // Check main bundle size (should be reasonable)
    const mainResponse = await page.goto(baseUrl);
    const contentLength = mainResponse?.headers()['content-length'];
    if (contentLength) {
      const sizeKB = parseInt(contentLength) / 1024;
      expect(sizeKB).toBeLessThan(500); // Main page should be under 500KB
    }
  });

  test('should have error boundaries working', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check console for any uncaught errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Should not have critical console errors
    const criticalErrors = errors.filter(error => 
      error.includes('Error:') || error.includes('TypeError:')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should have caching strategies implemented', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check for service worker or caching headers
    const response = await page.goto(baseUrl);
    const cacheControl = response?.headers()['cache-control'];
    
    // Should have some caching strategy
    expect(cacheControl).toBeDefined();
  });
});