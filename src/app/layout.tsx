import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kreebz Limited | Your Legacy, Meticulously Maintained",
  description: "Where others manage, Kreebz represents. Premium property and estate management for discerning owners in Lagos, Nigeria.",
  icons: {
    icon: "/kreebz-logo.png",
    shortcut: "/kreebz-logo.png",
    apple: "/kreebz-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
