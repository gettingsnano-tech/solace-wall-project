import type { NextConfig } from "next";

const API_URL = (process.env.NEXT_PUBLIC_API_URL);
if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set. API requests may fail.");
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${API_URL}/uploads/:path*`,
      },
    ]
  },
};

export default nextConfig;
