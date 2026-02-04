import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    // Nới rộng giới hạn lên 10MB hoặc 20MB tùy nhu cầu của bạn
    serverActions: {
      bodySizeLimit: '10mb', 
    },
  },
};

export default nextConfig;
