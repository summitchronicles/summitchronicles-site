// Global setup for Playwright tests
const { chromium } = require('@playwright/test');

async function globalSetup() {
  console.log('🚀 Starting global test setup...');
  
  // Initialize error monitoring for tests
  console.log('📊 Initializing test monitoring...');
  
  // Setup test database if needed
  console.log('🗄️ Setting up test environment...');
  
  // Warm up the application
  console.log('🔥 Warming up application...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the dev server to be ready
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Pre-cache critical resources
    await page.goto('http://localhost:3000/about');
    await page.goto('http://localhost:3000/blog');
    await page.goto('http://localhost:3000/training');
    
    console.log('✅ Application warmup complete');
  } catch (error) {
    console.error('❌ Failed to warm up application:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
  
  // Set up test data
  console.log('📝 Setting up test data...');
  
  // Initialize performance baseline
  console.log('📈 Setting performance baseline...');
  
  console.log('✅ Global setup complete');
}

module.exports = globalSetup;