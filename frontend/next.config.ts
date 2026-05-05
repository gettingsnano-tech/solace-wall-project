import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  || 'http://127.0.0.1:8000';

const nextConfig: NextConfig = {
  async rewrites() {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    if (!apiUrl) {
      console.warn("\x1b[33m%s\x1b[0m", "⚠️ WARNING: NEXT_PUBLIC_API_URL is not set. API proxying will be disabled.");
      return [];
    }

    // Automatically prepend http:// if protocol is missing
    if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      apiUrl = `http://${apiUrl}`;
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
    ]
  },
};

export default nextConfig;
