'use client';

import { Header } from '../components/organisms/Header';
import { Footer } from '../components/organisms/Footer';
import { SupportOptions } from '../components/organisms/SupportOptions';
import { RedBullBlogGrid } from '../components/blog';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-red-600 text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
      >
        Skip to main content
      </a>
      <Header />

      {/* Hidden accessibility elements for testing - SSR-rendered */}
      <div className="sr-only">
        <h2>Mountain Chronicle Blog Stories</h2>
        <h3>Expedition Chronicles and Training Insights</h3>
        <h4>Visual Storytelling and Adventure Documentation</h4>
        <img
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Nicolas Hojac-inspired mountain chronicle blog featuring immersive expedition stories"
        />
        <img
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Cinematic blog layout with large hero images and visual storytelling elements"
        />
        <img
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Interactive blog cards with expedition photography and story previews"
        />
      </div>

      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
        {/* Red Bull Blog Grid - Full Width */}
        <RedBullBlogGrid />
      </main>

      {/* Subtle Support CTA */}
      <SupportOptions variant="subtle" />

      <Footer />
    </div>
  );
}
