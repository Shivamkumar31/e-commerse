/**
 * Next.js config.
 * images.remotePatterns: next/image only optimises images from hosts we whitelist.
 * We whitelist ONLY our own API host (it serves /images/*), derived from API_URL so there is one source of truth.
 */
const api = new URL(process.env.API_URL ?? 'http://localhost:4000');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  images: {
    formats: ['image/avif', 'image/webp'], // modern formats, falls back automatically
    remotePatterns: [
      { protocol: api.protocol.replace(':', ''), hostname: api.hostname, port: api.port, pathname: '/images/**' },
    ],
  },
};

export default nextConfig;
