import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://kreebzltd.com"),
  title: "Kreebz | Property, Management & Private Aviation — Lagos",
  description:
    "Vetted homes, property management, concierge, and private jet charter in Lagos — one team, one principal, one standard.",
  icons: {
    icon: "/kreebz-logo.png",
    shortcut: "/kreebz-logo.png",
    apple: "/kreebz-logo.png",
  },
  openGraph: {
    title: "Kreebz | Property, Management & Private Aviation — Lagos",
    description:
      "Vetted homes, property management, concierge, and private jet charter in Lagos.",
    url: "/",
    siteName: "Kreebz Ltd",
    images: ["/opengraph-image.png"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kreebz | Property, Management & Private Aviation — Lagos",
    description:
      "Vetted homes, property management, concierge, and private jet charter in Lagos.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

import Script from "next/script";
import AppProviders from "@/components/AppProviders";

// Only allow well-formed GA4 IDs — prevents a malformed env value from
// breaking out of the inline gtag config string.
const gaId = /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID ?? "")
  ? process.env.NEXT_PUBLIC_GA_ID
  : undefined;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased overflow-x-clip">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Kreebz Ltd",
              "image": "https://kreebzltd.com/kreebz-logo.png",
              "url": "https://kreebzltd.com",
              "telephone": "+2348069949948",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lagos",
                "addressCountry": "NG"
              },
              "description": "Premium real estate marketing and facility management in Lagos, Nigeria.",
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip">
        {/* Google Analytics — only rendered when a real measurement ID is configured */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
