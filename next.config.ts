/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brokken-s3.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "npsus.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "brokken-back.vercel.app",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
