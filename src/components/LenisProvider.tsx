'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface LenisProviderProps {
  children: ReactNode;
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
    <ReactLenis root options={{ lerp: 0.12, wheelMultiplier: 1.0, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
