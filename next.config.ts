import type { NextConfig } from "next";

const buildId =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
  process.env.GITHUB_SHA?.slice(0, 7) ??
  "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: "v0.2 beta",
    NEXT_PUBLIC_BUILD_ID: buildId
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "image.ceneostatic.pl"
      },
      {
        protocol: "https",
        hostname: "**.allegro.pl"
      },
      {
        protocol: "https",
        hostname: "a.allegroimg.com"
      }
    ]
  }
};

export default nextConfig;
