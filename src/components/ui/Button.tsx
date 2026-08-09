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
    "group relative inline-flex items-center justify-center px-10 py-5 rounded-sm uppercase tracking-[0.2em] text-[10px] font-semibold transition-all duration-700";

  const variantClasses = {
    primary:
      "bg-black/40 border border-gold/30 text-gold-light backdrop-blur-md shadow-2xl hover:bg-black/60 hover:border-gold/60 hover:text-gold",
    secondary:
      "bg-gold text-obsidian shadow-2xl hover:bg-[#D4AF37]/80 hover:text-white",
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
