export const SUMMIT_CHRONICLES_BRAND_CONFIG = {
  colors: {
    alpineBlue: '#1e3a8a',
    summitGold: '#fbbf24',
    charcoal: '#1f2937',
    lightGray: '#f9fafb',
    snowWhite: '#ffffff',
  },

  typography: {
    fontFamily: 'Inter',
    baseFontSize: 16,
    lineHeight: 1.6,
  },

  layout: {
    cardShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '0.5rem',
    maxContentWidth: 1200,
  },

  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1280,
    large: 1920,
  },
};

export const TEST_VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 720 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
];

export const BRAND_COLOR_VARIANTS = [
  '#1e3a8a',
  '#3749a5', // Alpine Blue variants
  '#fbbf24',
  '#fcd34d', // Summit Gold variants
  '#1f2937', // Charcoal
  '#f9fafb', // Light Gray
  '#ffffff', // Snow White
];
