
/** @type {import('next').NextConfig} */
// Forcing server restart to clear cache
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
  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  // Bundle optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: '*.strava.com' },
      { protocol: 'https', hostname: 'summitchronicles.com' },
      { protocol: 'https', hostname: 'summitchronicles.s3.amazonaws.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'nvoljnojiondyjhxwkqq.supabase.co' }
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
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
export default nextConfig;
