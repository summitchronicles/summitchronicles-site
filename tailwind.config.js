/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Enhanced Swiss Spa Design System Color Palette
      colors: {
        // Primary brand colors with variations
        'alpine-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        // Premium Dark Theme Colors
        'obsidian': '#050505',
        'charcoal-mist': '#1a1a1a',
        'glass-panel': 'rgba(26, 26, 26, 0.6)',

        'summit-gold': {
          DEFAULT: '#D4AF37',
          50: '#FDFCF6',
          100: '#FAF8ED',
          200: '#F4EFDB',
          300: '#EEE6C9',
          400: '#E8DDB7',
          500: '#E2D4A5', // Base Gold
          600: '#D4AF37', // True Metallic Gold
          700: '#AA8C2C',
          800: '#806921',
          900: '#554616',
          950: '#451a03'
        },
        // Swiss spa neutrals with variations
        'spa-stone': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        'spa-mist': '#e2e8f0',
        'spa-cloud': '#cbd5e1',
        'spa-slate': '#64748b',
        'spa-charcoal': '#334155',

        // Mountaineering contextual colors
        'glacier': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        },
        'peak': {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b'
        },
        'forest': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        'expedition': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        },
        // Accent colors for specific contexts
        'weather': {
          sunny: '#fbbf24',
          cloudy: '#6b7280',
          storm: '#374151',
          snow: '#f3f4f6'
        },
        'altitude': {
          'base-camp': '#22c55e',
          'intermediate': '#f59e0b',
          'high': '#ef4444',
          'death-zone': '#7c2d12'
        },
        'season': {
          spring: '#84cc16',
          summer: '#eab308',
          autumn: '#ea580c',
          winter: '#3b82f6'
        }
      },
      // Swiss spa typography system - Mobile-optimized
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '300' }], // 64px
        'display-lg': ['4.5rem', { lineHeight: '1.1', fontWeight: '300' }], // 72px
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '400' }], // 36px
        'h1-lg': ['3rem', { lineHeight: '1.2', fontWeight: '400' }], // 48px
        // Mobile-optimized text sizes (minimum 16px for readability)
        'sm': ['1rem', { lineHeight: '1.5' }], // 16px minimum for mobile
        'base': ['1rem', { lineHeight: '1.5' }], // 16px base
        'lg': ['1.125rem', { lineHeight: '1.5' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.5' }], // 20px
      },
      // 8px grid spacing system
      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
        '26': '6.5rem', // 104px
        '30': '7.5rem', // 120px
      },
      // Swiss spa shadows (subtle elevation)
      boxShadow: {
        'spa-soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'spa-medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'spa-elevated': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      // Premium animations
      transitionDuration: {
        '400': '400ms',
        '500': '500ms',
      },
      // Swiss spa typography enhanced with adventure fonts
      fontFamily: {
        'sans': ['var(--font-montserrat)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'adventure': ['var(--font-amatic)', 'cursive'],
        'display': ['var(--font-oswald)', 'Impact', 'Arial Black', 'sans-serif'],
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
        'amatic': ['var(--font-amatic)', 'cursive'],
        'oswald': ['var(--font-oswald)', 'sans-serif'],
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'scan-fast': 'scan 2s linear infinite',
      },
    },
  },
  plugins: [
    // Mobile-optimized utilities plugin
    function({ addUtilities }) {
      addUtilities({
        // Prevent horizontal overflow
        '.mobile-safe': {
          'max-width': '100vw',
          'overflow-x': 'hidden',
          'box-sizing': 'border-box',
        },
        // Mobile touch target utilities
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
        },
        '.touch-target-lg': {
          'min-height': '48px',
          'min-width': '48px',
        },
        // Mobile typography
        '.mobile-text': {
          'font-size': '1rem', // 16px minimum
          'line-height': '1.5',
        },
        // Responsive containers
        '.container-mobile': {
          'width': '100%',
          'max-width': '100vw',
          'padding-left': '1rem',
          'padding-right': '1rem',
          'margin-left': 'auto',
          'margin-right': 'auto',
        },
        // Mobile safe area
        '.mobile-padding': {
          'padding-left': 'max(1rem, env(safe-area-inset-left))',
          'padding-right': 'max(1rem, env(safe-area-inset-right))',
        },
      })
    }
  ],
}
