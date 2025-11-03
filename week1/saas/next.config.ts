import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static HTML export for AWS
  images: {
    unoptimized: true  // Required for static export
  }
};

export default nextConfig;
