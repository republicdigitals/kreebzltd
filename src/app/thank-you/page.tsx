import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | Kreebz",
  description: "Thank you for contacting Kreebz. We will be in touch shortly.",
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-obsidian text-off-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-8 mx-auto">
        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-serif mb-4">Message Received</h1>
      <p className="text-muted max-w-md mx-auto mb-10 text-lg">
        Thank you for your inquiry. A principal will be in touch shortly to discuss your property needs.
      </p>
      
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors uppercase tracking-widest text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>
    </main>
  );
}
