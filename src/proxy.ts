import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security proxy — protects admin UI and write-method API endpoints.
 *
 * - GET /api/properties is public (read-only listing).
 * - POST/PUT/DELETE /api/properties requires a Bearer token (ADMIN_API_KEY).
 * - All /admin routes require the same Bearer token via a session cookie.
 *
 * Set ADMIN_API_KEY in your .env / Netlify environment variables.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Protect write-method API routes ─────────────────────────────
  if (pathname.startsWith("/api/properties")) {
    if (["POST", "PUT", "DELETE"].includes(request.method)) {
      const authHeader = request.headers.get("authorization");
      const sessionCookie = request.cookies.get("kreebz_admin_session");
      const expectedKey = process.env.ADMIN_API_KEY;

      const hasValidBearer = expectedKey && authHeader === `Bearer ${expectedKey}`;
      const hasValidCookie = expectedKey && sessionCookie?.value === expectedKey;

      if (!hasValidBearer && !hasValidCookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  // ── Protect admin UI ────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("kreebz_admin_session");
    const expectedKey = process.env.ADMIN_API_KEY;

    if (!expectedKey || sessionCookie?.value !== expectedKey) {
      // Return a simple login prompt page
      return new NextResponse(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kreebz Admin — Login</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0a; font-family: system-ui, -apple-system, sans-serif; color: #fff; }
    .card { background: #171717; border: 1px solid #262626; border-radius: 12px; padding: 48px; max-width: 400px; width: 100%; }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.02em; }
    p { font-size: 14px; color: #a3a3a3; margin-bottom: 32px; }
    label { display: block; font-size: 12px; font-weight: 500; color: #a3a3a3; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    input { width: 100%; background: #0a0a0a; border: 1px solid #262626; border-radius: 8px; padding: 12px 16px; color: #fff; font-size: 14px; outline: none; transition: border-color 0.2s; }
    input:focus { border-color: #525252; }
    button { width: 100%; margin-top: 24px; padding: 12px; background: #fff; color: #000; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    button:hover { background: #e5e5e5; }
    .error { color: #ef4444; font-size: 13px; margin-top: 12px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Kreebz Admin</h1>
    <p>Enter the admin key to continue.</p>
    <form id="loginForm">
      <label for="key">Admin Key</label>
      <input type="password" id="key" name="key" placeholder="Enter admin key" required autocomplete="current-password" />
      <button type="submit">Sign In</button>
      <p class="error" id="error">Invalid admin key. Please try again.</p>
    </form>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const key = document.getElementById('key').value;
      // Set the session cookie and reload — the proxy will validate it
      document.cookie = 'kreebz_admin_session=' + encodeURIComponent(key) + '; path=/; max-age=86400; SameSite=Strict; Secure';
      // Verify by reloading — if invalid, we'll get this page again
      const res = await fetch(window.location.href, { credentials: 'same-origin' });
      if (res.ok && !res.headers.get('content-type')?.includes('text/html')) {
        window.location.reload();
      } else {
        // Try a simple reload to let the proxy check the cookie
        window.location.reload();
      }
    });
  </script>
</body>
</html>`,
        {
          status: 401,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }
  }

  // ── Security headers for all responses ──────────────────────────
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  matcher: [
    // Match admin UI and API routes, skip static assets
    "/admin/:path*",
    "/api/:path*",
    // Match all public pages for security headers (exclude static/image assets)
    "/((?!_next/static|_next/image|favicon.ico|images|kreebz-logo.png|sitemap.xml|robots.txt).*)",
  ],
};
