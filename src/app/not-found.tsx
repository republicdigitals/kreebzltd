import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Kreebz",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-obsidian text-off-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl md:text-9xl font-accent text-gold mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl md:text-4xl font-serif mb-4">Page Not Found</h2>
      <p className="text-muted max-w-md mx-auto mb-10 text-lg">
        The property or page you are looking for has been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link 
        href="/"
        className="inline-flex items-center gap-2 border border-gold/30 hover:border-gold hover:bg-gold/5 text-gold transition-all uppercase tracking-[0.2em] text-xs font-medium px-8 py-4 rounded-md"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>
    </main>
  );
}
