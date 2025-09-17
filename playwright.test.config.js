const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Enhanced reporting
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ...(process.env.CI ? [['github']] : [])
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Additional global settings
    actionTimeout: 15000,
    navigationTimeout: 30000,
    
    // Test isolation
    contextOptions: {
      recordVideo: {
        mode: 'retain-on-failure',
        size: { width: 1280, height: 720 }
      }
    }
  },

  // Multiple browser testing
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },

    // Performance testing project
    {
      name: 'performance',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--enable-precise-memory-info']
        }
      },
      testMatch: '**/performance/**/*.spec.js'
    },

    // Accessibility testing project
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/accessibility/**/*.spec.js'
    }
  ],

  // Global test configuration
  timeout: 60000,
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      mode: 'strict',
      threshold: 0.2
    }
  },

  // Global setup and teardown
  globalSetup: require.resolve('./tests/global-setup.js'),
  globalTeardown: require.resolve('./tests/global-teardown.js'),

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'test'
    }
  },

  // Output directories
  outputDir: 'test-results/',
  
  // Test metadata
  metadata: {
    'test-environment': process.env.NODE_ENV || 'test',
    'build-version': process.env.NEXT_PUBLIC_BUILD_VERSION || 'local',
    'test-run-id': process.env.GITHUB_RUN_ID || 'local-run'
  }
});