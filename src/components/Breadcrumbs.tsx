"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-[10px] uppercase tracking-[0.2em] text-muted overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="hover:text-gold transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-off-white font-medium" : ""}>
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <ChevronRight size={12} className="text-white/20" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
