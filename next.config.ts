import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude large static assets from serverless function bundles
  outputFileTracingExcludes: {
    "/*": [
      "public/product_images/**/*",
      "public/gallery_images/**/*",
      "public/**/*.png",
      "public/**/*.jpg",
      "public/**/*.jpeg",
      "public/**/*.webp",
    ],
  },
};

export default nextConfig;
