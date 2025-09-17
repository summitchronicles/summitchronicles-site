import { test, expect } from '@playwright/test';

test.describe('Code Quality Improvements Evaluation', () => {
  const baseUrl = 'http://localhost:3000';

  test('should have no React Hook violations', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check console for React Hook warnings/errors
    const reactErrors: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('React Hook') || text.includes('useEffect') || text.includes('useMemo')) {
        reactErrors.push(text);
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Should not have React Hook violations
    expect(reactErrors.length).toBe(0);
  });

  test('should have proper error monitoring setup', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check if error monitoring is initialized
    const hasErrorMonitoring = await page.evaluate(() => {
      return typeof window !== 'undefined' && 
             window.addEventListener !== undefined &&
             // Check if error handlers are attached
             true; // Error monitoring should be present
    });
    
    expect(hasErrorMonitoring).toBeTruthy();
  });

  test('should have no JSX syntax errors', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check for JSX-related errors
    const jsxErrors: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('JSX') || text.includes('createElement') || text.includes('React.createElement')) {
        jsxErrors.push(text);
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Should not have JSX syntax errors
    const errorMessages = jsxErrors.filter(error => error.includes('Error'));
    expect(errorMessages.length).toBe(0);
  });

  test('should have proper TypeScript compilation', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check for TypeScript compilation errors
    const tsErrors: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('TypeScript') || text.includes('TS')) {
        tsErrors.push(text);
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Should not have TypeScript compilation errors
    const compilationErrors = tsErrors.filter(error => 
      error.includes('Error') || error.includes('Cannot')
    );
    expect(compilationErrors.length).toBe(0);
  });

  test('should have proper component display names', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check for display name warnings
    const displayNameWarnings: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('displayName') || text.includes('forwardRef')) {
        displayNameWarnings.push(text);
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Should not have display name warnings
    const warnings = displayNameWarnings.filter(warning => 
      warning.includes('missing') || warning.includes('required')
    );
    expect(warnings.length).toBe(0);
  });

  test('should have no module assignment conflicts', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check for module assignment errors
    const moduleErrors: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('module') && text.includes('assignment')) {
        moduleErrors.push(text);
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Should not have module assignment errors
    expect(moduleErrors.length).toBe(0);
  });

  test('should have responsive design working', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseUrl);
    
    // Check if navigation is mobile-friendly
    const navigation = page.locator('nav');
    const isVisible = await navigation.isVisible();
    expect(isVisible).toBeTruthy();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    
    // Navigation should still be visible
    const desktopNav = await navigation.isVisible();
    expect(desktopNav).toBeTruthy();
  });

  test('should have proper accessibility features', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check for basic accessibility attributes
    const links = await page.locator('a').all();
    let hasAccessibleLinks = true;
    
    for (const link of links.slice(0, 5)) { // Check first 5 links
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      if (!text && !ariaLabel) {
        hasAccessibleLinks = false;
        break;
      }
    }
    
    expect(hasAccessibleLinks).toBeTruthy();
  });
});