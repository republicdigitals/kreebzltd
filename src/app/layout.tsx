import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://kreebzltd.com"),
  title: "Kreebz Ltd | Official Marketing & Facility Management",
  description:
    "Kreebz Ltd is a premium marketing and facility management company. We market premium properties, manage estates, provide concierge and private aviation services, and connect residents to trusted contractors in Lagos, Nigeria.",
  icons: {
    icon: "/kreebz-logo.png",
    shortcut: "/kreebz-logo.png",
    apple: "/kreebz-logo.png",
  },
  openGraph: {
    title: "Kreebz Ltd | Official Marketing & Facility Management",
    description:
      "Kreebz Ltd is a premium marketing and facility management company.",
    url: "/",
    siteName: "Kreebz Ltd",
    images: ["/opengraph-image.png"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kreebz Ltd | Official Marketing & Facility Management",
    description:
      "Kreebz Ltd is a premium marketing and facility management company.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
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
      <body className="min-h-full flex flex-col">
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}
