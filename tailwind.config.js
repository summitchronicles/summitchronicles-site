/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Swiss Spa Design System Color Palette
      colors: {
        // Primary brand colors
        'alpine-blue': '#1e3a8a',
        'summit-gold': '#fbbf24',
        // Swiss spa neutrals
        'spa-stone': '#f8fafc',
        'spa-mist': '#e2e8f0',
        'spa-cloud': '#cbd5e1',
        'spa-slate': '#64748b',
        'spa-charcoal': '#334155',
      },
      // Swiss spa typography system
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '300' }], // 64px
        'display-lg': ['4.5rem', { lineHeight: '1.1', fontWeight: '300' }], // 72px
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '400' }], // 36px
        'h1-lg': ['3rem', { lineHeight: '1.2', fontWeight: '400' }], // 48px
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
      // Swiss spa typography
      fontFamily: {
        'sans': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
