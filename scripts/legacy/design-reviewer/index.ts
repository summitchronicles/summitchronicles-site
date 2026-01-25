export { DesignReviewer, createDesignReviewTest } from './design-reviewer';
export { VisualInspector } from './lib/visual-inspector';
export { ConsoleMonitor } from './lib/console-monitor';
export { ResponsiveTester } from './lib/responsive-tester';
export { ReportGenerator } from './lib/report-generator';
export * from './config';

// Convenience exports for types
export type { VisualIssue } from './lib/visual-inspector';
export type { ConsoleError } from './lib/console-monitor';
export type {
  ResponsiveIssue,
  ViewportTestResult,
} from './lib/responsive-tester';
export type {
  DesignReviewReport,
  Recommendation,
} from './lib/report-generator';
