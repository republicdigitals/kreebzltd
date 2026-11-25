import { NextResponse } from "next/server";

// Security headers for all matched responses.
//
// Auth gating deliberately does NOT happen here: redirect responses emitted
// at this layer are cacheable independently of the session cookie at the CDN
// edge, which stranded authenticated users on the login page. Admin and
// account guards run in the server render layer instead (see
// src/app/admin/(authed)/layout.tsx).
export default function proxy() {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  return response;
}

export const config = {
  matcher: [
    // Match all pages for security headers (exclude static/image assets and APIs)
    "/((?!_next/static|_next/image|favicon.ico|images|kreebz-logo.png|sitemap.xml|robots.txt|api).*)",
  ],
};
