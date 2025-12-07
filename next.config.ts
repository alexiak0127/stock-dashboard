import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {//for github and google profile pics
        remotePatterns: [
            {protocol: "https", hostname: "avatars.githubusercontent.com",},
            {protocol: "https", hostname: "lh3.googleusercontent.com",},
        ],
    },
};

export default nextConfig;
