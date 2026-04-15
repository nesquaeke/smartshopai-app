import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
