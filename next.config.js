/** @type {import('next').NextConfig} */
const nextConfig = {
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
