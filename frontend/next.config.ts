import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    /** Avoid long-lived optimizer cache for the same URL (stale art after deploy). */
    minimumCacheTTL: 0,
    remotePatterns: [
      { protocol: "https", hostname: "api.officialskinksa.store" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    const noStoreStatic = [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
    ];
    return [
      {
        source: "/images/product/:path*",
        headers: noStoreStatic,
      },
      /** `next/image` requests; query string includes width/quality/source URL. */
      {
        source: "/_next/image",
        headers: noStoreStatic,
      },
      /** HTML entry points: CDNs often cache these aggressively. */
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate, s-maxage=120, stale-while-revalidate=0",
          },
        ],
      },
      {
        source: "/products/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate, s-maxage=120, stale-while-revalidate=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
