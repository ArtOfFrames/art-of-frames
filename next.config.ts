import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bypass image optimization to serve images directly from public/
  // (avoids 400 errors from _next/image when filenames don't match exactly)
  images: {
    unoptimized: true,
  },
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
