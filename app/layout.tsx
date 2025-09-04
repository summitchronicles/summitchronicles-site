import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import AnalyticsProvider from "@/app/components/AnalyticsProvider";
import ServiceWorkerProvider from "@/app/components/ServiceWorkerProvider";
import WebVitalsProvider from "@/app/components/WebVitalsProvider";
import { getOrganizationSchema } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Summit Chronicles — Mountains. Mindset. Momentum.",
  description: "Professional mountaineering training, Seven Summits expedition planning, gear reviews, and AI-powered climbing guidance. Join the journey to conquer the world's highest peaks.",
  keywords: "mountaineering, seven summits, everest training, climbing gear, expedition planning, high altitude training, mountaineering AI, climbing coach",
  authors: [{ name: "Summit Chronicles Team" }],
  creator: "Summit Chronicles",
  publisher: "Summit Chronicles",
  metadataBase: new URL('https://summitchronicles.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://summitchronicles.com',
    title: 'Summit Chronicles — Seven Summits Journey',
    description: 'Professional mountaineering training, Seven Summits expedition planning, gear reviews, and AI-powered climbing guidance.',
    siteName: 'Summit Chronicles',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Summit Chronicles - Seven Summits Journey',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summit Chronicles — Mountains. Mindset. Momentum.',
    description: 'Professional mountaineering training, Seven Summits expedition planning, gear reviews, and AI-powered climbing guidance.',
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
    }
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://summitchronicles.com" />
        <link rel="dns-prefetch" href="https://ipapi.co" />
        <meta name="theme-color" content="#F59E0B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        {/* RESPONSIVE NAVBAR */}
        <header className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg sm:text-xl font-bold tracking-wide text-white hover:text-summitGold transition-colors duration-300">
              Summit Chronicles
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <Link
                href="/expeditions"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Expeditions
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/training"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Training
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/training-analytics"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Training Data
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/gear"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Gear
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/blog"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Blog
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/analytics"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Analytics
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/ask"
                className="px-4 py-2 bg-summitGold text-black rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300"
              >
                Ask AI
              </Link>
            </div>

            {/* Mobile Navigation - Simple toggle */}
            <div className="md:hidden">
              <button className="p-2 text-white hover:text-summitGold transition-colors duration-300" aria-label="Menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </nav>
        </header>

        {/* PROVIDERS */}
        <AnalyticsProvider />
        <ServiceWorkerProvider />
        <WebVitalsProvider />
        
        {/* MAIN CONTENT */}
        <main className="pt-20">{children}</main>

        {/* MODERN FOOTER */}
        <footer className="bg-black border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="text-2xl font-bold text-white mb-4">Summit Chronicles</div>
            <div className="text-white/60 mb-6">
              © {new Date().getFullYear()} · Documenting the Seven Summits Journey
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-white/40">
              <span>About</span>
              <span>Contact</span>
              <span>Privacy</span>
              <span>Follow the Journey</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}