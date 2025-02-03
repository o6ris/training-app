/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/createSession',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
