'use client';

import { Header } from '../components/organisms/Header';
import { MonitoringDashboard } from '../components/monitoring/MonitoringDashboard';

export default function MonitoringPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />

      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-gray-900/80"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-light tracking-wide mb-4">
            SYSTEM MONITORING
          </h1>
          <p className="text-xl font-light tracking-wider opacity-90">
            API Health • Rate Limiting • Performance Analytics
          </p>
        </div>
      </section>

      {/* Main content */}
      <main id="main-content">
        <div className="bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <MonitoringDashboard />
          </div>
        </div>
      </main>
    </div>
  );
}