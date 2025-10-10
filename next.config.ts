import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["npsus.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'brokken-s3.s3.amazonaws.com',
        port: "",
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;
