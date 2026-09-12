import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { Metadata } from "next";
import ThankYouTracker from "@/components/ThankYouTracker";

export const metadata: Metadata = {
  title: "Thank You | Kreebz",
  description: "Thank you for contacting Kreebz. We will be in touch shortly.",
};

const nextStepLabels: Record<string, string> = {
  brochure: "the approved project brochure",
  call: "a call",
  consultation: "a private consultation",
  viewing: "a viewing",
  info: "the information you requested",
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; step?: string }>;
}) {
  const { project, step } = await searchParams;
  const isBourdillon = project === "bourdillon";
  const requested = step ? nextStepLabels[step] : undefined;

  return (
    <main className="min-h-screen bg-obsidian text-off-white flex flex-col items-center justify-center p-6 text-center">
      <ThankYouTracker project={project} />

      <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-8 mx-auto">
        <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-serif mb-4">Thanks — we&apos;ve got it.</h1>
      <p className="text-muted max-w-md mx-auto mb-4 text-lg">
        A principal will get back to you
        {requested ? ` about ${requested}` : ""} within one business day.
      </p>
      <p className="text-muted/70 max-w-md mx-auto mb-10 text-sm">
        If it&apos;s urgent, call us directly.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {isBourdillon ? (
          <Link
            href="/projects/bourdillon#progress"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors uppercase tracking-widest text-sm font-medium"
          >
            View project progress
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors uppercase tracking-widest text-sm font-medium"
          >
            Explore the portfolio
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        <a
          href="tel:+2348069949948"
          className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors text-sm"
        >
          <Phone className="w-4 h-4" /> +234 806 994 9948
        </a>
      </div>
    </main>
  );
}
