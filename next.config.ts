import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["npsus.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;
