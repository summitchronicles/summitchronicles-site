import { VisualIssue } from './visual-inspector';
import { ConsoleError } from './console-monitor';
import { ResponsiveIssue, ViewportTestResult } from './responsive-tester';

export interface DesignReviewReport {
  metadata: {
    url: string;
    timestamp: string;
    userAgent: string;
    testDuration: number;
    summitChroniclesVersion?: string;
  };

  summary: {
    overallScore: number;
    totalIssues: number;
    criticalIssues: number;
    warningIssues: number;
    infoIssues: number;
  };

  visualQuality: {
    score: number;
    issues: VisualIssue[];
    brokenImagesCount: number;
    colorComplianceIssues: number;
    typographyIssues: number;
    layoutProblems: number;
  };

  console: {
    score: number;
    errors: ConsoleError[];
    javascriptErrors: number;
    networkErrors: number;
    performanceWarnings: number;
  };

  responsive: {
    score: number;
    viewportResults: ViewportTestResult[];
    failedViewports: string[];
    totalResponsiveIssues: number;
  };

  screenshots: {
    fullPage: string;
    viewports: { [key: string]: string };
  };

  recommendations: Recommendation[];
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: 'visual' | 'console' | 'responsive' | 'performance';
  title: string;
  description: string;
  actionItems: string[];
  estimatedEffort: 'quick' | 'medium' | 'large';
}

export class ReportGenerator {
  generateReport(
    url: string,
    visualIssues: VisualIssue[],
    consoleErrors: {
      javascript: ConsoleError[];
      network: ConsoleError[];
      performance: ConsoleError[];
    },
    responsiveResults: ViewportTestResult[],
    startTime: number
  ): DesignReviewReport {
    const allIssues = [
      ...visualIssues,
      ...consoleErrors.javascript,
      ...consoleErrors.network,
      ...consoleErrors.performance,
      ...responsiveResults.flatMap((r) => r.issues),
    ];

    const criticalCount = allIssues.filter(
      (i) => i.severity === 'critical'
    ).length;
    const warningCount = allIssues.filter(
      (i) => i.severity === 'warning'
    ).length;
    const infoCount = allIssues.filter((i) => i.severity === 'info').length;

    const visualScore = this.calculateVisualScore(visualIssues);
    const consoleScore = this.calculateConsoleScore(consoleErrors);
    const responsiveScore = this.calculateResponsiveScore(responsiveResults);
    const overallScore = Math.round(
      (visualScore + consoleScore + responsiveScore) / 3
    );

    const report: DesignReviewReport = {
      metadata: {
        url,
        timestamp: new Date().toISOString(),
        userAgent: 'Summit Chronicles Design Reviewer',
        testDuration: Date.now() - startTime,
      },

      summary: {
        overallScore,
        totalIssues: allIssues.length,
        criticalIssues: criticalCount,
        warningIssues: warningCount,
        infoIssues: infoCount,
      },

      visualQuality: {
        score: visualScore,
        issues: visualIssues,
        brokenImagesCount: visualIssues.filter((i) => i.type === 'broken-image')
          .length,
        colorComplianceIssues: visualIssues.filter(
          (i) => i.type === 'color-violation'
        ).length,
        typographyIssues: visualIssues.filter(
          (i) => i.type === 'typography-issue'
        ).length,
        layoutProblems: visualIssues.filter((i) => i.type === 'layout-problem')
          .length,
      },

      console: {
        score: consoleScore,
        errors: [
          ...consoleErrors.javascript,
          ...consoleErrors.network,
          ...consoleErrors.performance,
        ],
        javascriptErrors: consoleErrors.javascript.length,
        networkErrors: consoleErrors.network.length,
        performanceWarnings: consoleErrors.performance.length,
      },

      responsive: {
        score: responsiveScore,
        viewportResults: responsiveResults,
        failedViewports: responsiveResults
          .filter((r) => !r.passed)
          .map((r) => r.name),
        totalResponsiveIssues: responsiveResults.reduce(
          (sum, r) => sum + r.issues.length,
          0
        ),
      },

      screenshots: {
        fullPage: 'agents/design-reviewer/reports/screenshots/full-page.png',
        viewports: responsiveResults.reduce(
          (acc, r) => {
            acc[r.name] = r.screenshot;
            return acc;
          },
          {} as { [key: string]: string }
        ),
      },

      recommendations: this.generateRecommendations(
        visualIssues,
        consoleErrors,
        responsiveResults
      ),
    };

    return report;
  }

  private calculateVisualScore(issues: VisualIssue[]): number {
    let score = 100;

    issues.forEach((issue) => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'warning':
          score -= 5;
          break;
        case 'info':
          score -= 1;
          break;
      }
    });

    return Math.max(0, score);
  }

  private calculateConsoleScore(errors: {
    javascript: ConsoleError[];
    network: ConsoleError[];
    performance: ConsoleError[];
  }): number {
    let score = 100;
    const allErrors = [
      ...errors.javascript,
      ...errors.network,
      ...errors.performance,
    ];

    allErrors.forEach((error) => {
      switch (error.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 2;
          break;
      }
    });

    return Math.max(0, score);
  }

  private calculateResponsiveScore(results: ViewportTestResult[]): number {
    let score = 100;
    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);

    results.forEach((result) => {
      result.issues.forEach((issue) => {
        switch (issue.severity) {
          case 'critical':
            score -= 15;
            break;
          case 'warning':
            score -= 8;
            break;
          case 'info':
            score -= 2;
            break;
        }
      });
    });

    return Math.max(0, score);
  }

  private generateRecommendations(
    visualIssues: VisualIssue[],
    consoleErrors: {
      javascript: ConsoleError[];
      network: ConsoleError[];
      performance: ConsoleError[];
    },
    responsiveResults: ViewportTestResult[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Visual recommendations
    if (visualIssues.filter((i) => i.type === 'broken-image').length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'visual',
        title: 'Fix broken images',
        description:
          'Several images are failing to load properly, affecting the visual experience.',
        actionItems: [
          'Check image file paths and ensure files exist',
          'Verify image URLs are correct and accessible',
          'Add fallback alt text for better accessibility',
        ],
        estimatedEffort: 'quick',
      });
    }

    if (visualIssues.filter((i) => i.type === 'color-violation').length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'visual',
        title: 'Ensure brand color consistency',
        description:
          'Non-brand colors detected that may not align with Summit Chronicles design system.',
        actionItems: [
          'Review CSS custom properties in globals.css',
          'Replace hardcoded colors with Tailwind brand classes',
          'Use alpineBlue, summitGold, and other defined brand colors',
        ],
        estimatedEffort: 'medium',
      });
    }

    // Console error recommendations
    if (consoleErrors.javascript.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'console',
        title: 'Resolve JavaScript errors',
        description:
          'JavaScript errors can break functionality and user experience.',
        actionItems: [
          'Check browser developer tools for detailed error information',
          'Review recent code changes that might have introduced errors',
          'Test Strava API integration thoroughly',
        ],
        estimatedEffort: 'medium',
      });
    }

    if (consoleErrors.network.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'console',
        title: 'Fix network request issues',
        description:
          'Network requests are failing, potentially affecting data loading.',
        actionItems: [
          'Verify API endpoints are accessible',
          'Check Strava API token and authentication',
          'Implement proper error handling for failed requests',
        ],
        estimatedEffort: 'medium',
      });
    }

    // Responsive recommendations
    const failedViewports = responsiveResults.filter((r) => !r.passed);
    if (failedViewports.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'responsive',
        title: 'Fix responsive design issues',
        description: `Design issues detected on ${failedViewports.map((v) => v.name).join(', ')} viewports.`,
        actionItems: [
          'Review and fix horizontal scroll issues',
          'Ensure touch targets meet minimum size requirements (44x44px)',
          'Test layout at different screen sizes',
          'Use responsive Tailwind classes instead of fixed dimensions',
        ],
        estimatedEffort: 'large',
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  generateHTMLReport(report: DesignReviewReport): string {
    const getScoreColor = (score: number) => {
      if (score >= 90) return '#22c55e'; // green
      if (score >= 70) return '#fbbf24'; // summit gold
      return '#ef4444'; // red
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design Review Report - ${report.metadata.url}</title>
  <style>
    body { font-family: Inter, sans-serif; margin: 0; padding: 20px; background: #f9fafb; color: #1f2937; }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { background: #1e3a8a; color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; }
    .score { font-size: 48px; font-weight: bold; margin: 20px 0; }
    .card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .issue { padding: 12px; border-left: 4px solid; margin: 8px 0; border-radius: 4px; }
    .critical { border-color: #ef4444; background: #fef2f2; }
    .warning { border-color: #fbbf24; background: #fffbeb; }
    .info { border-color: #3b82f6; background: #eff6ff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .screenshot { max-width: 100%; border-radius: 8px; }
    .recommendation { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; }
    .recommendation.high { border-color: #ef4444; }
    .recommendation.medium { border-color: #fbbf24; }
    .recommendation.low { border-color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Summit Chronicles Design Review</h1>
      <p>URL: ${report.metadata.url}</p>
      <p>Generated: ${new Date(report.metadata.timestamp).toLocaleString()}</p>
      <div class="score" style="color: ${getScoreColor(report.summary.overallScore)}">
        ${report.summary.overallScore}/100
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h2>Summary</h2>
        <p><strong>Total Issues:</strong> ${report.summary.totalIssues}</p>
        <p><strong>Critical:</strong> ${report.summary.criticalIssues}</p>
        <p><strong>Warnings:</strong> ${report.summary.warningIssues}</p>
        <p><strong>Info:</strong> ${report.summary.infoIssues}</p>
      </div>

      <div class="card">
        <h2>Visual Quality</h2>
        <div style="color: ${getScoreColor(report.visualQuality.score)}; font-size: 24px; font-weight: bold;">
          ${report.visualQuality.score}/100
        </div>
        <p>Broken Images: ${report.visualQuality.brokenImagesCount}</p>
        <p>Color Issues: ${report.visualQuality.colorComplianceIssues}</p>
        <p>Typography: ${report.visualQuality.typographyIssues}</p>
        <p>Layout Problems: ${report.visualQuality.layoutProblems}</p>
      </div>

      <div class="card">
        <h2>Console Health</h2>
        <div style="color: ${getScoreColor(report.console.score)}; font-size: 24px; font-weight: bold;">
          ${report.console.score}/100
        </div>
        <p>JavaScript Errors: ${report.console.javascriptErrors}</p>
        <p>Network Errors: ${report.console.networkErrors}</p>
        <p>Performance Warnings: ${report.console.performanceWarnings}</p>
      </div>

      <div class="card">
        <h2>Responsive Design</h2>
        <div style="color: ${getScoreColor(report.responsive.score)}; font-size: 24px; font-weight: bold;">
          ${report.responsive.score}/100
        </div>
        <p>Failed Viewports: ${report.responsive.failedViewports.join(', ') || 'None'}</p>
        <p>Total Issues: ${report.responsive.totalResponsiveIssues}</p>
      </div>
    </div>

    <div class="card">
      <h2>Recommendations</h2>
      ${report.recommendations
        .map(
          (rec) => `
        <div class="recommendation ${rec.priority}">
          <h3>${rec.title}</h3>
          <p><strong>Priority:</strong> ${rec.priority.toUpperCase()} | <strong>Category:</strong> ${rec.category} | <strong>Effort:</strong> ${rec.estimatedEffort}</p>
          <p>${rec.description}</p>
          <ul>
            ${rec.actionItems.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="card">
      <h2>All Issues</h2>
      ${[...report.visualQuality.issues, ...report.console.errors]
        .map(
          (issue) => `
        <div class="issue ${issue.severity}">
          <strong>${issue.type || 'Console'}:</strong> ${issue.message}
          ${'element' in issue && issue.element ? `<br><em>Element: ${issue.element}</em>` : ''}
          ${'expected' in issue && 'actual' in issue && issue.expected && issue.actual ? `<br><em>Expected: ${issue.expected} | Actual: ${issue.actual}</em>` : ''}
        </div>
      `
        )
        .join('')}
      
      ${report.responsive.viewportResults
        .map((result) =>
          result.issues
            .map(
              (issue) => `
          <div class="issue ${issue.severity}">
            <strong>${issue.type} (${issue.viewport}):</strong> ${issue.message}
            ${issue.element ? `<br><em>Element: ${issue.element}</em>` : ''}
          </div>
        `
            )
            .join('')
        )
        .join('')}
    </div>
  </div>
</body>
</html>
    `;
  }
}
