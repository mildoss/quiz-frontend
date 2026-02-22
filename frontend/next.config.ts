import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dwn1h18268y7b.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;