import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig = {
  /* config options here */
  cacheComponents: true,

  cacheLife: {
    default: sanity,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io'
      }
    ]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  }
} satisfies NextConfig;

export default nextConfig;
