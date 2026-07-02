"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/*
        ASSET SWAP: Replace hero-placeholder.jpg with hero-loop.mp4 when video file is supplied.
        Current: Static image from Unsplash (luxury modern house at night with warm lighting)
        Future: muted, autoplay, loop, playsInline video element with same overlay
      */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <Image
          src="/images/hero-placeholder.jpg"
          alt="Luxury property at night"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Heavy dark gradient overlay for legibility - image sits BEHIND this */}
        <div
          className="absolute inset-0 z-10"
          style={{ background: "linear-gradient(rgba(10,10,10,0.7), rgba(10,10,10,0.7))" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-[5vw]">
        <div className="text-center w-full max-w-[1100px] mx-auto">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-off-white font-normal uppercase leading-[1.05]"
            style={{ fontSize: "clamp(40px, 7vw, 104px)", letterSpacing: "0.02em" }}
          >
            Your Legacy,
            <br />
            Meticulously Maintained.
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-gold uppercase mt-8"
            style={{ fontSize: "13px", letterSpacing: "0.3em" }}
          >
            Upward Growth. Unwavering Reliability.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center gap-6 mt-12"
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="btn-primary"
            >
              Request a Private Consultation
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="group inline-flex items-center gap-2 text-off-white/80 hover:text-gold transition-colors duration-300 eyebrow"
            >
              Explore Our Services
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-16 bg-gradient-to-b from-off-white/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
