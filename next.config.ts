import type { NextConfig } from "next";
import { imageQuality } from "./lib/image-quality";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    qualities: [75, imageQuality],
  },
  outputFileTracingIncludes: {
    "/": ["./content/projects/*.md"],
    "/projects/*": ["./content/projects/*.md"],
    "/sitemap.xml": ["./content/projects/*.md"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
