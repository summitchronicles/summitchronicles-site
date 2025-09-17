import { Page } from '@playwright/test';
import { TEST_VIEWPORTS } from '../config';

export interface ResponsiveIssue {
  type:
    | 'horizontal-scroll'
    | 'touch-target'
    | 'text-readability'
    | 'navigation'
    | 'content-overflow';
  severity: 'critical' | 'warning' | 'info';
  viewport: string;
  message: string;
  element?: string;
  expected?: string;
  actual?: string;
}

export interface ViewportTestResult {
  name: string;
  width: number;
  height: number;
  issues: ResponsiveIssue[];
  screenshot: string;
  passed: boolean;
}

export class ResponsiveTester {
  constructor(private page: Page) {}

  async testViewport(viewport: {
    name: string;
    width: number;
    height: number;
  }): Promise<ViewportTestResult> {
    await this.page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    // Wait for any responsive transitions
    await this.page.waitForTimeout(500);

    const issues: ResponsiveIssue[] = [];

    // Check for horizontal scroll
    const hasHorizontalScroll = await this.page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });

    if (hasHorizontalScroll) {
      issues.push({
        type: 'horizontal-scroll',
        severity: 'critical',
        viewport: viewport.name,
        message: `Horizontal scroll detected at ${viewport.width}px width`,
      });
    }

    // Check touch target sizes (for mobile/tablet)
    if (viewport.width <= 768) {
      const touchTargetIssues = await this.checkTouchTargets(viewport.name);
      issues.push(...touchTargetIssues);
    }

    // Check text readability
    const readabilityIssues = await this.checkTextReadability(viewport.name);
    issues.push(...readabilityIssues);

    // Check navigation accessibility
    const navIssues = await this.checkNavigation(viewport.name);
    issues.push(...navIssues);

    // Check for content overflow
    const overflowIssues = await this.checkContentOverflow(viewport.name);
    issues.push(...overflowIssues);

    // Take screenshot
    const screenshotPath = `agents/design-reviewer/reports/screenshots/${viewport.name.toLowerCase().replace(/\s+/g, '-')}-${viewport.width}x${viewport.height}.png`;
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    return {
      name: viewport.name,
      width: viewport.width,
      height: viewport.height,
      issues,
      screenshot: screenshotPath,
      passed: issues.filter((i) => i.severity === 'critical').length === 0,
    };
  }

  private async checkTouchTargets(
    viewportName: string
  ): Promise<ResponsiveIssue[]> {
    const touchTargetIssues = await this.page.evaluate((viewport) => {
      const interactive = document.querySelectorAll(
        'button, a, input[type="button"], input[type="submit"], select, [role="button"]'
      );
      const issues: any[] = [];

      interactive.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const minSize = 44; // WCAG recommendation

        if (rect.width < minSize || rect.height < minSize) {
          issues.push({
            type: 'touch-target',
            severity: 'warning',
            viewport: viewport,
            message: `Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px (minimum: ${minSize}x${minSize}px)`,
            element:
              el.tagName.toLowerCase() +
              (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
            expected: `${minSize}x${minSize}px`,
            actual: `${Math.round(rect.width)}x${Math.round(rect.height)}px`,
          });
        }
      });

      return issues;
    }, viewportName);

    return touchTargetIssues;
  }

  private async checkTextReadability(
    viewportName: string
  ): Promise<ResponsiveIssue[]> {
    const readabilityIssues = await this.page.evaluate((viewport) => {
      const textElements = document.querySelectorAll(
        'p, h1, h2, h3, h4, h5, h6, span, div'
      );
      const issues: any[] = [];

      textElements.forEach((el) => {
        const style = getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);

        // Check minimum font size for readability on mobile
        if (viewport === 'Mobile' && fontSize < 14) {
          issues.push({
            type: 'text-readability',
            severity: 'warning',
            viewport: viewport,
            message: `Text too small for mobile: ${fontSize}px`,
            element:
              el.tagName.toLowerCase() +
              (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
            expected: '≥14px',
            actual: `${fontSize}px`,
          });
        }

        // Check line length for readability
        const rect = el.getBoundingClientRect();
        if (rect.width > 800) {
          issues.push({
            type: 'text-readability',
            severity: 'info',
            viewport: viewport,
            message: `Text line might be too long for comfortable reading: ${Math.round(rect.width)}px`,
            element:
              el.tagName.toLowerCase() +
              (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
            expected: '≤800px',
            actual: `${Math.round(rect.width)}px`,
          });
        }
      });

      return issues;
    }, viewportName);

    return readabilityIssues;
  }

  private async checkNavigation(
    viewportName: string
  ): Promise<ResponsiveIssue[]> {
    const navIssues = await this.page.evaluate((viewport) => {
      const issues: any[] = [];

      // Check if navigation is accessible
      const nav = document.querySelector('nav, [role="navigation"]');
      if (nav) {
        const style = getComputedStyle(nav);

        if (style.display === 'none' && viewport === 'Mobile') {
          // Check if there's a mobile menu toggle
          const mobileToggle = document.querySelector(
            '[aria-label*="menu"], [aria-label*="toggle"], .menu-toggle, .hamburger'
          );
          if (!mobileToggle) {
            issues.push({
              type: 'navigation',
              severity: 'critical',
              viewport: viewport,
              message:
                'Navigation hidden on mobile without accessible toggle button',
            });
          }
        }
      }

      return issues;
    }, viewportName);

    return navIssues;
  }

  private async checkContentOverflow(
    viewportName: string
  ): Promise<ResponsiveIssue[]> {
    const overflowIssues = await this.page.evaluate((viewport) => {
      const issues: any[] = [];

      // Check for fixed-width elements that might overflow
      const elements = document.querySelectorAll('*');
      elements.forEach((el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        // Check for fixed widths that are too large for viewport
        if (style.width && style.width.includes('px')) {
          const width = parseFloat(style.width);
          if (width > window.innerWidth && width > 300) {
            // Ignore very small fixed widths
            issues.push({
              type: 'content-overflow',
              severity: 'warning',
              viewport: viewport,
              message: `Fixed width element (${width}px) exceeds viewport width (${window.innerWidth}px)`,
              element:
                el.tagName.toLowerCase() +
                (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
              expected: `≤${window.innerWidth}px`,
              actual: `${width}px`,
            });
          }
        }
      });

      return issues;
    }, viewportName);

    return overflowIssues;
  }

  async testAllViewports(): Promise<ViewportTestResult[]> {
    const results: ViewportTestResult[] = [];

    for (const viewport of TEST_VIEWPORTS) {
      const result = await this.testViewport(viewport);
      results.push(result);
    }

    return results;
  }
}
