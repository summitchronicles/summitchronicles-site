# Summit Chronicles Design Reviewer Agent

A comprehensive design review agent that uses Playwright to automatically check your Summit Chronicles website for visual issues, console errors, and mobile responsiveness problems.

## Features

### 🎨 Visual Quality Inspection

- **Broken Image Detection**: Identifies images that fail to load
- **Brand Color Compliance**: Ensures Summit Chronicles brand colors are used correctly
- **Typography Consistency**: Verifies Inter font family usage across the site
- **Layout Problem Detection**: Catches horizontal scroll and overflow issues

### 🖥️ Console Health Monitoring

- **JavaScript Error Capture**: Detects and reports all JS runtime errors
- **Network Request Monitoring**: Identifies failed API calls and network issues
- **Performance Warnings**: Flags optimization opportunities
- **Strava Integration Health**: Specific checks for Strava API functionality

### 📱 Mobile Responsiveness Testing

- **Multi-Viewport Testing**: Tests across mobile, tablet, and desktop breakpoints
- **Touch Target Validation**: Ensures interactive elements meet accessibility standards (44x44px)
- **Content Readability**: Checks font sizes and line lengths for mobile usability
- **Navigation Accessibility**: Verifies mobile navigation works properly

### 📊 Comprehensive Reporting

- **Scored Results**: 0-100 scores for each category and overall
- **HTML & JSON Reports**: Beautiful visual reports and structured data
- **Screenshot Capture**: Full-page and viewport-specific screenshots
- **Actionable Recommendations**: Specific steps to fix identified issues

## Quick Start

### Run Design Review

```bash
# Review localhost (default)
npm run design-review

# Review localhost explicitly
npm run design-review:localhost

# Review production site
npm run design-review:prod

# Run as Playwright test
npm run test:design
```

### Custom URL Review

```bash
# Review any URL
npx ts-node scripts/run-design-review.ts https://your-site.com
```

## Brand Configuration

The agent is specifically configured for Summit Chronicles brand standards:

```typescript
const BRAND_CONFIG = {
  colors: {
    alpineBlue: '#1e3a8a', // Primary
    summitGold: '#fbbf24', // Accent
    charcoal: '#1f2937', // Dark text
    lightGray: '#f9fafb', // Background
    snowWhite: '#ffffff', // Neutral
  },
  typography: {
    fontFamily: 'Inter',
    baseFontSize: 16,
    lineHeight: 1.6,
  },
  layout: {
    cardShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '0.5rem',
  },
};
```

## Report Structure

### Scores (0-100 scale)

- **Overall Score**: Weighted average of all categories
- **Visual Quality**: Brand compliance, layout, images
- **Console Health**: Error-free operation
- **Responsive Design**: Multi-device compatibility

### Issue Severity Levels

- **Critical**: Must fix (blocks deployment)
- **Warning**: Should fix (impacts UX)
- **Info**: Nice to fix (minor improvements)

## Integration Examples

### As a Playwright Test

```typescript
import { DesignReviewer } from '../agents/design-reviewer';

test('design review', async ({ page }) => {
  const reviewer = new DesignReviewer(page);
  const report = await reviewer.reviewSite('http://localhost:3000');

  expect(report.summary.overallScore).toBeGreaterThan(80);
  expect(report.summary.criticalIssues).toBe(0);
});
```

### In CI/CD Pipeline

```bash
# Add to your GitHub Actions or deployment pipeline
npm run design-review:prod
# Exit code 1 if critical issues found, 0 if clean
```

### Programmatic Usage

```typescript
import { DesignReviewer } from './agents/design-reviewer';
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
const reviewer = new DesignReviewer(page);

const report = await reviewer.reviewSite('https://summitchronicles.com');
console.log(`Overall score: ${report.summary.overallScore}/100`);
```

## Generated Reports

Reports are saved to `agents/design-reviewer/reports/`:

- **JSON Report**: `design-review-{timestamp}.json` - Structured data for automation
- **HTML Report**: `design-review-{timestamp}.html` - Visual report for human review
- **Screenshots**: `screenshots/` folder with full-page and viewport captures

## Quality Gates

The agent enforces these quality standards for Summit Chronicles:

### Development (localhost)

- Overall Score: ≥70
- Critical Issues: <5
- JavaScript Errors: 0
- Visual Quality: ≥80

### Production

- Overall Score: ≥85
- Critical Issues: 0
- JavaScript Errors: 0
- Network Errors: <2

## Customization

### Adding Custom Checks

```typescript
// Extend VisualInspector
class CustomVisualInspector extends VisualInspector {
  async checkCustomBrandElement(): Promise<VisualIssue[]> {
    // Your custom checks here
  }
}
```

### Custom Report Format

```typescript
// Extend ReportGenerator
class CustomReportGenerator extends ReportGenerator {
  generateSlackReport(report: DesignReviewReport): string {
    // Generate Slack-formatted report
  }
}
```

## Troubleshooting

### Common Issues

1. **Screenshots not saving**: Ensure directory permissions for `agents/design-reviewer/reports/`
2. **TypeScript errors**: Run `npm install` to ensure all dependencies are installed
3. **Network timeouts**: Increase timeout in Playwright config for slow connections
4. **Missing brand colors**: Verify CSS custom properties are defined in `app/globals.css`

### Debug Mode

```bash
# Run with debug output
DEBUG=1 npm run design-review
```

## Architecture

```
agents/design-reviewer/
├── config.ts                 # Brand configuration & constants
├── design-reviewer.ts         # Main agent orchestrator
├── index.ts                  # Public API exports
├── lib/
│   ├── visual-inspector.ts   # Visual quality checks
│   ├── console-monitor.ts    # Console error monitoring
│   ├── responsive-tester.ts  # Mobile responsiveness
│   └── report-generator.ts   # Report creation & formatting
└── reports/                  # Generated reports & screenshots
    ├── design-review-*.json
    ├── design-review-*.html
    └── screenshots/
```

---

**Summit Chronicles Design Reviewer** - Ensuring peak performance for your mountain chronicles. 🏔️
