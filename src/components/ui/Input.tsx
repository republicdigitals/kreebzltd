import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";

/**
 * Canonical form input — underline style (border-bottom only, no background).
 * Matches the ConciergeUX modal + Footer newsletter aesthetic.
 */

interface FieldProps {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}

/** Label + field wrapper — ensures every input has a visible label (a11y). */
export function Field({ label, htmlFor, optional, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={htmlFor}
        className="text-[10px] uppercase tracking-[0.2em] text-off-white/60"
      >
        {label}
        {optional && <span className="text-muted ml-2">(Optional)</span>}
      </label>
      {children}
    </div>
  );
}

const inputBase =
  "w-full bg-transparent border-none border-bottom border-b border-border-strong pb-3 text-off-white text-[15px] placeholder:text-muted/70 placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-[10px] focus:outline-none focus:border-gold transition-colors duration-300";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(inputBase, "resize-none", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(inputBase, "appearance-none cursor-pointer", className)}
      {...props}
    >
      {children}
    </select>
  );
}
