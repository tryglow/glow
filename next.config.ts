import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

import { withSentryConfig } from '@sentry/nextjs';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: '/',
      destination: '/i/landing-page',
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
  reactStrictMode: true, // Enabling reactStrictMode
};

export default withSentryConfig(withMDX(nextConfig), {
  org: 'zaviaogocm',
  project: 'javascript-react',
  silent: false,
  hideSourceMaps: true,
});