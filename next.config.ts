import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // giúp phát hiện lỗi react nghiêm trọng sớm
  experimental: {
    serverActions: {},
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  secret: process.env.AUTH_SECRET,
};

module.exports = nextConfig;
