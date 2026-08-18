import { Search, Map, List, ChevronDown } from "lucide-react";

export default function PropertiesLoading() {
  return (
    <div className="bg-obsidian pt-28 md:pt-[120px] flex flex-col min-h-screen">
      {/* Search / filter bar Skeleton */}
      <div className="border-b border-border/20 bg-obsidian sticky top-28 md:top-[120px] z-40">
        <section className="w-full bg-obsidian relative z-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                <div className="flex items-center gap-3 px-5 py-3 flex-1 max-w-xl bg-obsidian-light border border-white/10 rounded-none animate-pulse h-12">
                </div>
                <div className="flex items-center gap-6 lg:ml-auto">
                  <div className="w-24 h-4 bg-obsidian-light animate-pulse rounded" />
                  <div className="w-20 h-4 bg-obsidian-light animate-pulse rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-2">
                <div className="w-64 h-8 bg-obsidian-light animate-pulse rounded" />
                <div className="hidden lg:flex gap-6">
                  <div className="w-20 h-4 bg-obsidian-light animate-pulse rounded" />
                  <div className="w-32 h-8 bg-obsidian-light animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Content area */}
      <div className="flex-1 flex max-w-[1600px] mx-auto w-full">
        {/* Desktop Sidebar Skeleton */}
        <div className="hidden lg:block w-[300px] shrink-0 border-r border-border/20 bg-obsidian z-10 p-6 space-y-10">
          <div className="w-20 h-6 bg-obsidian-light animate-pulse mb-8 rounded" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4">
              <div className="w-24 h-3 bg-obsidian-light animate-pulse rounded" />
              <div className="flex flex-col gap-2">
                <div className="w-full h-10 bg-obsidian-light animate-pulse rounded" />
                <div className="w-full h-10 bg-obsidian-light animate-pulse rounded" />
                <div className="w-full h-10 bg-obsidian-light animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex min-w-0">
          {/* List panel */}
          <div className="pb-20 w-full xl:w-1/2 p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col h-full">
                  <div className="w-full aspect-[4/3] bg-obsidian-light animate-pulse rounded-t-sm" />
                  <div className="pt-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between mb-4">
                        <div className="w-16 h-5 bg-obsidian-light animate-pulse rounded" />
                        <div className="w-16 h-3 bg-obsidian-light animate-pulse rounded" />
                      </div>
                      <div className="w-32 h-8 bg-obsidian-light animate-pulse mt-5 rounded" />
                      <div className="w-full h-4 bg-obsidian-light animate-pulse mt-3 rounded" />
                      <div className="w-2/3 h-3 bg-obsidian-light animate-pulse mt-2 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map panel */}
          <div className="hidden xl:block w-1/2 border-l border-border/20 bg-obsidian-light">
            <div className="sticky top-[200px] h-[calc(100vh-200px)] w-full flex items-center justify-center">
              <div className="w-full h-full bg-black/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
