/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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
};

module.exports = nextConfig;
