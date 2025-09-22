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
  title: 'Summit Chronicles - Journey to the Summit',
  description:
    'Follow the systematic training, preparation, and expedition journey toward mountaineering excellence. Premium adventure preparation with Swiss spa aesthetics.',
  keywords:
    'mountaineering, training, expedition, summit, adventure, preparation, community support',
  authors: [{ name: 'Summit Chronicles' }],
  creator: 'Summit Chronicles',
  publisher: 'Summit Chronicles',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://summitchronicles.com',
    siteName: 'Summit Chronicles',
    title: 'Summit Chronicles - Journey to the Summit',
    description:
      'Follow the systematic training, preparation, and expedition journey toward mountaineering excellence.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summit Chronicles - Journey to the Summit',
    description:
      'Follow the systematic training, preparation, and expedition journey toward mountaineering excellence.',
    creator: '@summitchronicles',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <OrganizationStructuredData />
        <BreadcrumbStructuredData />
      </head>
      <body
        className={`${montserrat.variable} ${amaticSC.variable} ${oswald.variable} font-sans antialiased text-spa-charcoal bg-spa-stone mobile-safe`}
      >
        {children}
        <FloatingAIButton />
      </body>
    </html>
  );
}
// Deployment force trigger - Sun Sep 21 22:01:40 IST 2025
