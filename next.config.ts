import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [360, 390, 430, 640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
