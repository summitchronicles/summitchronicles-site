// Force dynamic rendering to avoid build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import AnalyticsProvider from '@/app/components/AnalyticsProvider';
import GoogleAnalytics from '@/app/components/GoogleAnalytics';
import SessionProvider from '@/app/components/auth/SessionProvider';
import ServiceWorkerProvider from '@/app/components/ServiceWorkerProvider';
import WebVitalsProvider from '@/app/components/WebVitalsProvider';
import EnhancedNavigation from '@/app/components/navigation/EnhancedNavigation';
import { getOrganizationSchema } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Summit Chronicles — Mountains. Mindset. Momentum.',
  description:
    "Professional mountaineering training, Seven Summits expedition planning, gear reviews, and AI-powered climbing guidance. Join the journey to conquer the world's highest peaks.",
  keywords:
    'mountaineering, seven summits, everest training, climbing gear, expedition planning, high altitude training, mountaineering AI, climbing coach',
  authors: [{ name: 'Summit Chronicles Team' }],
  creator: 'Summit Chronicles',
  publisher: 'Summit Chronicles',
  metadataBase: new URL('https://summitchronicles.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://summitchronicles.com',
    title: 'Summit Chronicles — Seven Summits Journey',
    description:
      'Professional mountaineering training, Seven Summits expedition planning, gear reviews, and AI-powered climbing guidance.',
    siteName: 'Summit Chronicles',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Summit Chronicles - Seven Summits Journey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summit Chronicles — Mountains. Mindset. Momentum.',
    description:
      'Professional mountaineering training, Seven Summits expedition planning, gear reviews, and AI-powered climbing guidance.',
    images: ['/og-image.jpg'],
    creator: '@summitchronicles',
    site: '@summitchronicles',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  category: 'sports',
  classification: 'mountaineering, outdoors, fitness, adventure sports',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationSchema()),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://summitchronicles.com" />
        <link rel="dns-prefetch" href="https://ipapi.co" />
        <meta name="theme-color" content="#F59E0B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <SessionProvider>
          {/* ENHANCED NAVIGATION */}
          <EnhancedNavigation />

          {/* PROVIDERS */}
          <AnalyticsProvider />
          <GoogleAnalytics />
          <ServiceWorkerProvider />
          <WebVitalsProvider />

          {/* MAIN CONTENT */}
          <main className="pt-20">{children}</main>
        </SessionProvider>

        {/* MODERN FOOTER */}
        <footer className="bg-black border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Personal Brand Column */}
              <div className="md:col-span-2">
                <div className="text-2xl font-bold text-white mb-4">
                  Summit Chronicles
                </div>
                <p className="text-white/60 mb-6 max-w-md">
                  Follow my journey to climb the Seven Summits. Real insights
                  from actual expeditions, training data, and lessons learned on
                  the world's highest peaks.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-white/40">Progress:</span>
                    <span className="text-summitGold font-semibold ml-2">
                      3 of 7 Summits
                    </span>
                  </div>
                  <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-summitGold to-yellow-400 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.round((3 / 7) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">The Journey</h3>
                <div className="space-y-2 text-sm">
                  <Link
                    href="/my-story"
                    className="block text-white/60 hover:text-summitGold transition-colors"
                  >
                    My Story
                  </Link>
                  <Link
                    href="/the-journey"
                    className="block text-white/60 hover:text-summitGold transition-colors"
                  >
                    Seven Summits
                  </Link>
                  <Link
                    href="/blogs"
                    className="block text-white/60 hover:text-summitGold transition-colors"
                  >
                    Latest Blogs
                  </Link>
                  <Link
                    href="/training"
                    className="block text-white/60 hover:text-summitGold transition-colors"
                  >
                    Training Data
                  </Link>
                </div>
              </div>

              {/* Connect */}
              <div>
                <h3 className="text-white font-semibold mb-4">Connect</h3>
                <div className="space-y-2 text-sm">
                  <Link
                    href="/connect"
                    className="block text-white/60 hover:text-summitGold transition-colors"
                  >
                    Work Together
                  </Link>
                  <Link
                    href="/ask-sunith"
                    className="block text-white/60 hover:text-summitGold transition-colors"
                  >
                    Ask Questions
                  </Link>
                  <a
                    href="mailto:hello@summitchronicles.com"
                    className="block text-white/60 hover:text-summitGold transition-colors"
                  >
                    Email Me
                  </a>
                  <Link
                    href="/connect#media"
                    className="block text-white/60 hover:text-summitGold transition-colors"
                  >
                    Media Kit
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-white/40 text-sm mb-4 md:mb-0">
                  © {new Date().getFullYear()} Sunith Kumar · Summit Chronicles
                  · Climbing the Seven Summits
                </div>
                <div className="flex items-center gap-6 text-sm text-white/40">
                  <Link
                    href="/privacy"
                    className="hover:text-summitGold transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-summitGold transition-colors"
                  >
                    Terms
                  </Link>
                  <span>Follow the Journey 🏔️</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
