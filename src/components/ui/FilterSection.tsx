import { type ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

/**
 * Shared filter section wrapper — eyebrow title + content.
 * Used by both FilterSidebar and MobileFilterDrawer to prevent drift.
 */
export default function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section>
      <h3 className="eyebrow text-muted mb-4">{title}</h3>
      {children}
    </section>
  );
}
