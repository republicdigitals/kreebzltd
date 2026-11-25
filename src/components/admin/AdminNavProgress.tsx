"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin top progress bar for the admin portal: starts when any internal
 * link is clicked and completes when the new page renders, so navigation
 * never feels dead. Purely visual — no routing logic.
 */
export default function AdminNavProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("/") && href !== pathname) {
        setState("loading");
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  useEffect(() => {
    if (state === "loading") {
      setState("done");
      const t = setTimeout(() => setState("idle"), 400);
      return () => clearTimeout(t);
    }
  }, [pathname, state]);

  if (state === "idle") return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none">
      <div
        className={`h-full bg-gold transition-all ${
          state === "loading"
            ? "w-2/3 duration-[2000ms] ease-out"
            : "w-full duration-300 ease-in opacity-0"
        }`}
      />
    </div>
  );
}
