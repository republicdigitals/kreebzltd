"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { usePropertyFilters } from "./PropertyFilterProvider";

interface RecentEntry {
  slug: string;
  address: string;
  cover?: string;
  price?: number | null;
  type?: string;
}

const KEY = "kreebz-recently-viewed";

export default function RecentlyViewed() {
  const [entries, setEntries] = useState<RecentEntry[]>([]);
  const { all } = usePropertyFilters();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage is only possible client-side
        setEntries(parsed);
      }
    } catch {}
  }, []);

  const clear = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    setEntries([]);
  };

  // Drop entries whose listings were archived or deleted since the visit —
  // otherwise the strip links into 404s. Also prune the stored copy.
  const validSlugs = new Set(all.map((p) => p.slug));
  const visible = entries.filter((e) => validSlugs.size === 0 || validSlugs.has(e.slug));

  useEffect(() => {
    if (validSlugs.size > 0 && visible.length !== entries.length) {
      try {
        localStorage.setItem(KEY, JSON.stringify(visible));
      } catch {}
    }
  }, [visible.length, entries.length, validSlugs.size]); // eslint-disable-line react-hooks/exhaustive-deps -- prune once when the portfolio loads

  if (visible.length === 0) return null;

  return (
    <div className="border-b border-border/20 bg-obsidian">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted font-sans">
            Recently viewed
          </p>
          <button
            onClick={clear}
            className="text-muted hover:text-gold transition-colors flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] font-sans"
          >
            <X size={11} strokeWidth={1.5} /> Clear
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {visible.map((e) => (
            <Link
              key={e.slug}
              href={`/property/${e.slug}`}
              className="group flex-shrink-0 flex items-center gap-3 bg-surface/40 border border-border/20 rounded-xl pr-4 py-2 pl-2 hover:border-gold/40 transition-colors"
            >
              {e.cover ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={e.cover} alt="" fill sizes="48px" className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-border/20 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-off-white text-xs font-sans truncate max-w-[160px] group-hover:text-gold-light transition-colors">
                  {e.address}
                </p>
                {e.price != null && (
                  <p className="text-gold text-[11px] font-sans mt-0.5">
                    ${e.price.toLocaleString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
