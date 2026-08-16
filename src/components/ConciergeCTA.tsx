import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ConciergeCTA() {
  return (
    <div className="w-full bg-obsidian-light/30 border border-border/20 py-16 px-6 text-center mt-12 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
      
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-6">
          <Sparkles size={20} strokeWidth={1.5} />
        </div>
        
        <h3 className="font-serif text-3xl md:text-4xl text-off-white font-light mb-4">
          Can&apos;t find what you&apos;re looking for?
        </h3>
        
        <p className="text-muted tracking-wide text-sm leading-relaxed mb-8">
          Our public portfolio represents only a selection of our properties. We offer a discreet matchmaking service for clients with specific requirements, granting access to our private off-market inventory.
        </p>
        
        <Link 
          href="/concierge"
          className="inline-flex items-center gap-4 bg-off-white text-obsidian px-8 py-4 uppercase tracking-[0.2em] text-[11px] font-semibold hover:bg-gold hover:text-off-white transition-colors duration-300"
        >
          Request Matchmaking
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
