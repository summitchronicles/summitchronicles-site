'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Google Analytics gtag functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn(
        'Google Analytics Measurement ID not found. Set NEXT_PUBLIC_GA_MEASUREMENT_ID in environment variables.'
      );
      return;
    }

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Define gtag function
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    // Configure Google Analytics
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }, []);

  // Don't render scripts if no measurement ID
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}

// Utility functions for tracking events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

// Track specific Summit Chronicles events
export const trackNewsletterSignup = (method: string = 'unknown') => {
  trackEvent('newsletter_signup', {
    method,
    event_category: 'engagement',
    event_label: 'newsletter_subscription',
  });
};

export const trackAIQuery = (
  question: string,
  responseTime: number,
  helpful?: boolean
) => {
  trackEvent('ai_interaction', {
    event_category: 'ai',
    event_label: 'ask_sunith',
    response_time: responseTime,
    helpful,
    custom_parameters: {
      question_length: question.length,
      question_category: categorizeQuestion(question),
    },
  });
};

export const trackSponsorshipInquiry = (type: string) => {
  trackEvent('sponsorship_inquiry', {
    event_category: 'business',
    event_label: type,
    value: 1,
  });
};

export const trackTrainingPageView = (section: string) => {
  trackEvent('training_engagement', {
    event_category: 'content',
    event_label: section,
    custom_parameters: {
      page_section: section,
    },
  });
};

export const trackBlogPost = (postSlug: string, readTime?: number) => {
  trackEvent('blog_post_view', {
    event_category: 'content',
    event_label: postSlug,
    custom_parameters: {
      post_slug: postSlug,
      estimated_read_time: readTime,
    },
  });
};

// Helper function to categorize questions for analytics
function categorizeQuestion(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('altitude') || q.includes('acclimat'))
    return 'altitude_training';
  if (q.includes('gear') || q.includes('equipment')) return 'gear_advice';
  if (q.includes('training') || q.includes('workout') || q.includes('fitness'))
    return 'training_advice';
  if (q.includes('fear') || q.includes('mental') || q.includes('scared'))
    return 'mental_preparation';
  if (q.includes('cost') || q.includes('money') || q.includes('budget'))
    return 'expedition_costs';
  if (q.includes('route') || q.includes('climb') || q.includes('summit'))
    return 'route_planning';
  if (q.includes('weather') || q.includes('season') || q.includes('when'))
    return 'timing_weather';

  return 'general_mountaineering';
}
