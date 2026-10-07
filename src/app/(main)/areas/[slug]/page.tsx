import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { areas, getArea } from "@/data/areas";
import { getPropertiesByNeighbourhoods } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return {};
  return {
    title: `${area.name}, Lagos — Area Guide | Kreebz Ltd`,
    description: `${area.tagline} Kreebz inspections, market notes and current listings in ${area.name}.`,
    alternates: { canonical: `/areas/${slug}` },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();

  const properties = await getPropertiesByNeighbourhoods(area.neighbourhoods);

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[62vh] flex items-end overflow-hidden">
        <Image
          src={area.image}
          alt={area.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-black/45 to-black/55" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-14 w-full">
          <Link
            href="/areas"
            className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-colors text-sm mb-8"
          >
            <ArrowLeft size={15} strokeWidth={1.5} /> All areas
          </Link>
          <p className="eyebrow text-gold mb-4">Lagos — Area Guide</p>
          <h1 className="display-serif text-white max-w-3xl">{area.name}</h1>
          <p className="text-white/80 text-lg max-w-xl mt-4">{area.tagline}</p>
        </div>
      </section>

      {/* Editor's note + snapshot */}
      <section className="py-20 lg:py-28 border-b border-border/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 lg:gap-16">
          <div>
            <div className="flex items-center gap-5 mb-8">
              <span className="gold-rule w-12" />
              <p className="eyebrow text-gold">Why {area.name}</p>
            </div>
            <p className="font-serif text-off-white text-2xl lg:text-3xl leading-[1.4] max-w-2xl">
              {area.note}
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {area.snapshot.map((s) => (
              <div key={s.label} className="border-b border-border/30 pb-5">
                <p className="eyebrow text-muted mb-2">{s.label}</p>
                <p className="text-off-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we inspect */}
      <section className="py-20 lg:py-28 border-b border-border/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-5 mb-10">
            <span className="gold-rule w-12" />
            <p className="eyebrow text-gold">What we check here</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {area.inspections.map((item) => (
              <div
                key={item}
                className="bg-panel border border-border rounded-[var(--radius-lg)] p-7 flex gap-4"
              >
                <ShieldCheck size={20} strokeWidth={1.5} className="text-gold shrink-0 mt-1" />
                <p className="text-off-white/85 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-5 mb-6">
                <span className="gold-rule w-12" />
                <p className="eyebrow text-gold">In {area.name} now</p>
              </div>
              <h2 className="display-serif-sm text-off-white">
                {properties.length > 0 ? "What we stand behind" : "Nothing listed — which is often the point"}
              </h2>
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="bg-panel border border-border rounded-[var(--radius-lg)] p-10 lg:p-14 text-center">
              <p className="text-muted leading-relaxed max-w-xl mx-auto mb-8">
                The best {area.name} stock rarely reaches a portal. Tell a
                principal what you&rsquo;re looking for and we&rsquo;ll source it off-market.
              </p>
              <Link
                href="/matchmaking"
                className="inline-flex items-center gap-3 text-gold hover:text-gold-hover transition-colors"
              >
                <span className="eyebrow">Source off-market in {area.name}</span>
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
