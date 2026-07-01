import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Intercept and proxy API & Upload requests
  if (pathname.startsWith("/api/") || pathname.startsWith("/uploads/")) {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    if (!apiUrl) {
      console.warn("⚠️ WARNING: NEXT_PUBLIC_API_URL is not set. API proxying will be disabled.");
      return NextResponse.next();
    }

    // Automatically prepend https:// or http:// if protocol is missing
    if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
      apiUrl = `https://${apiUrl}`;
    }

    // Construct the destination URL pointing to the backend API
    const destinationUrl = new URL(pathname + search, apiUrl);

    // Clone the request headers and overwrite the 'host' header to match the destination.
    // This resolves routing loop errors when deployed behind custom domains and Cloudflare.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("host", destinationUrl.host);

    return NextResponse.rewrite(destinationUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Optimization: Match only paths starting with /api/ or /uploads/
export const config = {
  matcher: [
    "/api/:path*",
    "/uploads/:path*",
  ],
};
