import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import AppProviders from "@/components/AppProviders";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { LenisProvider } from "@/components/LenisProvider";
import FilmGrain from "@/components/FilmGrain";
import CustomCursor from "@/components/CustomCursor";
import ConciergeUX from "@/components/ConciergeUX";
import CookieConsent from "@/components/CookieConsent";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <LenisProvider>
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <FilmGrain />
        <CustomCursor />
        <ConciergeUX />
        <CookieConsent />
      </LenisProvider>
    </AppProviders>
  );
}
