import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.goalserve.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'data2.goalserve.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'flagpedia.net',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  experimental: {
    cacheComponents: true,
    viewTransition: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
