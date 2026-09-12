import { Suspense } from "react";
import Navigation from "@/components/Navigation";

import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { LenisProvider } from "@/components/LenisProvider";
import FilmGrain from "@/components/FilmGrain";
import CustomCursor from "@/components/CustomCursor";
import ConciergeUX from "@/components/ConciergeUX";
import CookieConsent from "@/components/CookieConsent";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LenisProvider>
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      {/* pb-24 clears the fixed mobile tab bar; desktop unaffected */}
      <main className="flex-1 pb-24 md:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <StickyMobileCTA />
      <FilmGrain />
      <CustomCursor />
      <ConciergeUX />
      <CookieConsent />
    </LenisProvider>
  );
}
