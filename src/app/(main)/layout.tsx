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
      {/* Dark world — re-scopes all design tokens for the public site */}
      <div data-theme="dark" className="flex min-h-dvh flex-col bg-[#0c0b09]">
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
        {/* Clears the fixed mobile tab bar incl. the iOS home-indicator inset; desktop unaffected */}
        <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <StickyMobileCTA />
        <FilmGrain />
        <CustomCursor />
        <ConciergeUX />
        <CookieConsent />
      </div>
    </LenisProvider>
  );
}
