#!/usr/bin/env ts-node

import { chromium } from '@playwright/test';
import { DesignReviewer } from '../agents/design-reviewer';

async function runDesignReview() {
  const args = process.argv.slice(2);
  const url = args[0] || 'http://localhost:3000';
  
  console.log('🚀 Summit Chronicles Design Reviewer');
  console.log('=====================================');
  console.log(`Target URL: ${url}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Summit Chronicles Design Reviewer'
  });
  
  const page = await context.newPage();
  
  try {
    const reviewer = new DesignReviewer(page);
    const report = await reviewer.reviewSite(url);
    
    // Exit with appropriate code based on results
    const exitCode = report.summary.criticalIssues > 0 ? 1 : 0;
    process.exit(exitCode);
    
  } catch (error) {
    console.error('❌ Design review failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runDesignReview().catch(console.error);
}

export { runDesignReview };