import { test, expect, Page } from '@playwright/test';
import { VisualInspector } from './lib/visual-inspector';
import { ConsoleMonitor } from './lib/console-monitor';
import { ResponsiveTester } from './lib/responsive-tester';
import { ReportGenerator, DesignReviewReport } from './lib/report-generator';
import * as fs from 'fs';
import * as path from 'path';

export class DesignReviewer {
  private visualInspector: VisualInspector;
  private consoleMonitor: ConsoleMonitor;
  private responsiveTester: ResponsiveTester;
  private reportGenerator: ReportGenerator;

  constructor(private page: Page) {
    this.visualInspector = new VisualInspector(page);
    this.consoleMonitor = new ConsoleMonitor(page);
    this.responsiveTester = new ResponsiveTester(page);
    this.reportGenerator = new ReportGenerator();
  }

  async reviewSite(url: string): Promise<DesignReviewReport> {
    const startTime = Date.now();

    console.log(`🔍 Starting design review for: ${url}`);

    // Ensure screenshots directory exists
    const screenshotDir = path.join(__dirname, 'reports', 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    try {
      // Navigate to the site
      console.log('📄 Loading page...');
      await this.page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for any initial loading
      await this.page.waitForTimeout(2000);

      // Take full page screenshot
      await this.page.screenshot({ 
        path: path.join(screenshotDir, 'full-page.png'),
        fullPage: true 
      });

      console.log('👀 Running visual inspection...');
      // Run visual inspection
      const visualIssues = await this.visualInspector.performFullVisualInspection();

      console.log('🖥️ Checking console health...');
      // Check console errors
      const consoleErrors = await this.consoleMonitor.getAllErrors();

      console.log('📱 Testing responsive design...');
      // Test responsive design
      const responsiveResults = await this.responsiveTester.testAllViewports();

      console.log('📊 Generating report...');
      // Generate comprehensive report
      const report = this.reportGenerator.generateReport(
        url,
        visualIssues,
        consoleErrors,
        responsiveResults,
        startTime
      );

      // Save reports
      const reportsDir = path.join(__dirname, 'reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportFileName = `design-review-${timestamp}`;

      // Save JSON report
      fs.writeFileSync(
        path.join(reportsDir, `${reportFileName}.json`),
        JSON.stringify(report, null, 2)
      );

      // Save HTML report
      const htmlReport = this.reportGenerator.generateHTMLReport(report);
      fs.writeFileSync(
        path.join(reportsDir, `${reportFileName}.html`),
        htmlReport
      );

      console.log(`✅ Design review complete! Overall score: ${report.summary.overallScore}/100`);
      console.log(`📁 Reports saved to: ${reportsDir}`);
      console.log(`   - JSON: ${reportFileName}.json`);
      console.log(`   - HTML: ${reportFileName}.html`);

      // Print summary
      this.printSummary(report);

      return report;

    } catch (error) {
      console.error('❌ Design review failed:', error);
      throw error;
    }
  }

  private printSummary(report: DesignReviewReport) {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 DESIGN REVIEW SUMMARY');
    console.log('='.repeat(60));
    console.log(`Overall Score: ${report.summary.overallScore}/100`);
    console.log(`Total Issues: ${report.summary.totalIssues} (${report.summary.criticalIssues} critical, ${report.summary.warningIssues} warnings)`);
    
    console.log(`\n📊 Category Scores:`);
    console.log(`  Visual Quality: ${report.visualQuality.score}/100`);
    console.log(`  Console Health: ${report.console.score}/100`);
    console.log(`  Responsive Design: ${report.responsive.score}/100`);

    if (report.recommendations.length > 0) {
      console.log(`\n🚀 Top Recommendations:`);
      report.recommendations.slice(0, 3).forEach((rec, i) => {
        console.log(`  ${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
      });
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }
}

// Playwright test integration
export function createDesignReviewTest(url: string = 'http://localhost:3000') {
  test(`Design Review: ${url}`, async ({ page }) => {
    const reviewer = new DesignReviewer(page);
    const report = await reviewer.reviewSite(url);
    
    // Add test assertions based on your quality standards
    expect(report.summary.overallScore).toBeGreaterThan(70); // Minimum acceptable score
    expect(report.summary.criticalIssues).toBeLessThan(5);   // Maximum critical issues
    expect(report.console.javascriptErrors).toBe(0);        // No JS errors allowed
  });
}