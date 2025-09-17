'use client';

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { initializeAnalytics } from '@/lib/analytics';

export default function AnalyticsProvider() {
  useEffect(() => {
    // Initialize analytics tracking
    if (typeof window !== 'undefined') {
      // Check if user has opted out of analytics
      const hasOptedOut =
        localStorage.getItem('summit_analytics_disabled') === 'true';

      if (!hasOptedOut) {
        initializeAnalytics();
      }
    }
  }, []);

  return (
    <>
      {/* Vercel Analytics */}
      <Analytics />
    </>
  );
}
