import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ProjectRef } from "@/data/projects";

interface DevelopmentCardProps {
  project: ProjectRef;
  priority?: boolean;
}

export default function DevelopmentCard({ project, priority = false }: DevelopmentCardProps) {
  return (
    <Link
      href={project.url}
      className="group block overflow-hidden border border-black/10 bg-panel text-white transition-colors duration-300 hover:border-gold/50"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="order-1 flex flex-col justify-center p-6 sm:p-9 lg:order-2 lg:p-14">
          <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="eyebrow text-gold">{project.location}</p>
            {project.status && (
              <span className="border border-gold/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                {project.status}
              </span>
            )}
          </div>

          <h3 className="display-serif-sm mb-5 text-white transition-colors group-hover:text-gold">
            {project.name}
          </h3>

          {project.positioning && (
            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
              {project.positioning}
            </p>
          )}

          <span className="mt-auto inline-flex items-center gap-3 text-white transition-colors group-hover:text-gold">
            <span className="eyebrow">Follow the build</span>
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>

        <div className="relative order-2 aspect-[16/9] overflow-hidden bg-black lg:order-1 lg:aspect-auto lg:min-h-[420px]">
          {project.image && (
            <Image
              src={project.image}
              alt={`${project.name} — ${project.location ?? "Kreebz development"}`}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] lg:hidden"
              sizes="100vw"
            />
          )}
          {project.video ? (
            <video
              src={project.video}
              poster={project.videoPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 hidden h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] lg:block"
            />
          ) : project.image ? (
            <Image
              src={project.image}
              alt=""
              fill
              priority={priority}
              className="hidden object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] lg:block"
              sizes="50vw"
            />
          ) : null}
          {project.imageLabel && (
            <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] bg-black/68 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-white/82 backdrop-blur-sm sm:left-5 sm:top-5">
              {project.imageLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
