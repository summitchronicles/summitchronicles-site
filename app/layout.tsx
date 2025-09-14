import type { Metadata } from "next";
import { ErrorBoundary } from "./components/organisms/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: "Summit Chronicles - Journey to the Summit",
  description: "Follow the systematic training, preparation, and expedition journey toward mountaineering excellence. Premium adventure preparation with Swiss spa aesthetics.",
  keywords: "mountaineering, training, expedition, summit, adventure, preparation, community support",
  authors: [{ name: "Summit Chronicles" }],
  creator: "Summit Chronicles",
  publisher: "Summit Chronicles",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://summitchronicles.com",
    siteName: "Summit Chronicles",
    title: "Summit Chronicles - Journey to the Summit",
    description: "Follow the systematic training, preparation, and expedition journey toward mountaineering excellence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Summit Chronicles - Journey to the Summit",
    description: "Follow the systematic training, preparation, and expedition journey toward mountaineering excellence.",
    creator: "@summitchronicles",
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
      <body className="font-sans antialiased text-spa-charcoal bg-spa-stone">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}