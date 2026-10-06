import { ShieldCheck, Hammer, Users, Building2, MapPin, BadgeCheck } from "lucide-react";
import type { ProofPoint } from "@/data/bourdillon";

const categoryIcons: Record<ProofPoint["category"], React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  authority: ShieldCheck,
  execution: Hammer,
  people: Users,
  capability: Building2,
  place: MapPin,
  confidence: BadgeCheck,
};

const categoryLabels: Record<ProofPoint["category"], string> = {
  authority: "Authority",
  execution: "Execution",
  people: "People",
  capability: "Capability",
  place: "Place",
  confidence: "Confidence",
};

interface ProofLibraryProps {
  points: ProofPoint[];
  heading?: string;
  eyebrow?: string;
}

/**
 * Reusable proof block — renders only the proof points passed in.
 * Callers should pass `getApprovedProofPoints()` so nothing unapproved
 * reaches the page.
 */
export default function ProofLibrary({
  points,
  heading = "Why this is credible",
  eyebrow = "Proof",
}: ProofLibraryProps) {
  if (points.length === 0) return null;

  return (
    <section className="py-24 bg-obsidian-light border-y border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="eyebrow text-gold-light/70 tracking-[0.3em] mb-4">{eyebrow}</p>
          <h2 className="text-h2 text-off-white">{heading}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point) => {
            const Icon = categoryIcons[point.category];
            return (
              <div
                key={point.title}
                className="bg-surface-2 border border-border rounded-[var(--radius-lg)] p-8 flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center text-gold">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <p className="eyebrow text-[9px] text-muted tracking-[0.25em]">
                  {categoryLabels[point.category]}
                </p>
                <h3 className="font-serif text-off-white text-xl leading-snug">
                  {point.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{point.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
