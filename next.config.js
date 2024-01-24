/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => [
    {
      source: '/',
      destination: '/i/landing-page',
    },
  ],
  images: {
    domains: ['cdn.dev.oneda.sh', 'cdn.oneda.sh'],
  },
};

module.exports = nextConfig;
