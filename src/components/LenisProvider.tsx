'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 1.0, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
