/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: '/',
      destination: '/i/landing-page',
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dev.oneda.sh',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.oneda.sh',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
