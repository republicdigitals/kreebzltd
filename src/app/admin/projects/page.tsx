import Link from "next/link";
import { getAllProjects } from "@/data/projects";
import { Landmark, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Projects</h1>
        <p className="text-neutral-500 mt-1">
          Manage living project content — construction progress and site media.
        </p>
      </div>

      <div className="grid gap-4">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/projects/${p.slug}`}
            className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-900 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Landmark className="w-5 h-5" />
              </span>
              <div>
                <p className="font-semibold text-neutral-900">{p.name}</p>
                <p className="text-sm text-neutral-500">{p.url}</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
          </Link>
        ))}
        {projects.length === 0 && (
          <p className="text-neutral-500 text-sm">No projects registered yet.</p>
        )}
      </div>
    </div>
  );
}
