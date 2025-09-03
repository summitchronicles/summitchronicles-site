import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ===== META TAGS ===== */}
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Summit Chronicles – Documenting the Seven Summits journey: training logs, expeditions, and reflections."
        />
        <meta name="theme-color" content="#1e3a8a" /> {/* Alpine Blue */}

        {/* ===== OPEN GRAPH (SEO + SOCIAL SHARING) ===== */}
        <meta property="og:title" content="Summit Chronicles" />
        <meta
          property="og:description"
          content="Follow the Seven Summits journey – expeditions, training, gear, and reflections."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://summitchronicles.com" />
        <meta property="og:image" content="/og-image.jpg" />

        {/* ===== TWITTER CARD ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Summit Chronicles" />
        <meta
          name="twitter:description"
          content="Climbing the Seven Summits – stories, training, and reflections."
        />
        <meta name="twitter:image" content="/og-image.jpg" />

        {/* ===== FAVICONS ===== */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ===== FONTS ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}