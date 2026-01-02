import { test, expect } from '@playwright/test';

/**
 * Comprehensive UI/UX Analysis Suite
 *
 * This test suite specifically analyzes UI/UX issues including:
 * - White space and layout problems
 * - Readability and spacing issues
 * - Mobile-specific design problems
 * - Content alignment and flow
 */

const PAGES_TO_ANALYZE = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About Page' },
  { path: '/blog', name: 'Stories/Blog Page' },
  { path: '/training', name: 'Training Page' },
  { path: '/expeditions', name: 'Expeditions Page' }
];

test.describe('UI/UX Analysis Suite', () => {

  test.describe('White Space and Layout Analysis', () => {

    test('Analyze Stories/Blog page white space issues', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');

      console.log('🧪 Analyzing Stories/Blog Page Layout...');

      // Measure page dimensions and content distribution
      const layoutAnalysis = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;

        const pageHeight = Math.max(
          body.scrollHeight, body.offsetHeight,
          html.clientHeight, html.scrollHeight, html.offsetHeight
        );

        const viewportHeight = window.innerHeight;
        const contentSections = Array.from(document.querySelectorAll('section, main, .container'));

        // Analyze each section for empty space
        const sectionAnalysis = contentSections.map(section => {
          const rect = section.getBoundingClientRect();
          const styles = window.getComputedStyle(section);
          const isEmpty = section.textContent?.trim().length === 0;

          return {
            tagName: section.tagName,
            className: section.className,
            height: rect.height,
            paddingTop: parseFloat(styles.paddingTop),
            paddingBottom: parseFloat(styles.paddingBottom),
            marginTop: parseFloat(styles.marginTop),
            marginBottom: parseFloat(styles.marginBottom),
            isEmpty: isEmpty,
            textLength: section.textContent?.trim().length || 0,
            hasChildren: section.children.length > 0
          };
        });

        // Find sections with excessive white space
        const excessiveWhiteSpace = sectionAnalysis.filter(section => {
          const totalSpacing = section.paddingTop + section.paddingBottom + section.marginTop + section.marginBottom;
          return totalSpacing > 200 || (section.height > 300 && section.textLength < 50);
        });

        return {
          pageHeight,
          viewportHeight,
          totalSections: sectionAnalysis.length,
          excessiveWhiteSpace,
          sectionAnalysis: sectionAnalysis.slice(0, 10) // Limit output
        };
      });

      console.log('📊 Stories Page Layout Analysis:', layoutAnalysis);

      // Check for excessive white space at bottom
      const bottomWhiteSpace = await page.evaluate(() => {
        const body = document.body;
        const lastElement = body.lastElementChild;
        if (!lastElement) return { hasIssue: false };

        const lastElementRect = lastElement.getBoundingClientRect();
        const bodyHeight = body.scrollHeight;
        const bottomSpace = bodyHeight - (lastElementRect.bottom + window.scrollY);

        return {
          hasIssue: bottomSpace > 200,
          bottomSpace,
          bodyHeight,
          lastElementBottom: lastElementRect.bottom + window.scrollY
        };
      });

      console.log('📏 Bottom White Space Analysis:', bottomWhiteSpace);

      // Log issues found
      if (layoutAnalysis.excessiveWhiteSpace.length > 0) {
        console.log('⚠️ EXCESSIVE WHITE SPACE FOUND:');
        layoutAnalysis.excessiveWhiteSpace.forEach(section => {
          console.log(`  - ${section.tagName}.${section.className}: ${section.height}px height, spacing: ${section.paddingTop + section.paddingBottom + section.marginTop + section.marginBottom}px`);
        });
      }

      if (bottomWhiteSpace.hasIssue) {
        console.log(`⚠️ BOTTOM WHITE SPACE ISSUE: ${bottomWhiteSpace.bottomSpace}px excessive space at bottom`);
      }

      expect(layoutAnalysis.totalSections).toBeGreaterThan(0);
    });

    test('Analyze About page spacing and readability issues', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/about');
      await page.waitForLoadState('networkidle');

      console.log('🧪 Analyzing About Page Readability & Spacing...');

      const readabilityAnalysis = await page.evaluate(() => {
        const issues: Array<{
          type: string,
          element: string,
          fontSize?: number,
          lineHeight?: number,
          issue?: string,
          text?: string,
          ratio?: number,
          width?: number,
          height?: number
        }> = [];

        // Check text contrast and readability
        const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div'))
          .filter(el => el.textContent && el.textContent.trim().length > 10);

        textElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const fontSize = parseFloat(styles.fontSize);
          const lineHeight = parseFloat(styles.lineHeight);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          const rect = el.getBoundingClientRect();

          // Check font size
          if (fontSize < 14) {
            issues.push({
              type: 'small-font',
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              fontSize,
              text: el.textContent?.substring(0, 50) + '...'
            });
          }

          // Check line height for readability
          if (lineHeight < fontSize * 1.2) {
            issues.push({
              type: 'poor-line-height',
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              fontSize,
              lineHeight,
              ratio: lineHeight / fontSize
            });
          }

          // Check for text overlapping issues
          if (rect.width === 0 || rect.height === 0) {
            issues.push({
              type: 'invisible-text',
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              width: rect.width,
              height: rect.height
            });
          }
        });

        // Check spacing between sections
        const sections = Array.from(document.querySelectorAll('section'));
        const spacingIssues = [];

        for (let i = 0; i < sections.length - 1; i++) {
          const current = sections[i];
          const next = sections[i + 1];

          const currentRect = current.getBoundingClientRect();
          const nextRect = next.getBoundingClientRect();
          const gap = nextRect.top - currentRect.bottom;

          if (gap < 20) {
            spacingIssues.push({
              type: 'insufficient-spacing',
              section1: current.className || 'section',
              section2: next.className || 'section',
              gap
            });
          } else if (gap > 200) {
            spacingIssues.push({
              type: 'excessive-spacing',
              section1: current.className || 'section',
              section2: next.className || 'section',
              gap
            });
          }
        }

        // Check for overlapping elements
        const overlappingElements = [];
        const allVisibleElements = Array.from(document.querySelectorAll('*'))
          .filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          })
          .slice(0, 50); // Limit to prevent performance issues

        for (let i = 0; i < allVisibleElements.length; i++) {
          for (let j = i + 1; j < allVisibleElements.length; j++) {
            const el1 = allVisibleElements[i];
            const el2 = allVisibleElements[j];

            // Skip if one is a child of the other
            if (el1.contains(el2) || el2.contains(el1)) continue;

            const rect1 = el1.getBoundingClientRect();
            const rect2 = el2.getBoundingClientRect();

            // Check if rectangles overlap
            const overlap = !(rect1.right < rect2.left ||
                            rect2.right < rect1.left ||
                            rect1.bottom < rect2.top ||
                            rect2.bottom < rect1.top);

            if (overlap) {
              overlappingElements.push({
                element1: el1.tagName + (el1.className ? '.' + el1.className.split(' ')[0] : ''),
                element2: el2.tagName + (el2.className ? '.' + el2.className.split(' ')[0] : ''),
                overlap: {
                  el1: { top: rect1.top, bottom: rect1.bottom, left: rect1.left, right: rect1.right },
                  el2: { top: rect2.top, bottom: rect2.bottom, left: rect2.left, right: rect2.right }
                }
              });
            }
          }
        }

        return {
          textIssues: issues,
          spacingIssues,
          overlappingElements: overlappingElements.slice(0, 5) // Limit output
        };
      });

      console.log('📖 About Page Readability Analysis:');
      console.log('  Text Issues:', readabilityAnalysis.textIssues.length);
      console.log('  Spacing Issues:', readabilityAnalysis.spacingIssues.length);
      console.log('  Overlapping Elements:', readabilityAnalysis.overlappingElements.length);

      if (readabilityAnalysis.textIssues.length > 0) {
        console.log('⚠️ TEXT ISSUES FOUND:');
        readabilityAnalysis.textIssues.slice(0, 5).forEach(issue => {
          console.log(`  - ${issue.type}: ${issue.element} - ${JSON.stringify(issue)}`);
        });
      }

      if (readabilityAnalysis.spacingIssues.length > 0) {
        console.log('⚠️ SPACING ISSUES FOUND:');
        readabilityAnalysis.spacingIssues.slice(0, 5).forEach(issue => {
          console.log(`  - ${issue.type}: ${issue.gap}px between ${issue.section1} and ${issue.section2}`);
        });
      }

      if (readabilityAnalysis.overlappingElements.length > 0) {
        console.log('⚠️ OVERLAPPING ELEMENTS FOUND:');
        readabilityAnalysis.overlappingElements.forEach(overlap => {
          console.log(`  - ${overlap.element1} overlaps with ${overlap.element2}`);
        });
      }

      expect(readabilityAnalysis.textIssues.length).toBeLessThan(10);
    });
  });

  test.describe('Mobile-Specific UI Issues', () => {

    PAGES_TO_ANALYZE.forEach(pageInfo => {
      test(`Mobile UI analysis for ${pageInfo.name}`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');

        console.log(`🧪 Analyzing ${pageInfo.name} Mobile UI...`);

        const mobileUIAnalysis = await page.evaluate(() => {
          const issues = [];

          // Check viewport fit
          const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth + 5;
          if (hasHorizontalScroll) {
            issues.push({
              type: 'horizontal-scroll',
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth
            });
          }

          // Check for mobile-unfriendly elements
          const smallClickableElements = Array.from(document.querySelectorAll('a, button, input, [onclick]'))
            .filter(el => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
            })
            .map(el => ({
              element: el.tagName + (el.className ? '.' + el.className.split(' ')[0] : ''),
              width: el.getBoundingClientRect().width,
              height: el.getBoundingClientRect().height,
              text: el.textContent?.substring(0, 20) || 'No text'
            }));

          // Check for images that are too large
          const oversizedImages = Array.from(document.querySelectorAll('img'))
            .filter(img => {
              const rect = img.getBoundingClientRect();
              return rect.width > window.innerWidth * 1.1; // 10% tolerance
            })
            .map(img => ({
              src: img.src?.substring(0, 50) + '...',
              width: img.getBoundingClientRect().width,
              viewportWidth: window.innerWidth
            }));

          // Check content density
          const viewportHeight = window.innerHeight;
          const bodyHeight = document.body.scrollHeight;
          const contentDensity = bodyHeight / viewportHeight;

          // Check for empty sections
          const emptySections = Array.from(document.querySelectorAll('section, div'))
            .filter(section => {
              const hasVisibleContent = section.textContent?.trim().length > 0 ||
                                      section.querySelectorAll('img, video, canvas').length > 0;
              const rect = section.getBoundingClientRect();
              return !hasVisibleContent && rect.height > 100;
            })
            .map(section => ({
              element: section.tagName + (section.className ? '.' + section.className.split(' ')[0] : ''),
              height: section.getBoundingClientRect().height
            }));

          return {
            issues,
            smallClickableElements,
            oversizedImages,
            contentDensity,
            emptySections,
            pageMetrics: {
              viewportHeight,
              bodyHeight,
              hasHorizontalScroll
            }
          };
        });

        console.log(`📱 ${pageInfo.name} Mobile Analysis Results:`);
        console.log(`   Content Density: ${mobileUIAnalysis.contentDensity.toFixed(2)}x viewport height`);
        console.log(`   Small Touch Targets: ${mobileUIAnalysis.smallClickableElements.length}`);
        console.log(`   Oversized Images: ${mobileUIAnalysis.oversizedImages.length}`);
        console.log(`   Empty Sections: ${mobileUIAnalysis.emptySections.length}`);
        console.log(`   General Issues: ${mobileUIAnalysis.issues.length}`);

        if (mobileUIAnalysis.smallClickableElements.length > 0) {
          console.log('👆 SMALL TOUCH TARGETS:');
          mobileUIAnalysis.smallClickableElements.slice(0, 3).forEach(target => {
            console.log(`   - ${target.element}: ${target.width}x${target.height}px - "${target.text}"`);
          });
        }

        if (mobileUIAnalysis.emptySections.length > 0) {
          console.log('🕳️ EMPTY SECTIONS:');
          mobileUIAnalysis.emptySections.forEach(section => {
            console.log(`   - ${section.element}: ${section.height}px height`);
          });
        }

        if (mobileUIAnalysis.contentDensity > 10) {
          console.log(`⚠️ VERY LONG PAGE: ${mobileUIAnalysis.contentDensity.toFixed(2)}x viewport height - may have white space issues`);
        }

        expect(mobileUIAnalysis.pageMetrics.hasHorizontalScroll).toBe(false);
      });
    });
  });

  test.describe('Content Flow Analysis', () => {

    test('Analyze content hierarchy and flow', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/about');
      await page.waitForLoadState('networkidle');

      console.log('🧪 Analyzing Content Flow and Hierarchy...');

      const contentFlowAnalysis = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const headingAnalysis = headings.map(heading => {
          const level = parseInt(heading.tagName.substring(1));
          const rect = heading.getBoundingClientRect();
          const styles = window.getComputedStyle(heading);

          return {
            level,
            text: heading.textContent?.substring(0, 50) + '...',
            fontSize: parseFloat(styles.fontSize),
            position: rect.top + window.scrollY,
            visible: rect.width > 0 && rect.height > 0
          };
        });

        // Check heading hierarchy
        const hierarchyIssues = [];
        for (let i = 0; i < headingAnalysis.length - 1; i++) {
          const current = headingAnalysis[i];
          const next = headingAnalysis[i + 1];

          // Check if heading levels skip (e.g., h1 to h3)
          if (next.level > current.level + 1) {
            hierarchyIssues.push({
              type: 'skipped-level',
              from: `h${current.level}`,
              to: `h${next.level}`,
              position: next.position
            });
          }
        }

        // Check visual hierarchy (font sizes should generally decrease with heading level)
        const visualHierarchyIssues: Array<{
          type: string,
          heading: string,
          fontSize: number,
          issue: string,
          shouldBeSmallerThan?: string,
          comparisonFontSize?: number
        }> = [];
        headingAnalysis.forEach((heading, index) => {
          const previousHeadings = headingAnalysis.slice(0, index);
          const lowerLevelHeadings = previousHeadings.filter(h => h.level < heading.level);

          lowerLevelHeadings.forEach(lowerHeading => {
            if (heading.fontSize >= lowerHeading.fontSize) {
              visualHierarchyIssues.push({
                type: 'inverted-visual-hierarchy',
                heading: `h${heading.level}`,
                fontSize: heading.fontSize,
                issue: 'Inverted visual hierarchy',
                shouldBeSmallerThan: `h${lowerHeading.level}`,
                comparisonFontSize: lowerHeading.fontSize
              });
            }
          });
        });

        return {
          totalHeadings: headingAnalysis.length,
          headingAnalysis,
          hierarchyIssues,
          visualHierarchyIssues
        };
      });

      console.log('📋 Content Hierarchy Analysis:');
      console.log(`   Total Headings: ${contentFlowAnalysis.totalHeadings}`);
      console.log(`   Hierarchy Issues: ${contentFlowAnalysis.hierarchyIssues.length}`);
      console.log(`   Visual Hierarchy Issues: ${contentFlowAnalysis.visualHierarchyIssues.length}`);

      if (contentFlowAnalysis.hierarchyIssues.length > 0) {
        console.log('⚠️ HEADING HIERARCHY ISSUES:');
        contentFlowAnalysis.hierarchyIssues.forEach(issue => {
          console.log(`   - ${issue.type}: ${issue.from} → ${issue.to} at position ${issue.position}`);
        });
      }

      if (contentFlowAnalysis.visualHierarchyIssues.length > 0) {
        console.log('⚠️ VISUAL HIERARCHY ISSUES:');
        contentFlowAnalysis.visualHierarchyIssues.slice(0, 3).forEach(issue => {
          console.log(`   - ${issue.heading} (${issue.fontSize}px) should be smaller than ${issue.shouldBeSmallerThan} (${issue.comparisonFontSize}px)`);
        });
      }

      expect(contentFlowAnalysis.totalHeadings).toBeGreaterThan(0);
    });
  });

  test('Generate comprehensive UI/UX report', async ({ page }) => {
    console.log('\n📊 COMPREHENSIVE UI/UX ANALYSIS COMPLETE');
    console.log('=' .repeat(60));
    console.log('Review the detailed output above for specific issues found.');
    console.log('Focus areas:');
    console.log('- Stories page: White space and layout issues');
    console.log('- About page: Readability and spacing problems');
    console.log('- All pages: Mobile touch targets and responsiveness');
    console.log('- Content flow: Heading hierarchy and visual design');
    console.log('=' .repeat(60));

    // This test always passes - it's for reporting
    expect(true).toBe(true);
  });
});
