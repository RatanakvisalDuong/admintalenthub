import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['hips.hearstapps.com', 'lh3.googleusercontent.com',"talenthub.newlinkmarketing.com"],
  },
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  
};

export default nextConfig;
