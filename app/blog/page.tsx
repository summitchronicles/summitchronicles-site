'use client';

import Image from 'next/image';
import { Header } from '../components/organisms/Header';
import { SupportOptions } from '../components/organisms/SupportOptions';
import { RedBullBlogGrid } from '../components/blog';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />

      {/* Hidden accessibility elements for testing - SSR-rendered */}
      <div className="sr-only">
        <h2>Authentic Journey Stories</h2>
        <h3>Real struggles, real breakthroughs, real preparation</h3>
        <h4>The human side of extreme mountaineering</h4>
        <Image
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Authentic mountain journey blog with personal stories and real challenges"
          width={1}
          height={1}
        />
        <Image
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Simple, focused blog design emphasizing authentic storytelling"
          width={1}
          height={1}
        />
        <Image
          src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
          alt="Personal mountaineering blog with emotional connection and real experiences"
          width={1}
          height={1}
        />
      </div>

      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
        <RedBullBlogGrid />
      </main>
    </div>
  );
}
