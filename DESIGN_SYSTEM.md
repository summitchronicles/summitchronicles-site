# Summit Chronicles Design System

## Design Philosophy

**"Swiss Spa Minimalism"** - Premium, sleek, and minimalist design that exudes the tranquility and precision of a luxury Swiss spa. Every element should be purposeful, beautifully spaced, and worthy of a premium subscription service.

## Core Principles

### 1. **Steve Jobs Standard**
- Every component must be elegant enough to make Steve Jobs smile
- Ruthless simplicity - remove everything that doesn't serve a purpose
- Premium quality that justifies thousands of dollars per month
- Obsessive attention to detail and spacing

### 2. **Visual Elements**
- **Icons over Emojis**: Always use clean, professional icons instead of emojis
- **Perfect Spacing**: Components must be neither too close nor too dispersed
- **Purposeful Whitespace**: Use space as a design element, not filler

### 3. **Color Palette**
Choose a cohesive palette and stick to it religiously:

```css
/* Primary Palette - Swiss Minimalism */
--primary-50: #f8fafc    /* Soft white backgrounds */
--primary-100: #f1f5f9   /* Card backgrounds */
--primary-200: #e2e8f0   /* Subtle borders */
--primary-500: #64748b   /* Secondary text */
--primary-700: #334155   /* Primary text */
--primary-900: #0f172a   /* Headings */

/* Accent Colors - Sparingly Used */
--accent-blue: #3b82f6   /* Call-to-action */
--accent-success: #10b981 /* Success states */
--accent-warning: #f59e0b /* Warnings */
```

### 4. **Typography Scale**
```css
/* Font Sizes - Consistent Scale */
--text-xs: 0.75rem    /* 12px - Captions */
--text-sm: 0.875rem   /* 14px - Secondary text */
--text-base: 1rem     /* 16px - Body text */
--text-lg: 1.125rem   /* 18px - Large text */
--text-xl: 1.25rem    /* 20px - Subheadings */
--text-2xl: 1.5rem    /* 24px - Section titles */
--text-3xl: 1.875rem  /* 30px - Page titles */
--text-4xl: 2.25rem   /* 36px - Hero titles */
```

### 5. **Spacing System**
```css
/* Perfect Spacing Scale */
--space-1: 0.25rem   /* 4px - Tight spacing */
--space-2: 0.5rem    /* 8px - Small gaps */
--space-3: 0.75rem   /* 12px - Default gaps */
--space-4: 1rem      /* 16px - Component padding */
--space-6: 1.5rem    /* 24px - Section spacing */
--space-8: 2rem      /* 32px - Large sections */
--space-12: 3rem     /* 48px - Major sections */
--space-16: 4rem     /* 64px - Page sections */
```

## Component Standards

### Navigation
- Clean, minimal navigation bar
- Professional icons with consistent sizing
- Subtle hover states
- Perfect alignment and spacing

### Cards & Content
- Subtle shadows for depth
- Consistent border radius (8px standard)
- Breathing room between elements
- No unnecessary borders or dividers

### Buttons & Interactions
- Single primary action color
- Consistent padding and typography
- Subtle hover and active states
- Never more than 2-3 button styles

### Mobile Responsiveness
- Touch-friendly targets (44px minimum)
- Optimized spacing for mobile
- Readable typography on all devices
- Elegant responsive breakpoints

## Icon Library
Use **Heroicons** or **Lucide React** for consistent, professional icons:
- Navigation: Home, Document, User, Cog
- Actions: Plus, Edit, Trash, Arrow
- Status: Check, X, Info, Alert

## Anti-Patterns (Never Use)
❌ Emojis in professional contexts  
❌ Bright, saturated colors without purpose  
❌ Cramped spacing that feels claustrophobic  
❌ Excessive shadows or gradients  
❌ More than 3-4 colors in the palette  
❌ Inconsistent spacing values  
❌ Generic stock photo imagery  

## Quality Gates
Every component must pass:
1. **Swiss Spa Test**: Does it feel serene and premium?
2. **Professional Test**: Would a C-suite executive use this?
3. **Spacing Test**: Is every element perfectly positioned?
4. **Mobile Test**: Is it elegant on mobile devices?
5. **Steve Jobs Test**: Would this pass his design standards?

## Implementation Notes
- Use CSS custom properties for consistency
- Implement spacing with Tailwind's systematic approach
- Test on multiple devices and screen sizes
- Review spacing with developer tools grid overlay
- Maintain design system documentation as we build

---

*"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." - Antoine de Saint-Exupéry*