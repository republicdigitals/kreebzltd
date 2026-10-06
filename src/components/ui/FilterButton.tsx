import { cn } from "@/lib/utils";

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Shared filter button — used by both FilterSidebar and MobileFilterDrawer.
 * Selected state: gold tint + gold border. Default: subtle border.
 */
export default function FilterButton({
  label,
  isSelected,
  onClick,
  className,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors border rounded-[var(--radius-sm)]",
        isSelected
          ? "bg-gold/10 border-gold/50 text-gold"
          : "border-border text-off-white/70 hover:border-border-strong hover:bg-white/5",
        className
      )}
    >
      {label}
    </button>
  );
}
