import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getAllProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Developments | Kreebz Ltd",
  description:
    "We don't just sell property — we design, build and manage it. Follow Kreebz developments from foundation to handover, documented on site.",
  alternates: { canonical: "/developments" },
};

export default function DevelopmentsPage() {
  const projects = getAllProjects();

  return (
    <div className="bg-obsidian min-h-screen">
      <PageHeader
        eyebrow="Developments"
        title="We don't just sell property. We build it."
        subtitle="Every Kreebz development is designed, built and managed by one accountable team — and documented on site as it rises."
      />

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-28">
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={project.url}
              className="group block bg-panel border border-border rounded-[var(--radius-lg)] overflow-hidden hover:border-gold/30 transition-colors duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-obsidian-light">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={`${project.name} — ${project.location ?? "Kreebz development"}`}
                      fill
                      className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                  {project.imageLabel && (
                    <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-[0.14em] text-white/80">
                      {project.imageLabel}
                    </span>
                  )}
                </div>
                <div className="p-8 lg:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <p className="eyebrow text-gold">{project.location}</p>
                    {project.status && (
                      <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold-light text-[10px] uppercase tracking-[0.16em]">
                        {project.status}
                      </span>
                    )}
                  </div>
                  <h2 className="display-serif text-off-white mb-5 group-hover:text-gold-light transition-colors">
                    {project.name}
                  </h2>
                  {project.positioning && (
                    <p className="text-lead text-muted leading-relaxed max-w-lg mb-10">
                      {project.positioning}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-3 text-off-white group-hover:text-gold transition-colors">
                    <span className="eyebrow">Follow the build</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-muted text-sm mb-4">
            More in the pipeline — future sites are announced to principals first.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 text-gold hover:text-gold-hover transition-colors"
          >
            <span className="eyebrow">Ask a principal what&rsquo;s next</span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
