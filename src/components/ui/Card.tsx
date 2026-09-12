import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "flat" | "bordered" | "elevated";
  hover?: boolean;
  className?: string;
}

/**
 * Shared card surface — soft-rounded (12px) with consistent border + bg tokens.
 *
 * Variants:
 *   flat     — subtle bg, no border (stat cards, minimal surfaces)
 *   bordered — bg + border, hover lifts border to gold (journey cards, solution cards)
 *   elevated — bg + border + shadow (forms, modals, contact card)
 */
export default function Card({
  children,
  variant = "bordered",
  hover = false,
  className,
}: CardProps) {
  const base =
    "rounded-[var(--radius-lg)] transition-all duration-500";

  const variants = {
    flat: "bg-obsidian-light/30",
    bordered: cn(
      "bg-obsidian-light/30 border border-border",
      hover && "hover:bg-obsidian-light/50 hover:border-gold/40"
    ),
    elevated: "bg-surface-2/50 border border-border shadow-2xl",
  };

  return (
    <div className={cn(base, variants[variant], className)}>
      {children}
    </div>
  );
}
