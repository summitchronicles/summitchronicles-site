import { Page } from '@playwright/test';
import { SUMMIT_CHRONICLES_BRAND_CONFIG, BRAND_COLOR_VARIANTS } from '../config';

export interface VisualIssue {
  type: 'broken-image' | 'color-violation' | 'typography-issue' | 'layout-problem';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  element?: string;
  expected?: string;
  actual?: string;
}

export class VisualInspector {
  constructor(private page: Page) {}

  async checkBrokenImages(): Promise<VisualIssue[]> {
    const brokenImages = await this.page.evaluate(() => {
      const images = Array.from(document.images);
      return images
        .filter(img => !img.complete || img.naturalHeight === 0)
        .map(img => ({
          src: img.src,
          alt: img.alt || 'No alt text',
          selector: img.tagName + (img.className ? '.' + img.className.replace(/\s+/g, '.') : '')
        }));
    });

    return brokenImages.map(img => ({
      type: 'broken-image' as const,
      severity: 'critical' as const,
      message: `Broken image found: ${img.src}`,
      element: img.selector,
      actual: img.src
    }));
  }

  async checkBrandColorCompliance(): Promise<VisualIssue[]> {
    const colorUsage = await this.page.evaluate((brandColors) => {
      const elements = document.querySelectorAll('*');
      const issues: any[] = [];
      
      elements.forEach(el => {
        const style = getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Check for non-brand colors that might be hardcoded
        if (color && color !== 'rgba(0, 0, 0, 0)' && !brandColors.some((bc: string) => color.includes(bc))) {
          // Only flag if it's not a common browser default
          if (!color.includes('rgb(0, 0, 0)') && !color.includes('inherit')) {
            issues.push({
              element: el.tagName.toLowerCase(),
              property: 'color',
              value: color,
              selector: el.className ? '.' + el.className.replace(/\s+/g, '.') : el.tagName
            });
          }
        }
      });
      
      return issues;
    }, BRAND_COLOR_VARIANTS);

    return colorUsage.map(issue => ({
      type: 'color-violation' as const,
      severity: 'warning' as const,
      message: `Non-brand color detected: ${issue.value}`,
      element: issue.selector,
      actual: issue.value
    }));
  }

  async checkTypographyConsistency(): Promise<VisualIssue[]> {
    const fontIssues = await this.page.evaluate((expectedFont) => {
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button');
      const issues: any[] = [];
      
      textElements.forEach(el => {
        const style = getComputedStyle(el);
        const fontFamily = style.fontFamily.toLowerCase();
        
        // Check if Inter font is being used
        if (!fontFamily.includes('inter') && !fontFamily.includes('sans-serif')) {
          issues.push({
            element: el.tagName.toLowerCase(),
            selector: el.className ? '.' + el.className.replace(/\s+/g, '.') : el.tagName,
            expected: 'Inter, sans-serif',
            actual: style.fontFamily
          });
        }
      });
      
      return issues;
    }, SUMMIT_CHRONICLES_BRAND_CONFIG.typography.fontFamily);

    return fontIssues.map(issue => ({
      type: 'typography-issue' as const,
      severity: 'warning' as const,
      message: `Non-brand font detected: ${issue.actual}`,
      element: issue.selector,
      expected: issue.expected,
      actual: issue.actual
    }));
  }

  async checkLayoutProblems(): Promise<VisualIssue[]> {
    const layoutIssues = await this.page.evaluate(() => {
      const issues: any[] = [];
      
      // Check for horizontal scroll
      if (document.documentElement.scrollWidth > document.documentElement.clientWidth) {
        issues.push({
          type: 'horizontal-scroll',
          message: 'Page has horizontal scroll which may indicate layout problems'
        });
      }
      
      // Check for elements that might be cut off
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth && rect.width > 0) {
          issues.push({
            type: 'element-overflow',
            element: el.tagName.toLowerCase(),
            selector: el.className ? '.' + el.className.replace(/\s+/g, '.') : el.tagName,
            message: `Element extends beyond viewport width`
          });
        }
      });
      
      return issues;
    });

    return layoutIssues.map(issue => ({
      type: 'layout-problem' as const,
      severity: issue.type === 'horizontal-scroll' ? 'critical' as const : 'warning' as const,
      message: issue.message,
      element: issue.selector
    }));
  }

  async performFullVisualInspection(): Promise<VisualIssue[]> {
    const [brokenImages, colorIssues, fontIssues, layoutIssues] = await Promise.all([
      this.checkBrokenImages(),
      this.checkBrandColorCompliance(), 
      this.checkTypographyConsistency(),
      this.checkLayoutProblems()
    ]);

    return [...brokenImages, ...colorIssues, ...fontIssues, ...layoutIssues];
  }
}