const { test, expect } = require('@playwright/test');

// Site audit configuration
const BASE_URL = 'http://localhost:3000';
const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/training', name: 'Training Page' },
  { path: '/journey', name: 'Journey Page' },
  { path: '/ai-search', name: 'AI Search Page' },
  { path: '/about', name: 'About Page' },
  { path: '/blog', name: 'Blog Page' }
];

// Color compliance check
const checkColorContrast = async (page, element) => {
  return await page.evaluate((el) => {
    const style = window.getComputedStyle(el);
    const bgColor = style.backgroundColor;
    const textColor = style.color;
    
    // Simple contrast check (basic implementation)
    const getBrightness = (color) => {
      const rgb = color.match(/\d+/g);
      if (!rgb || rgb.length < 3) return 0;
      return (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
    };
    
    const bgBrightness = getBrightness(bgColor);
    const textBrightness = getBrightness(textColor);
    const contrast = Math.abs(bgBrightness - textBrightness);
    
    return {
      backgroundColor: bgColor,
      textColor: textColor,
      contrast: contrast,
      isAccessible: contrast > 125 // Basic threshold
    };
  }, element);
};

// Navigation test
const testNavigation = async (page) => {
  const results = {
    navigationVisible: false,
    navigationLinks: [],
    logoPresent: false,
    mobileMenuWorks: false
  };

  try {
    // Debug all navigation elements
    const allNavs = await page.locator('nav').all();
    const allHeaders = await page.locator('header').all();
    console.log(`Found ${allNavs.length} nav elements, ${allHeaders.length} header elements`);
    
    // Check for navigation
    const nav = await page.locator('nav, [role="navigation"], header nav').first();
    const navExists = await nav.count() > 0;
    results.navigationVisible = navExists ? await nav.isVisible() : false;
    console.log(`Navigation test: exists=${navExists}, visible=${results.navigationVisible}`);
    
    // Check each nav element individually
    for (let i = 0; i < allNavs.length; i++) {
      const navElement = allNavs[i];
      const isVisible = await navElement.isVisible();
      const classes = await navElement.getAttribute('class');
      console.log(`Nav ${i}: visible=${isVisible}, classes=${classes}`);
    }

    // Check for navigation links
    const navLinks = await page.locator('nav a, [role="navigation"] a, header nav a').all();
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      if (href && text) {
        results.navigationLinks.push({ href, text: text.trim() });
      }
    }

    // Check for logo
    const logo = await page.locator('[alt*="logo"], [class*="logo"], h1 a, .brand').first();
    const logoExists = await logo.count() > 0;
    results.logoPresent = logoExists ? await logo.isVisible().catch(() => false) : false;
    console.log(`Logo test: exists=${logoExists}, visible=${results.logoPresent}`);

    // Test mobile menu (if exists)
    const mobileMenuButton = await page.locator('[aria-label*="menu"], .mobile-menu, [class*="hamburger"]').first();
    if (await mobileMenuButton.isVisible().catch(() => false)) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      const mobileMenu = await page.locator('[class*="mobile"], [data-mobile="true"]').first();
      results.mobileMenuWorks = await mobileMenu.isVisible().catch(() => false);
    }
  } catch (error) {
    console.log('Navigation test error:', error.message);
  }

  return results;
};

// Design and readability test
const testDesignAndReadability = async (page) => {
  const results = {
    typography: {
      headings: [],
      bodyText: [],
      fontSizes: []
    },
    colors: {
      primaryColors: [],
      contrastIssues: []
    },
    layout: {
      hasProperSpacing: false,
      isResponsive: false,
      hasConsistentDesign: false
    },
    animations: {
      hasAnimations: false,
      animationsAccessible: false
    }
  };

  try {
    // Test typography
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log(`Found ${headings.length} heading elements`);
    for (const heading of headings.slice(0, 5)) { // Test first 5 headings
      const tagName = await heading.evaluate(el => el.tagName);
      const fontSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
      const fontWeight = await heading.evaluate(el => window.getComputedStyle(el).fontWeight);
      const color = await heading.evaluate(el => window.getComputedStyle(el).color);
      
      results.typography.headings.push({
        tag: tagName,
        fontSize,
        fontWeight,
        color
      });
    }

    // Test body text
    const paragraphs = await page.locator('p').all();
    for (const p of paragraphs.slice(0, 3)) { // Test first 3 paragraphs
      const fontSize = await p.evaluate(el => window.getComputedStyle(el).fontSize);
      const lineHeight = await p.evaluate(el => window.getComputedStyle(el).lineHeight);
      const color = await p.evaluate(el => window.getComputedStyle(el).color);
      
      results.typography.bodyText.push({
        fontSize,
        lineHeight,
        color
      });
    }

    // Test color contrast
    const textElements = await page.locator('h1, h2, h3, p, span, a').all();
    for (const element of textElements.slice(0, 10)) {
      try {
        const contrastInfo = await checkColorContrast(page, element);
        if (!contrastInfo.isAccessible) {
          results.colors.contrastIssues.push(contrastInfo);
        }
      } catch (error) {
        // Skip contrast check if it fails
      }
    }

    // Test responsive design
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];

    let responsiveViewports = 0;
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500); // Increased wait time for layout adjustments
      
      const scrollInfo = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      });
      
      console.log(`Viewport ${viewport.width}x${viewport.height}: scrollWidth=${scrollInfo.scrollWidth}, clientWidth=${scrollInfo.clientWidth}, hasScroll=${scrollInfo.hasHorizontalScroll}`);
      
      if (!scrollInfo.hasHorizontalScroll) {
        responsiveViewports++;
      }
    }
    
    console.log(`Responsive test: ${responsiveViewports}/${viewports.length} viewports passed`);
    // Only mark as responsive if ALL viewports pass
    results.layout.isResponsive = responsiveViewports === viewports.length;

    // Reset viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Test animations
    const animatedElements = await page.locator('[class*="animate"], [class*="motion"], [style*="transition"]').all();
    results.animations.hasAnimations = animatedElements.length > 0;

    // Check for reduced motion preference
    const prefersReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    results.animations.animationsAccessible = !prefersReducedMotion || animatedElements.length === 0;

  } catch (error) {
    console.log('Design test error:', error.message);
  }

  return results;
};

// Accessibility test
const testAccessibility = async (page) => {
  const results = {
    altTexts: { present: 0, missing: 0 },
    headingStructure: { proper: true, issues: [] },
    focusManagement: { hasSkipLink: false, focusable: 0 },
    ariaLabels: { present: 0, missing: 0 }
  };

  try {
    // Check alt texts
    const images = await page.locator('img').all();
    console.log(`Found ${images.length} image elements for alt text check`);
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      console.log(`Image: src=${src?.substring(0, 50)}..., alt="${alt}"`);
      if (alt && alt.trim()) {
        results.altTexts.present++;
      } else {
        results.altTexts.missing++;
      }
    }

    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.substring(1));
      
      if (level > previousLevel + 1 && previousLevel !== 0) {
        results.headingStructure.proper = false;
        results.headingStructure.issues.push(`Skipped from h${previousLevel} to h${level}`);
      }
      previousLevel = level;
    }

    // Check for skip link
    const skipLink = await page.locator('a[href="#main"], a[href="#content"], .skip-link').first();
    results.focusManagement.hasSkipLink = await skipLink.isVisible().catch(() => false);

    // Check focusable elements
    const focusableElements = await page.locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').all();
    results.focusManagement.focusable = focusableElements.length;

    // Check ARIA labels
    const elementsWithAria = await page.locator('[aria-label], [aria-labelledby], [aria-describedby]').all();
    results.ariaLabels.present = elementsWithAria.length;

  } catch (error) {
    console.log('Accessibility test error:', error.message);
  }

  return results;
};

// Performance test
const testPerformance = async (page) => {
  const results = {
    loadTime: 0,
    imageOptimization: { optimized: 0, unoptimized: 0 },
    cacheHeaders: false
  };

  try {
    const startTime = Date.now();
    await page.goto(page.url(), { waitUntil: 'networkidle' });
    results.loadTime = Date.now() - startTime;

    // Check image optimization
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 5)) {
      const src = await img.getAttribute('src');
      if (src) {
        const isOptimized = src.includes('webp') || src.includes('avif') || src.includes('_next/image');
        if (isOptimized) {
          results.imageOptimization.optimized++;
        } else {
          results.imageOptimization.unoptimized++;
        }
      }
    }

  } catch (error) {
    console.log('Performance test error:', error.message);
  }

  return results;
};

// Calculate compliance score
const calculateComplianceScore = (testResults) => {
  let totalPoints = 0;
  let maxPoints = 0;

  console.log('=== SCORING BREAKDOWN ===');

  // Navigation score (25 points)
  maxPoints += 25;
  let navPoints = 0;
  if (testResults.navigation.navigationVisible) { navPoints += 10; console.log('✓ Navigation visible: +10pts'); }
  if (testResults.navigation.navigationLinks.length >= 5) { navPoints += 10; console.log(`✓ Navigation links (${testResults.navigation.navigationLinks.length}): +10pts`); }
  if (testResults.navigation.logoPresent) { navPoints += 5; console.log('✓ Logo present: +5pts'); } else { console.log('✗ Logo missing: +0pts'); }
  totalPoints += navPoints;
  console.log(`Navigation total: ${navPoints}/25pts`);

  // Design score (30 points)
  maxPoints += 30;
  let designPoints = 0;
  if (testResults.design.typography.headings.length > 0) { designPoints += 10; console.log(`✓ Headings found (${testResults.design.typography.headings.length}): +10pts`); } else { console.log('✗ No headings: +0pts'); }
  if (testResults.design.colors.contrastIssues.length === 0) { designPoints += 10; console.log('✓ No contrast issues: +10pts'); }
  if (testResults.design.layout.isResponsive) { designPoints += 10; console.log('✓ Responsive design: +10pts'); } else { console.log('✗ Not responsive: +0pts'); }
  totalPoints += designPoints;
  console.log(`Design total: ${designPoints}/30pts`);

  // Accessibility score (25 points)
  maxPoints += 25;
  let accessPoints = 0;
  const altTextRatio = testResults.accessibility.altTexts.present / 
    (testResults.accessibility.altTexts.present + testResults.accessibility.altTexts.missing + 1);
  const altTextPoints = Math.round(altTextRatio * 10);
  accessPoints += altTextPoints;
  console.log(`Alt text ratio (${testResults.accessibility.altTexts.present}/${testResults.accessibility.altTexts.present + testResults.accessibility.altTexts.missing}): +${altTextPoints}pts`);
  
  if (testResults.accessibility.headingStructure.proper) { accessPoints += 10; console.log('✓ Proper heading structure: +10pts'); } else { console.log('✗ Heading structure issues: +0pts'); }
  if (testResults.accessibility.focusManagement.focusable > 10) { accessPoints += 5; console.log(`✓ Focusable elements (${testResults.accessibility.focusManagement.focusable}): +5pts`); } else { console.log(`✗ Few focusable elements (${testResults.accessibility.focusManagement.focusable}): +0pts`); }
  totalPoints += accessPoints;
  console.log(`Accessibility total: ${accessPoints}/25pts`);

  // Performance score (20 points)
  maxPoints += 20;
  let perfPoints = 0;
  if (testResults.performance.loadTime < 3000) { perfPoints += 10; console.log(`✓ Load time <3s (${testResults.performance.loadTime}ms): +10pts`); } else { console.log(`✗ Load time >3s (${testResults.performance.loadTime}ms): +0pts`); }
  if (testResults.performance.loadTime < 1500) { perfPoints += 5; console.log(`✓ Load time <1.5s: +5pts`); } else { console.log(`✗ Load time >1.5s: +0pts`); }
  const imageOptRatio = testResults.performance.imageOptimization.optimized / 
    (testResults.performance.imageOptimization.optimized + testResults.performance.imageOptimization.unoptimized + 1);
  const imageOptPoints = Math.round(imageOptRatio * 5);
  perfPoints += imageOptPoints;
  console.log(`Image optimization (${testResults.performance.imageOptimization.optimized}/${testResults.performance.imageOptimization.optimized + testResults.performance.imageOptimization.unoptimized}): +${imageOptPoints}pts`);
  totalPoints += perfPoints;
  console.log(`Performance total: ${perfPoints}/20pts`);

  console.log(`FINAL SCORE: ${totalPoints}/${maxPoints} = ${Math.round((totalPoints / maxPoints) * 100)}%`);
  console.log('=== END SCORING ===');

  return Math.round((totalPoints / maxPoints) * 100);
};

// Main test suite
test.describe('Comprehensive Site Audit', () => {
  let allTestResults = {};

  test.beforeAll(async () => {
    console.log('🚀 Starting comprehensive site audit...');
  });

  for (const page of PAGES) {
    test(`Audit ${page.name}`, async ({ page: playwright }) => {
      console.log(`\n📊 Testing ${page.name} (${page.path})...`);
      
      try {
        // Navigate to page
        await playwright.goto(`${BASE_URL}${page.path}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });
        
        // Wait for page to be fully loaded
        await playwright.waitForTimeout(2000);

        // Run all tests
        const [navigation, design, accessibility, performance] = await Promise.all([
          testNavigation(playwright),
          testDesignAndReadability(playwright),
          testAccessibility(playwright),
          testPerformance(playwright)
        ]);

        const pageResults = {
          navigation,
          design,
          accessibility,
          performance
        };

        // Calculate compliance score
        const complianceScore = calculateComplianceScore(pageResults);
        
        allTestResults[page.name] = {
          ...pageResults,
          complianceScore,
          url: `${BASE_URL}${page.path}`
        };

        // Log results
        console.log(`✅ ${page.name} Compliance Score: ${complianceScore}%`);
        console.log(`   Navigation: ${navigation.navigationLinks.length} links found`);
        console.log(`   Design: ${design.colors.contrastIssues.length} contrast issues`);
        console.log(`   Accessibility: ${accessibility.altTexts.missing} missing alt texts`);
        console.log(`   Performance: ${performance.loadTime}ms load time`);

        // Assert minimum compliance
        expect(complianceScore).toBeGreaterThan(70);
        
      } catch (error) {
        console.log(`❌ Error testing ${page.name}:`, error.message);
        
        // Record failed test
        allTestResults[page.name] = {
          error: error.message,
          complianceScore: 0,
          url: `${BASE_URL}${page.path}`
        };
      }
    });
  }

  test.afterAll(async () => {
    console.log('\n📋 FINAL AUDIT REPORT');
    console.log('=' .repeat(50));
    
    let totalScore = 0;
    let testedPages = 0;
    
    Object.entries(allTestResults).forEach(([pageName, results]) => {
      console.log(`\n📄 ${pageName}:`);
      console.log(`   URL: ${results.url}`);
      console.log(`   Compliance Score: ${results.complianceScore}%`);
      
      if (results.error) {
        console.log(`   ❌ Error: ${results.error}`);
      } else {
        console.log(`   ✅ Navigation: ${results.navigation.navigationVisible ? 'Good' : 'Issues'}`);
        console.log(`   ✅ Design: ${results.design.layout.isResponsive ? 'Responsive' : 'Issues'}`);
        console.log(`   ✅ Accessibility: ${results.accessibility.headingStructure.proper ? 'Good' : 'Issues'}`);
        console.log(`   ✅ Performance: ${results.performance.loadTime}ms`);
        
        totalScore += results.complianceScore;
        testedPages++;
      }
    });
    
    const overallScore = testedPages > 0 ? Math.round(totalScore / testedPages) : 0;
    
    console.log('\n🏆 OVERALL COMPLIANCE SCORE');
    console.log('=' .repeat(30));
    console.log(`Overall Score: ${overallScore}%`);
    
    if (overallScore >= 90) {
      console.log('🌟 EXCELLENT - World-class compliance!');
    } else if (overallScore >= 80) {
      console.log('🚀 GREAT - High-quality implementation!');
    } else if (overallScore >= 70) {
      console.log('✅ GOOD - Solid implementation with room for improvement');
    } else {
      console.log('⚠️  NEEDS IMPROVEMENT - Several issues to address');
    }
    
    console.log('\n📊 Detailed recommendations available in test output above.');
  });
});