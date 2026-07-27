"use client";

import { useEffect, useRef } from "react";

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    
    // Create a smaller offscreen canvas for better performance
    // We'll scale it up via CSS
    const patternSize = 128;
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const patternCtx = patternCanvas.getContext("2d");
    if (!patternCtx) return;

    let animationId: number;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const noise = () => {
      if (!patternCtx || !ctx) return;
      
      const idata = patternCtx.createImageData(patternSize, patternSize);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        // Monochrome noise (black/white/gray)
        const value = Math.random() * 255;
        // Format: ABGR (alpha is always 255 for opaque, but we control overall opacity in CSS)
        buffer32[i] = (255 << 24) | (value << 16) | (value << 8) | value;
      }

      patternCtx.putImageData(idata, 0, 0);

      // Draw the pattern to the main canvas
      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const loop = () => {
      noise();
      // Run noise generation at ~30fps for that film look
      window.setTimeout(() => {
        animationId = requestAnimationFrame(loop);
      }, 1000 / 30);
    };

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-[0.03]"
      aria-hidden="true"
    />
  );
}
