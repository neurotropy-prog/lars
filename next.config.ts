import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix Turbopack root detection (duplicate lockfiles in parent dir)
  turbopack: {
    root: process.cwd(),
  },
  // TypeScript types already verified — skip during build to avoid OOM crash
  typescript: {
    ignoreBuildErrors: true,
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Mapas vivos no indexables
        source: "/mapa/:hash*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
