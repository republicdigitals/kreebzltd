import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DevelopmentCard from "@/components/DevelopmentCard";
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
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <DevelopmentCard key={project.slug} project={project} priority={index === 0} />
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
