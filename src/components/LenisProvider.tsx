'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Keeps Lenis's measured scroll limit in sync with the real document height.
 * Lenis's own content ResizeObserver watches documentElement — but on a root
 * scroller the <html> box is viewport-sized and never grows when content does,
 * so pages that get taller after init (async listings, font swap, images)
 * end up with a stale limit and wheel scrolling clamps mid-page. Watching
 * document.body catches every growth/shrink instead.
 */
function LenisRuntime() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    const observer = new ResizeObserver(() => lenis.resize());
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [lenis]);

  useEffect(() => {
    lenis?.resize();
    const timer = window.setTimeout(() => lenis?.resize(), 350);
    return () => window.clearTimeout(timer);
  }, [lenis, pathname]);

  return null;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const reduced = usePrefersReducedMotion();

  // Reduced motion: skip Lenis entirely so the browser uses native scroll,
  // which is what reduced-motion users expect. Also avoids the hydration
  // mismatch of conditionally toggling smoothWheel after mount.
  if (reduced) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        wheelMultiplier: 1.0,
        smoothWheel: true,
        // Let genuinely-scrollable nested regions scroll natively; at their
        // scroll boundary Lenis takes over and scrolls the page instead of
        // trapping the wheel (the old data-lenis-prevent dead zones).
        allowNestedScroll: true,
      }}
    >
      <LenisRuntime />
      {children}
    </ReactLenis>
  );
}
