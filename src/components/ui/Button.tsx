import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "fab";
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "group relative inline-flex items-center justify-center uppercase tracking-[0.2em] text-[11px] font-semibold transition-all duration-500";

  const variantClasses = {
    // Gold solid — the primary CTA (hero, contact, partnerships)
    primary:
      "bg-gold text-obsidian px-10 py-5 rounded-[var(--radius-sm)] shadow-2xl hover:bg-gold-hover hover:scale-[1.02]",
    // Ghost / secondary — frosted glass so it stays legible over imagery
    secondary:
      "bg-obsidian/40 backdrop-blur-md border border-white/40 text-white px-10 py-5 rounded-[var(--radius-sm)] hover:border-gold hover:text-gold hover:bg-obsidian/60",
    // Floating action button — pill shape (concierge FAB)
    fab:
      "bg-off-white text-obsidian px-6 py-4 rounded-[var(--radius-pill)] hover:bg-gold hover:text-off-white shadow-2xl",
  };

  const combinedClasses = cn(baseClasses, variantClasses[variant], className);

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
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
