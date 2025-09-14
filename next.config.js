/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com']
  },
  // experimental: {
  //   optimizeCss: true,
  // },
  poweredByHeader: false,
  compress: true,
  // Performance optimizations
  swcMinify: true,
  reactStrictMode: true,
  // Static optimization
  trailingSlash: false,
  // Environment config for Netlify deployment
  output: 'standalone'
};

module.exports = nextConfig;