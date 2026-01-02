/** @type {import('jest').Config} */
module.exports = {
  // Use jsdom so DOM APIs are available in tests
  testEnvironment: 'jsdom',

  // Pick up TS/JS test files (adjust if you prefer another pattern)
  testMatch: [
    "<rootDir>/tests/unit/**/*.test.ts",
    "<rootDir>/tests/integration/**/*.test.ts",
    "<rootDir>/tests/security/**/*.test.ts",
    "<rootDir>/tests/accuracy/**/*.test.ts"
  ],

  // Let ts-jest transpile TS on the fly
  preset: 'ts-jest',

  // Auto–add testing-library matchers, etc.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Module resolution similar to Next.js/TS defaults
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Ignore build artifacts
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/'],

  // Coverage settings
  collectCoverageFrom: [
    "app/api/training/**/*.ts",
    "app/components/training/**/*.tsx",
    "lib/garmin-api.ts",
    "lib/compliance-engine.ts",
    "!**/*.d.ts",
    "!**/node_modules/**"
  ],
  coverageThreshold: {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
};
