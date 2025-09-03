/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Colors
        alpineBlue: "var(--color-alpine-blue)",
        summitGold: "var(--color-summit-gold)",
        charcoal: "var(--color-charcoal)",
        lightGray: "var(--color-light-gray)",
        snowWhite: "var(--color-snow-white)",
        
        // Extended Palette
        glacierBlue: "var(--color-glacier-blue)",
        stoneGray: "var(--color-stone-gray)",
        warningOrange: "var(--color-warning-orange)",
        successGreen: "var(--color-success-green)",
        dangerRed: "var(--color-danger-red)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        // Custom spacing scale matching our CSS variables
        '1': 'var(--space-1)',
        '2': 'var(--space-2)', 
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '24': 'var(--space-24)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'DEFAULT': 'var(--radius-md)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
      animation: {
        'fade-in-up': 'fadeInUp var(--duration-slow) var(--easing-ease-out)',
        'scale-in': 'scaleIn var(--duration-normal) var(--easing-ease-out)',
        'slide-in-right': 'slideInRight var(--duration-slow) var(--easing-ease-out)',
        'shimmer': 'shimmer 1.5s infinite',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)', 
        'slow': 'var(--duration-slow)',
        'slower': 'var(--duration-slower)',
      },
      transitionTimingFunction: {
        'ease-out': 'var(--easing-ease-out)',
        'ease-in-out': 'var(--easing-ease-in-out)',
        'bounce': 'var(--easing-bounce)',
      },
    },
  },
  plugins: [],
};