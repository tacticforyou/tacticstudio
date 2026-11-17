import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
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
