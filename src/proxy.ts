import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(request) {
    const response = NextResponse.next();

    // Security headers for all matched responses
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        
        // If it's an admin route, require a token
        if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
          return !!token;
        }
        
        // Otherwise, allow access (so public pages get the headers)
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    // Match admin UI
    "/admin/:path*",
    // Match all public pages for security headers (exclude static/image assets)
    "/((?!_next/static|_next/image|favicon.ico|images|kreebz-logo.png|sitemap.xml|robots.txt|api).*)",
  ],
};
