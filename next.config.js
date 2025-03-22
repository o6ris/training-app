/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  scope: "/app",
  sw: "service-worker.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["amqqrxjjxodlusbprjvh.supabase.co"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false,
      },
    ];
  },
});

module.exports = nextConfig;
