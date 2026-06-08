import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude large image files from serverless function bundles (keep JSON/config)
  outputFileTracingExcludes: {
    "/*": [
      "public/**/*.png",
      "public/**/*.jpg",
      "public/**/*.jpeg",
      "public/**/*.webp",
      "public/**/*.gif",
    ],
  },
};

export default nextConfig;
