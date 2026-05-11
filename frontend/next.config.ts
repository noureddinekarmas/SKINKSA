import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.officialskinksa.store" },
    ],
  },
};

export default nextConfig;
