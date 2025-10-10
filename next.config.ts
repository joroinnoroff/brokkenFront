import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["npsus.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brokken-s3.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
