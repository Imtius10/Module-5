import type { NextConfig } from "next";

/** Where the `/api/*` rewrite forwards browser requests (server-side). */
const API_ORIGIN = (
  process.env.API_PROXY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rent-nest-api-seven.vercel.app"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Same-origin proxy: the browser calls `/api/*` on this host and Next
  // forwards it to the API, so CORS on the API host never applies.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
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
