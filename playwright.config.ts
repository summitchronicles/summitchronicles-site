import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
    // Mobile-specific project for comprehensive testing
    {
      name: 'mobile-comprehensive',
      testMatch: '**/mobile-comprehensive.spec.ts',
      use: { ...devices['iPhone 12'] },
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      GARMIN_USERNAME: 'dummy_user',
      GARMIN_PASSWORD: 'dummy_password',
      GOOGLE_API_KEY: 'dummy_key',
      SUPABASE_URL: 'https://dummy.supabase.co',
      SUPABASE_ANON_KEY: 'dummy_key',
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'dummy_project',
      NEXT_PUBLIC_SANITY_DATASET: 'dummy_dataset',
      SANITY_API_TOKEN: 'dummy_token',
      COHERE_API_KEY: 'dummy_key',
      BUTTONDOWN_API_KEY: 'dummy_key',
      INTERNAL_API_KEY: 'dummy_key',
      SENTRY_DSN: 'https://dummy@dummy.ingest.sentry.io/dummy',
    },
  },
});
