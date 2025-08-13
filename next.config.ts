import type { NextConfig } from "next";

const nextConfig = {
    images: {
        unoptimized: false,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.tcgemporium.com',
            },
        ],
        minimumCacheTTL: 60 * 60 * 24 * 30,
    },
}

export default nextConfig;
