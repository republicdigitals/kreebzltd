"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

// Reference-counted so overlapping locks (e.g. drawer + modal) stay balanced.
let lockCount = 0;
let savedPaddingRight = "";

function acquireLock() {
  const { documentElement: html, body } = document;
  savedPaddingRight = body.style.paddingRight;
  // Compensate for the scrollbar disappearing so content doesn't jump.
  const scrollbarWidth = window.innerWidth - html.clientWidth;
  if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
  // The viewport reads overflow from <html>, not <body> — body locks are a
  // no-op here because html sets `overflow-x: clip`.
  html.style.overflow = "hidden";
}

function releaseLock() {
  document.documentElement.style.overflow = "";
  document.body.style.paddingRight = savedPaddingRight;
}

/**
 * Locks the root scroller while `locked` is true.
 *
 * Stops Lenis (which ignores CSS overflow entirely) and hides overflow on
 * <html> so native scrolling is covered too — including for reduced-motion
 * users where no Lenis instance exists. Lock/unlock is always symmetrical
 * and restores whatever padding/overflow was there before.
 */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    lockCount += 1;
    if (lockCount === 1) {
      lenis?.stop();
      acquireLock();
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        releaseLock();
        lenis?.start();
      }
    };
  }, [locked, lenis]);
}
