import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary";
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
    "group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-none uppercase tracking-[0.2em] text-xs font-medium transition-all duration-700";

  const variantClasses = {
    primary:
      "border border-border-strong text-off-white hover:border-gold hover:text-gold hover:bg-white/5",
    secondary:
      "bg-off-white text-obsidian hover:bg-gold hover:text-off-white shadow-2xl",
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
