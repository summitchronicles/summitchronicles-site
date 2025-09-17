'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import type {
  CLSMetric,
  FCPMetric,
  LCPMetric,
  TTFBMetric,
  INPMetric,
} from 'web-vitals';

type WebVital = CLSMetric | FCPMetric | LCPMetric | TTFBMetric | INPMetric;

interface VitalsReport {
  url: string;
  userAgent: string;
  vitals: Array<{
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
    navigationType?: string;
  }>;
  timestamp: string;
  sessionId?: string;
}

const getRating = (metric: WebVital): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds = {
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
  };

  const threshold = thresholds[metric.name as keyof typeof thresholds];
  if (!threshold) return 'good';

  if (metric.value <= threshold.good) return 'good';
  if (metric.value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

export default function WebVitalsProvider() {
  useEffect(() => {
    const vitalsQueue: WebVital[] = [];
    let reportTimeout: NodeJS.Timeout;

    const queueVital = (metric: WebVital) => {
      vitalsQueue.push(metric);

      // Clear existing timeout and set a new one
      clearTimeout(reportTimeout);
      reportTimeout = setTimeout(() => {
        sendVitalsReport([...vitalsQueue]);
        vitalsQueue.length = 0; // Clear the queue
      }, 1000); // Wait 1 second to batch multiple vitals
    };

    const sendVitalsReport = async (vitals: WebVital[]) => {
      if (vitals.length === 0) return;

      try {
        const sessionId =
          sessionStorage.getItem('summit_session_id') || undefined;

        const report: VitalsReport = {
          url: window.location.href,
          userAgent: navigator.userAgent,
          vitals: vitals.map((metric) => ({
            name: metric.name,
            value: Math.round(metric.value * 1000) / 1000, // Round to 3 decimals
            rating: getRating(metric),
            delta: Math.round(metric.delta * 1000) / 1000,
            id: metric.id,
            navigationType: (metric as any).navigationType,
          })),
          timestamp: new Date().toISOString(),
          sessionId,
        };

        await fetch('/api/vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
        });
      } catch (error) {
        console.warn('Failed to send vitals report:', error);
      }
    };

    // Set up web vitals tracking
    onCLS(queueVital, { reportAllChanges: false });
    onFCP(queueVital);
    onLCP(queueVital, { reportAllChanges: false });
    onTTFB(queueVital);

    // Only track INP if supported
    if ('PerformanceEventTiming' in window) {
      onINP(queueVital, { reportAllChanges: false });
    }

    // Send any remaining vitals when the page is about to unload
    const handleBeforeUnload = () => {
      if (vitalsQueue.length > 0) {
        sendVitalsReport([...vitalsQueue]);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Also send vitals when the page becomes hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && vitalsQueue.length > 0) {
        sendVitalsReport([...vitalsQueue]);
        vitalsQueue.length = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(reportTimeout);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
