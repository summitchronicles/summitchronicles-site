import { Page, ConsoleMessage, Request } from '@playwright/test';

export interface ConsoleError {
  type: 'javascript' | 'network' | 'performance';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  location?: string;
  url?: string;
  timestamp: string;
  stack?: string;
}

export class ConsoleMonitor {
  private consoleErrors: ConsoleError[] = [];
  private networkErrors: ConsoleError[] = [];
  private performanceWarnings: ConsoleError[] = [];

  constructor(private page: Page) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for console errors
    this.page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        this.consoleErrors.push({
          type: 'javascript',
          severity: 'critical',
          message: msg.text(),
          location: msg.location() ? `${msg.location().url}:${msg.location().lineNumber}` : undefined,
          timestamp: new Date().toISOString()
        });
      } else if (msg.type() === 'warning') {
        this.consoleErrors.push({
          type: 'javascript',
          severity: 'warning', 
          message: msg.text(),
          location: msg.location() ? `${msg.location().url}:${msg.location().lineNumber}` : undefined,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Listen for network failures
    this.page.on('requestfailed', (request: Request) => {
      this.networkErrors.push({
        type: 'network',
        severity: 'critical',
        message: `Network request failed: ${request.failure()?.errorText || 'Unknown error'}`,
        url: request.url(),
        timestamp: new Date().toISOString()
      });
    });

    // Listen for response errors
    this.page.on('response', (response) => {
      if (response.status() >= 400) {
        this.networkErrors.push({
          type: 'network',
          severity: response.status() >= 500 ? 'critical' : 'warning',
          message: `HTTP ${response.status()}: ${response.statusText()}`,
          url: response.url(),
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  async checkForJavaScriptErrors(): Promise<ConsoleError[]> {
    // Check for runtime JS errors by injecting error handler
    const runtimeErrors = await this.page.evaluate(() => {
      const errors: any[] = [];
      
      // Override console.error to capture additional errors
      const originalError = console.error;
      console.error = (...args) => {
        errors.push({
          type: 'javascript',
          severity: 'critical',
          message: args.join(' '),
          timestamp: new Date().toISOString()
        });
        originalError.apply(console, args);
      };
      
      return errors;
    });

    return [...this.consoleErrors, ...runtimeErrors];
  }

  async checkNetworkHealth(): Promise<ConsoleError[]> {
    // Check for Strava API specific issues
    const stravaApiErrors = await this.page.evaluate(() => {
      const errors: any[] = [];
      
      // Check if Strava data loaded properly
      const stravaSection = document.querySelector('section:has(h2:contains("Recent Activities"))');
      if (stravaSection) {
        const noActivitiesMsg = stravaSection.textContent?.includes('No activities found');
        if (noActivitiesMsg) {
          errors.push({
            type: 'network',
            severity: 'warning',
            message: 'Strava API may not be returning data - showing fallback message',
            timestamp: new Date().toISOString()
          });
        }
      }
      
      return errors;
    });

    return [...this.networkErrors, ...stravaApiErrors];
  }

  async checkPerformanceWarnings(): Promise<ConsoleError[]> {
    const performanceMetrics = await this.page.evaluate(() => {
      const warnings: any[] = [];
      
      // Check for large images without optimization
      const images = Array.from(document.images);
      images.forEach(img => {
        if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
          warnings.push({
            type: 'performance',
            severity: 'warning',
            message: `Large unoptimized image detected: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Check for missing alt attributes
      images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
          warnings.push({
            type: 'performance',
            severity: 'info',
            message: `Image missing alt text: ${img.src}`,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      return warnings;
    });

    this.performanceWarnings.push(...performanceMetrics);
    return this.performanceWarnings;
  }

  async getAllErrors(): Promise<{
    javascript: ConsoleError[];
    network: ConsoleError[];
    performance: ConsoleError[];
    total: number;
  }> {
    const [jsErrors, networkErrors, perfWarnings] = await Promise.all([
      this.checkForJavaScriptErrors(),
      this.checkNetworkHealth(),
      this.checkPerformanceWarnings()
    ]);

    return {
      javascript: jsErrors,
      network: networkErrors,
      performance: perfWarnings,
      total: jsErrors.length + networkErrors.length + perfWarnings.length
    };
  }

  clearErrors() {
    this.consoleErrors = [];
    this.networkErrors = [];
    this.performanceWarnings = [];
  }
}