"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true when the user prefers reduced motion.
 *
 * SSR-safe: uses `useSyncExternalStore` with a server snapshot of `false`
 * to avoid hydration mismatches, then synchronises to the real media-query
 * value on the client.
 *
 * Usage:
 *   const reduced = usePrefersReducedMotion();
 *   if (reduced) return; // inside useGSAP / effects
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}
