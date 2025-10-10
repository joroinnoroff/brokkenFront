/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brokken-s3.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**", // allow all paths under S3
      },
    ],
  },
};

module.exports = nextConfig;
