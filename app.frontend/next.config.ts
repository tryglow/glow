import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@trylinky/ui'],
  rewrites: async () => [
    {
      source: '/new-api/:path*',
      destination: 'http://localhost:3001/:path*',
    },
    {
      source: '/',
      destination: `${process.env.NEXT_PUBLIC_MARKETING_URL}/i`,
    },
    {
      source: '/sitemap.xml',
      destination: `${process.env.NEXT_PUBLIC_MARKETING_URL}/i/sitemap.xml`,
    },
    {
      source: '/i/:path*',
      destination: `${process.env.NEXT_PUBLIC_MARKETING_URL}/i/:path*`,
    },
  ],
  redirects: async () => [
    {
      source: '/pricing',
      destination: '/i/pricing',
      permanent: true,
    },
    {
      source: '/explore',
      destination: '/i/explore',
      permanent: true,
    },
  ],
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dev.glow.as',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.glow.as',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dev.lin.ky',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.lin.ky',
        port: '',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: 'hyperdusk',
  project: 'glow',
  silent: false,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
