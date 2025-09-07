import {withSentryConfig} from '@sentry/nextjs';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.strava.com' },
      { protocol: 'https', hostname: 'summitchronicles.com' },
      { protocol: 'https', hostname: '*.supabase.co' }
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    },
    // Cache optimization for static assets
    {
      source: '/sw.js',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate'
        }
      ]
    },
    {
      source: '/(.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)$)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    // API endpoints caching
    {
      source: '/api/health',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=60, s-maxage=60'
        }
      ]
    },
    {
      source: '/api/analytics/dashboard',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, s-maxage=300'
        }
      ]
    }
  ],
  // Enable compression and other optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/components': '/app/components',
        '@/lib': '/lib',
      }
      
      // Enable tree shaking for better bundle analysis only in production
      config.optimization.usedExports = true
    }
    
    return config
  },
  experimental: {
    optimizePackageImports: ['framer-motion', '@heroicons/react', 'lucide-react'],
    optimizeServerReact: true,
    serverMinification: true,
    serverSourceMaps: false,
    // Enable static generation optimizations
    gzipSize: true,
  },
  // Enable output file tracing for smaller deployments
  output: 'standalone',
  
  // Optimize redirects and rewrites
  redirects: async () => [
    // Legacy redirects
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
    {
      source: '/blog/index',
      destination: '/blog',
      permanent: true,
    },
    // Personal branding navigation redirects
    {
      source: '/about',
      destination: '/my-story',
      permanent: true,
    },
    {
      source: '/expeditions',
      destination: '/the-journey',
      permanent: true,
    },
    {
      source: '/blog',
      destination: '/blogs',
      permanent: true,
    },
    {
      source: '/insights',
      destination: '/blogs',
      permanent: true,
    },
    {
      source: '/contact',
      destination: '/connect',
      permanent: true,
    },
    {
      source: '/ask',
      destination: '/ask-sunith',
      permanent: true,
    },
    // Analytics and gear pages keep same URL but update content
    {
      source: '/analytics',
      destination: '/training',
      permanent: false, // Temporary redirect while reorganizing
    },
    {
      source: '/training-analytics',
      destination: '/training',
      permanent: true,
    }
  ],
  
  // Add sitemap generation
  trailingSlash: false,
};
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "summit-chronicles",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
});