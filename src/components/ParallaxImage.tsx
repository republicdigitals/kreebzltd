"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ParallaxImage({ src, alt, className = "", priority = false }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Scale up the image slightly so it has room to translate without showing edges
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
