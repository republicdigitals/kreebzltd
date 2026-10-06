import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href?: string;
  variant?: "primary" | "secondary" | "fab";
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "group relative inline-flex items-center justify-center text-[15px] font-medium transition-all duration-300";

  const variantClasses = {
    // Coral solid — the primary CTA (hero, contact, partnerships)
    primary:
      "bg-gold text-ink-fixed px-8 py-4 rounded-[var(--radius-pill)] hover:bg-gold-hover active:translate-y-px",
    // Secondary — white fill, ink outline (legible over imagery too)
    secondary:
      "bg-obsidian border border-off-white text-off-white px-8 py-4 rounded-[var(--radius-pill)] hover:bg-obsidian-light",
    // Floating action button — ink pill (concierge FAB)
    fab:
      "bg-off-white text-white px-6 py-4 rounded-[var(--radius-pill)] hover:bg-gold shadow-card",
  };

  const combinedClasses = cn(baseClasses, variantClasses[variant], className);

  if (href) {
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
