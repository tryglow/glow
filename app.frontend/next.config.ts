import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

const nextConfig: NextConfig = {
  experimental: {
    nodeMiddleware: true,
  },
  transpilePackages: ['@tryglow/ui'],
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
    ],
  },
};

export default withSentryConfig(withMDX(nextConfig), {
  org: 'hyperdusk',
  project: 'glow',
  silent: false,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
