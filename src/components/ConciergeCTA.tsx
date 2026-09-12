import { ArrowRight, Sparkles } from "lucide-react";
import Button from "./ui/Button";

export default function ConciergeCTA() {
  return (
    <div className="w-full bg-obsidian-light/30 border border-border/20 rounded-[var(--radius-lg)] py-16 px-6 text-center mt-12 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />

      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-6">
          <Sparkles size={20} strokeWidth={1.5} />
        </div>

        <h3 className="text-h3 text-off-white font-light mb-4">
          Know exactly what you want?
        </h3>

        <p className="text-muted tracking-wide text-body leading-relaxed mb-8">
          Most of our best properties never get listed. Tell us what you&apos;re after and we&apos;ll source it — discreetly.
        </p>

        <Button href="/concierge" variant="fab" className="inline-flex items-center gap-4 px-8">
          Tell us what you need
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
