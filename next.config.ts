import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {//for github profile pics
        remotePatterns: [
            {protocol: "https", hostname: "avatars.githubusercontent.com",},
        ],
    },
};

export default nextConfig;
