/** @type {import('jest').Config} */
module.exports = {
  // Use jsdom so DOM APIs are available in tests
  testEnvironment: 'jsdom',

  // Pick up TS/JS test files (adjust if you prefer another pattern)
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],

  // Let ts-jest transpile TS on the fly
  preset: 'ts-jest',

  // Point ts-jest at your TS config if you need a custom one
  // globals: { 'ts-jest': { tsconfig: 'tsconfig.json' } },

  // Auto–add testing-library matchers, etc.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Module resolution similar to Next.js/TS defaults
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Ignore build artifacts
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/dist/'],
};
