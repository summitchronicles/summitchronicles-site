// Summit Chronicles Analytics Tracking Library
import { v4 as uuidv4 } from 'uuid';

interface SessionData {
  sessionId: string;
  fingerprint?: string;
  userAgent?: string;
  country?: string;
  region?: string;
  city?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface PageViewData {
  sessionId: string;
  pageUrl: string;
  pageTitle?: string;
  referrerUrl?: string;
  timeOnPage?: number;
  scrollDepth?: number;
  interactions?: number;
}

interface AIInteractionData {
  sessionId: string;
  question: string;
  questionCategory?: string;
  responseTime: number;
  responseLength?: number;
  sourcesCount?: number;
  userRating?: number;
  userFeedback?: string;
  wasHelpful?: boolean;
  retrievalScore?: number;
  tokensUsed?: number;
  errorOccurred?: boolean;
  errorType?: string;
}

class AnalyticsTracker {
  private sessionId: string;
  private startTime: number = Date.now();
  private pageStartTime: number = Date.now();
  private interactions: number = 0;
  private maxScrollDepth: number = 0;
  private isTracking: boolean = true;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initializeTracking();
  }

  private getOrCreateSessionId(): string {
    const existing = sessionStorage.getItem('summit_session_id');
    if (existing) return existing;
    
    const newId = uuidv4();
    sessionStorage.setItem('summit_session_id', newId);
    return newId;
  }

  private generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Summit Chronicles Analytics', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).slice(0, 32);
  }

  private getLocationData(): Promise<{country?: string, region?: string, city?: string}> {
    return fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => ({
        country: data.country_name,
        region: data.region,
        city: data.city
      }))
      .catch(() => ({}));
  }

  private getUTMParams(): {utmSource?: string, utmMedium?: string, utmCampaign?: string} {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined
    };
  }

  private async track(type: string, data: any) {
    if (!this.isTracking) return;
    
    const payload = { type, data };
    
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.warn('Analytics tracking failed:', response.status);
        // Queue for offline sync if network error
        if (!navigator.onLine) {
          this.queueForOfflineSync(payload);
        }
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
      // Queue for offline sync if network error
      this.queueForOfflineSync(payload);
    }
  }

  private async queueForOfflineSync(payload: any) {
    try {
      // Use the offline queue utility if available
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const { addToOfflineQueue } = await import('@/app/components/ServiceWorkerProvider');
        await addToOfflineQueue(payload);
      }
    } catch (error) {
      console.warn('Failed to queue analytics for offline sync:', error);
    }
  }

  async initializeTracking() {
    // Track session
    try {
      const locationData = await this.getLocationData();
      const utmParams = this.getUTMParams();
      
      const sessionData: SessionData = {
        sessionId: this.sessionId,
        fingerprint: this.generateFingerprint(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
        ...locationData,
        ...utmParams
      };
      
      await this.track('session', sessionData);
    } catch (error) {
      console.warn('Failed to initialize session tracking:', error);
    }

    // Track page view
    this.trackPageView();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Track interactions
    ['click', 'scroll', 'keydown', 'mousedown'].forEach(event => {
      document.addEventListener(event, () => {
        this.interactions++;
      }, { passive: true });
    });

    // Track scroll depth
    let throttleTimer: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
        this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent);
        throttleTimer = null as any;
      }, 100);
    }, { passive: true });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackPageExit();
      } else {
        this.pageStartTime = Date.now();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackPageExit();
    });

    // Track hash/route changes for SPA
    let currentPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        this.trackPageExit();
        currentPath = window.location.pathname;
        this.trackPageView();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  private trackPageView() {
    this.pageStartTime = Date.now();
    this.interactions = 0;
    this.maxScrollDepth = 0;

    const pageData: Partial<PageViewData> = {
      sessionId: this.sessionId,
      pageUrl: window.location.pathname + window.location.search,
      pageTitle: document.title,
      referrerUrl: document.referrer || undefined
    };

    this.track('pageview', pageData);
  }

  private trackPageExit() {
    const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000);
    
    const exitData: PageViewData = {
      sessionId: this.sessionId,
      pageUrl: window.location.pathname + window.location.search,
      pageTitle: document.title,
      timeOnPage,
      scrollDepth: this.maxScrollDepth,
      interactions: this.interactions
    };

    // Use sendBeacon for reliable tracking on page exit
    const payload = JSON.stringify({ type: 'pageview', data: exitData });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', payload);
    } else {
      this.track('pageview', exitData);
    }
  }

  // Public methods for manual tracking
  async trackAIInteraction(data: Omit<AIInteractionData, 'sessionId'>) {
    const interactionData: AIInteractionData = {
      ...data,
      sessionId: this.sessionId
    };
    
    await this.track('ai_interaction', interactionData);
  }

  trackCustomEvent(eventName: string, properties?: Record<string, any>) {
    const eventData = {
      sessionId: this.sessionId,
      eventName,
      properties,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.pathname
    };
    
    this.track('custom_event', eventData);
  }

  // Method to disable tracking (for privacy compliance)
  disableTracking() {
    this.isTracking = false;
    localStorage.setItem('summit_analytics_disabled', 'true');
  }

  // Method to enable tracking
  enableTracking() {
    this.isTracking = true;
    localStorage.removeItem('summit_analytics_disabled');
  }

  // Check if tracking is disabled
  isTrackingDisabled(): boolean {
    return localStorage.getItem('summit_analytics_disabled') === 'true';
  }
}

// Singleton instance
let analyticsInstance: AnalyticsTracker | null = null;

export function initializeAnalytics(): AnalyticsTracker {
  if (typeof window === 'undefined') return null as any; // SSR check
  
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker();
  }
  return analyticsInstance;
}

export function getAnalytics(): AnalyticsTracker | null {
  return analyticsInstance;
}

// Convenience functions
export function trackAIInteraction(data: Omit<AIInteractionData, 'sessionId'>) {
  const analytics = getAnalytics();
  if (analytics) {
    analytics.trackAIInteraction(data);
  }
}

export function trackCustomEvent(eventName: string, properties?: Record<string, any>) {
  const analytics = getAnalytics();
  if (analytics) {
    analytics.trackCustomEvent(eventName, properties);
  }
}

// Privacy utilities
export function disableAnalytics() {
  const analytics = getAnalytics();
  if (analytics) {
    analytics.disableTracking();
  }
}

export function enableAnalytics() {
  const analytics = getAnalytics();
  if (analytics) {
    analytics.enableTracking();
  }
}

export function isAnalyticsDisabled(): boolean {
  const analytics = getAnalytics();
  return analytics ? analytics.isTrackingDisabled() : false;
}