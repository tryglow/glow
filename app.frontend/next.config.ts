import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: '/',
      destination: '/i/landing-page',
    },
    {
      source: '/new-api/:path*',
      destination: 'http://localhost:3001/:path*',
    },
  ],
  redirects: async () => [
    {
      source: '/pricing',
      destination: '/i/pricing',
      permanent: true,
    },
  ],
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  logging: {
    fetches: {
      fullUrl: true,
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
    ],
  },
};

export default withSentryConfig(withMDX(nextConfig), {
  org: 'hyperdusk',
  project: 'glow',
  silent: false,
  hideSourceMaps: true,
});
