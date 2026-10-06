import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// 'unsafe-eval' is required by Next.js dev-mode HMR but never in production.
// 'unsafe-inline' stays: JSON-LD blocks and the GA bootstrap are inline scripts,
// and nonce-based CSP requires per-request dynamic rendering of every page.
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isProd ? [] : ["'unsafe-eval'"]),
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://maps.googleapis.com",
].join(" ");

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com",
  "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://api.paystack.co https://checkout.paystack.com",
  "media-src 'self' https://*.supabase.co https://*.supabase.in",
  "frame-src 'self' https://www.google.com https://checkout.paystack.com https://js.paystack.co",
  "child-src 'self' https://www.google.com https://checkout.paystack.com https://js.paystack.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "worker-src 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    qualities: [25, 50, 75, 85, 90, 100],
  },
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      // TODO: Add confirmed legacy URLs requiring 301 redirects to canonical slugs here
      // {
      //   source: '/legacy-path/:id',
      //   destination: '/property/:slug',
      //   permanent: true,
      // },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
