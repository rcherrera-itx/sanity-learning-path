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
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      }
    ]
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true
    }
  }
} satisfies NextConfig;

export default nextConfig;
