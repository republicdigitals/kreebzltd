"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const leftLinks = [
  { label: "What We Do", href: "/#services" },
  { label: "How We Work", href: "/#how-it-works" },
];

const rightLinks = [
  { label: "Our Properties", href: "/#properties" },
  { label: "Begin", href: "/#contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass =
    "eyebrow text-off-white/80 hover:text-gold transition-colors duration-300";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-obsidian/95 backdrop-blur-md" : "bg-transparent"
      }`}
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-20">
          {/* Left Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-8 justify-start">
            {leftLinks.map((link) => (
              <a key={link.label} href={link.href} className={navLinkClass}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu toggle (left on mobile) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-off-white justify-self-start"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Centered Logo */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="group flex items-center gap-2.5 hover:opacity-90 transition-opacity duration-300"
              aria-label="Kreebz — home"
            >
              <Image
                src="/kreebz-logo.png"
                alt="Kreebz"
                width={48}
                height={44}
                priority
                className="h-9 w-auto md:h-11 object-contain"
              />
              <span className="font-serif text-off-white text-xl md:text-2xl tracking-[0.15em] group-hover:text-gold transition-colors duration-300">
                KREEBZ
              </span>
            </Link>
          </div>

          {/* Right Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-8 justify-end">
            {rightLinks.map((link) => (
              <a key={link.label} href={link.href} className={navLinkClass}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Spacer to balance grid on mobile */}
          <span className="md:hidden" />
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          className="md:hidden bg-obsidian/98 backdrop-blur-md px-6 py-8 flex flex-col gap-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {[...leftLinks, ...rightLinks].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="eyebrow text-off-white/80 hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  );
}
