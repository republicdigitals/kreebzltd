"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";

const primaryLinks = [
  { label: "BUY", href: "/properties?intent=buy" },
  { label: "RENT", href: "/properties?intent=rent" },
  { label: "SELL", href: "/properties?intent=sell" },
  { label: "SERVICES", href: "/services" },
];

const utilityLinks = [
  { label: "WHAT WE DO", href: "/services" },
  { label: "PRIVATE JET", href: "/services/private-jet" },
  { label: "HOW WE WORK", href: "/how-it-works" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  
  // Register GSAP plugins
  gsap.registerPlugin(useGSAP);

  // Initial load animation
  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  }, { scope: headerRef });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 dark-mode ${
          isScrolled && !menuOpen ? "bg-obsidian/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-center justify-between h-24 md:h-28">
            {/* Left: Menu Toggle */}
            <div className="flex-1">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="group flex items-center gap-4 text-off-white hover:text-gold transition-colors duration-500 eyebrow"
                aria-label="Toggle menu"
              >
                <div className="relative w-8 h-2 flex flex-col justify-between">
                  <span className={`block h-[1px] bg-current transition-all duration-500 absolute w-full ${menuOpen ? "rotate-45 top-1" : "top-0"}`} />
                  <span className={`block h-[1px] bg-current transition-all duration-500 absolute w-full ${menuOpen ? "-rotate-45 top-1" : "top-2"}`} />
                </div>
                <span className="hidden sm:block">{menuOpen ? "CLOSE" : "MENU"}</span>
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center flex-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center hover:opacity-80 transition-opacity duration-700"
                aria-label="Kreebz — home"
              >
                <Image
                  src="/kreebz-logo.png"
                  alt="Kreebz"
                  width={96}
                  height={88}
                  priority
                  className="h-16 w-auto md:h-20 object-contain"
                />
              </Link>
            </div>

            {/* Right: Search */}
            <div className="flex justify-end flex-1">
              <Link
                href="/properties"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-off-white hover:text-gold transition-colors duration-500 eyebrow"
                aria-label="Search properties"
              >
                <span className="hidden sm:block">SEARCH</span>
                <Search size={18} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Immersive Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[50] bg-obsidian/95 backdrop-blur-2xl flex flex-col justify-center"
          >
            <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 pt-20">
              
              {/* Primary Huge Links */}
              <div className="flex flex-col gap-4">
                {primaryLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between font-serif font-light text-[clamp(40px,7vw,80px)] text-off-white hover:text-gold transition-colors duration-500 leading-none"
                    >
                      <span className="italic">{link.label}</span>
                      <ArrowRight size={clampSize()} className="opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700" strokeWidth={1} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Utility Links & Contact Info */}
              <div className="flex flex-col justify-end md:pb-8">
                <div className="flex flex-col gap-6 md:gap-8">
                  {utilityLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="eyebrow text-off-white/70 hover:text-gold transition-colors duration-500 flex items-center gap-4"
                      >
                        <span className="w-8 h-[1px] bg-gold opacity-0 transition-opacity duration-300" />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Info */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-6 eyebrow text-off-white/50"
                >
                  <p>LAGOS, NIGERIA</p>
                  <a href="mailto:concierge@kreebz.com" className="hover:text-gold transition-colors">CONCIERGE@KREEBZ.COM</a>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper for responsive arrow size in the huge menu
function clampSize() {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 768) return 32;
    return 48;
  }
  return 32;
}
