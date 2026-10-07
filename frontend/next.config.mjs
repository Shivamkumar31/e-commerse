/**
 * Next.js configuration.
 *
 * images.remotePatterns: next/image only optimises images
 * from hosts that we explicitly whitelist.
 *
 * We whitelist our API host because it serves /images/*
 * and derive it from API_URL so there is one source of truth.
 */

const api = new URL(
  process.env.API_URL ?? "http://localhost:4000"
);

const nextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  outputFileTracingRoot: process.cwd(),

  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      {
        protocol: api.protocol.replace(":", ""),
        hostname: api.hostname,
        port: api.port,
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;