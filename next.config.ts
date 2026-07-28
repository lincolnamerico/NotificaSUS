import type { NextConfig } from "next";

const gestaoUrl = process.env.GESTAO_URL;
const isGestaoSubdomain = process.env.VERCEL_URL?.startsWith("gestao.");

const nextConfig: NextConfig = {
  ...(isGestaoSubdomain && gestaoUrl ? { assetPrefix: gestaoUrl } : {}),
  async redirects() {
    if (process.env.NODE_ENV === "production" && gestaoUrl) {
      return [
        {
          source: "/gestao/:path*",
          destination: `${gestaoUrl}/:path*`,
          permanent: true,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
