import type { Metadata } from 'next';
import './globals.css';
import './globals-mobile.css';
import { Montserrat, Amatic_SC, Oswald } from 'next/font/google';
import {
  OrganizationStructuredData,
  BreadcrumbStructuredData,
} from './components/seo/StructuredData';
import { FloatingAIButton } from './components/ai/FloatingAIButton';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const amaticSC = Amatic_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-amatic',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://summitchronicles.com'),
  title: {
    default: 'Summit Chronicles - Journey to the Summit',
    template: '%s | Summit Chronicles',
  },
  description:
    "Follow Sunith Kumar's systematic training, preparation, and expedition journey toward conquering the Seven Summits. Expert insights on high-altitude mountaineering, fitness, and gear.",
  keywords:
    'mountaineering, training, expedition, Everest, Seven Summits, adventure, high altitude, climbing, Sherpa culture',
  authors: [{ name: 'Sunith Kumar' }],
  creator: 'Sunith Kumar',
  publisher: 'Summit Chronicles',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://summitchronicles.com',
    siteName: 'Summit Chronicles',
    title: 'Summit Chronicles - Journey to the Seven Summits',
    description:
      'Follow the systematic training, preparation, and expedition journey toward mountaineering excellence.',
    images: [
      {
        url: '/images/og-image.jpg', // Ensure this exists or use a valid path
        width: 1200,
        height: 630,
        alt: 'Summit Chronicles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summit Chronicles - Journey to the Seven Summits',
    description:
      'Follow the systematic training, preparation, and expedition journey toward mountaineering excellence.',
    creator: '@summitchronicles',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <OrganizationStructuredData />
        <BreadcrumbStructuredData />
      </head>
      <body
        className={`${montserrat.variable} ${amaticSC.variable} ${oswald.variable} font-sans antialiased text-white bg-black mobile-safe`}
      >
        {children}
        <FloatingAIButton />
      </body>
    </html>
  );
}
// Deployment force trigger - Sun Sep 21 22:01:40 IST 2025
