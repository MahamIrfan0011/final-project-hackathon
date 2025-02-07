
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**", // This ensures it matches the image paths under 'images' directory
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/studio/:path*",
        destination: "/studio/index.html",
      },
    ];
  },
};

export default nextConfig;
