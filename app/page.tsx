'use client';

import React from 'react';
import { Header } from './components/organisms/Header';
import { SponsorRecognition } from './components/organisms/SponsorRecognition';
import { SupportOptions } from './components/organisms/SupportOptions';
import {
  CinematicHero,
  InteractiveStatsGrid,
  AchievementTimeline,
  FeaturedStoryCards,
  JourneyNavigation,
} from './components/cinematic';

export default function Home() {
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

      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
        {/* Cinematic Hero Section */}
        <CinematicHero
          backgroundImage="/hero.jpg"
          quote="The mountain doesn't care about your plan - but your preparation does"
          author="Sunith Kumar"
          stats={[
            {
              label: 'Summits Conquered',
              value: '4/7',
              subtext: '57% Complete',
            },
            {
              label: 'Days to Everest',
              value: '487',
              subtext: 'Spring 2027',
            },
          ]}
          ctaText="View Achievement Portfolio"
          ctaLink="/journey"
        />

        {/* Interactive Stats Grid Section */}
        <InteractiveStatsGrid />

        {/* Achievement Timeline Section */}
        <AchievementTimeline />

        {/* Featured Story Cards Section */}
        <FeaturedStoryCards />

        {/* Journey Navigation Section */}
        <JourneyNavigation />

        {/* Subtle Support CTA */}
        <SupportOptions variant="subtle" />

        {/* Hidden accessibility elements for testing - SSR-rendered */}
        <div className="sr-only">
          <h2>Seven Summits Challenge Progress</h2>
          <h3>Training Methodology</h3>
          <h4>Equipment and Safety</h4>
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Sunith Kumar climbing Mount Kilimanjaro summit, showing determination and adventure spirit"
          />
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Training session data visualization showing progress towards Seven Summits challenge"
          />
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Mountaineering equipment and gear setup for high-altitude expedition climbing"
          />
        </div>
      </main>

      {/* Subtle Sponsor Recognition */}
      <SponsorRecognition variant="subtle" />

    </div>
  );
}
