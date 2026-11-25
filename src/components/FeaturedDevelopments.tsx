import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProjectRef } from "@/data/projects";
import DevelopmentCard from "./DevelopmentCard";

interface FeaturedDevelopmentsProps {
  projects: ProjectRef[];
}

export default function FeaturedDevelopments({ projects }: FeaturedDevelopmentsProps) {
  const featured = projects.slice(0, 2);
  if (featured.length === 0) return null;

  return (
    <section className="border-t border-black/10 py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end lg:mb-14">
          <div>
            <p className="eyebrow mb-4 text-gold">Developments</p>
            <h2 className="display-serif-sm text-black">
              Built by one accountable team.
            </h2>
          </div>
          <Link
            href="/developments"
            className="inline-flex items-center gap-3 text-black/70 transition-colors hover:text-gold"
          >
            <span className="eyebrow">All developments</span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {featured.map((project, index) => (
            <DevelopmentCard key={project.slug} project={project} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
