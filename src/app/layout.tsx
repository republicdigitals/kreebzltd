import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://kreebzltd.com"),
  title: "Kreebz Ltd | Official Marketing & Facility Management",
  description:
    "Kreebz Ltd is the official marketing and facility management company for Folio Properties and IBJ Property Development Company. We market premium properties, manage estates, provide concierge and private aviation services, and connect residents to trusted contractors in Lagos, Nigeria.",
  icons: {
    icon: "/kreebz-logo.png",
    shortcut: "/kreebz-logo.png",
    apple: "/kreebz-logo.png",
  },
  openGraph: {
    title: "Kreebz Ltd | Official Marketing & Facility Management",
    description:
      "Kreebz Ltd is the official marketing and facility management company for Folio Properties and IBJ Property Development Company.",
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
      "Kreebz Ltd is the official marketing and facility management company for Folio Properties and IBJ Property Development Company.",
    images: ["/twitter-image.png"],
  },
};

import { LenisProvider } from "@/components/LenisProvider";
import FilmGrain from "@/components/FilmGrain";
import CustomCursor from "@/components/CustomCursor";
import ConciergeUX from "@/components/ConciergeUX";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LenisProvider>
          {children}
        </LenisProvider>
        <FilmGrain />
        <CustomCursor />
        <ConciergeUX />
      </body>
    </html>
  );
}
