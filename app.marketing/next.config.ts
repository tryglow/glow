import createMDX from '@next/mdx';
import { NextConfig } from 'next';
import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
  },
});

const nextConfig: NextConfig = {
  basePath: '/i',
  experimental: {
    manualClientBasePath: true,
  },
  transpilePackages: ['@tryglow/ui'],
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
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
      process.env.NODE_ENV === 'production'
        ? {
            protocol: 'https',
            hostname: 'glow.as',
            port: '',
          }
        : {
            protocol: 'http',
            hostname: 'localhost',
            port: '3000',
          },
    ],
  },
};

// @ts-expect-error
export default withMDX(nextConfig);
