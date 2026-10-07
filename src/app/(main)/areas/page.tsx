import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { areas } from "@/data/areas";

export const metadata: Metadata = {
  title: "Areas We Cover | Kreebz Ltd",
  description:
    "Ikoyi, Banana Island, Victoria Island, Eko Atlantic and Lekki — honest guides to the Lagos neighbourhoods we inspect, source and manage in.",
  alternates: { canonical: "/areas" },
};

export default function AreasPage() {
  return (
    <div className="bg-obsidian min-h-screen">
      <PageHeader
        eyebrow="Where we work"
        title="We only cover ground we can inspect."
        subtitle="Five Lagos districts — each one walked, measured and answerable to a principal. If a listing is on this site, someone here has been inside it."
      />

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {areas.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="group relative rounded-[var(--radius-lg)] overflow-hidden border border-border bg-panel hover:border-gold/30 transition-colors duration-500"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-obsidian-light">
                <Image
                  src={area.image}
                  alt={area.imageAlt}
                  fill
                  className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h2 className="display-serif-sm text-white mb-2">{area.name}</h2>
                  <p className="text-white/70 text-sm leading-relaxed max-w-md">
                    {area.tagline}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-7 py-5">
                <span className="eyebrow text-muted">Read the guide</span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="text-gold transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted text-sm mb-4">
            Looking somewhere we don&rsquo;t cover yet? Sourcing requests travel further.
          </p>
          <Link
            href="/matchmaking"
            className="inline-flex items-center gap-3 text-gold hover:text-gold-hover transition-colors"
          >
            <span className="eyebrow">Tell us where to look</span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
