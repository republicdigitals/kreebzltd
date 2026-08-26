"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, ArrowRight, Heart, User } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";

const primaryLinks = [
  { label: "BUY", href: "/properties?intent=buy" },
  { label: "RENT", href: "/properties?intent=rent" },
  { label: "SELL", href: "/sell" },
  { label: "MANAGEMENT", href: "/management" },
  { label: "CONCIERGE", href: "/concierge" },
  { label: "PARTNERSHIPS", href: "/partnerships" },
];

const utilityLinks = [
  { label: "HOME", href: "/" },
  { label: "PORTFOLIO", href: "/properties" },
  { label: "CONCIERGE", href: "/concierge" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  
  // Register GSAP plugins
  gsap.registerPlugin(useGSAP);

  // Initial load animation (mobile-optimized)
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    });
    mm.add("(max-width: 767px)", () => {
      gsap.from(headerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  }, { scope: headerRef });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const accountLink = session ? "/account" : "/login";

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    
    if (href.includes('?')) {
      const [basePath, query] = href.split('?');
      if (pathname !== basePath) return false;
      const intentMatch = query.match(/intent=([^&]+)/);
      if (intentMatch) {
        return searchParams?.get('intent') === intentMatch[1];
      }
    }
    return pathname.startsWith(href);
  };

  // Lock scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      // Robust iOS scroll lock
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 flex flex-col ${
          isScrolled && !menuOpen ? "bg-obsidian/95 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        {/* Top Tier: Desktop Utilities */}
        <div className="hidden md:flex justify-end items-center px-6 lg:px-12 h-10 border-b border-white/10 gap-8 eyebrow text-[9px] tracking-[0.15em] text-off-white/70">
          <Link href="/account/saved" className="flex items-center gap-2 hover:text-gold transition-colors">
            <Heart size={12} strokeWidth={2} /> FAVORITES
          </Link>
          <Link href={accountLink} className="flex items-center gap-2 hover:text-gold transition-colors">
            <User size={12} strokeWidth={2} /> ACCOUNT
          </Link>
        </div>

        {/* Top Tier: Mobile Utilities */}
        <div className="md:hidden flex justify-between items-center px-6 h-10 border-b border-white/10 eyebrow text-[9px] tracking-[0.15em] text-off-white/70">
          <Link href={accountLink} className="flex items-center gap-2 hover:text-gold transition-colors">
            <User size={12} strokeWidth={2} /> ACCOUNT
          </Link>
          <Link href="/account/saved" className="flex items-center hover:text-gold transition-colors">
            <Heart size={14} strokeWidth={2} />
          </Link>
        </div>

        {/* Bottom Tier: Main Nav */}
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-center justify-between h-[72px] md:h-20">
            {/* Left: Hamburger (Mobile) / Primary Links (Desktop) */}
            <div className="flex-1 flex items-center gap-6">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden group flex items-center gap-4 text-off-white hover:text-gold active:scale-[0.95] transition-all duration-300 eyebrow"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-3 flex flex-col justify-between">
                  <span className={`block h-[1px] bg-current transition-all duration-500 absolute w-full ${menuOpen ? "rotate-45 top-1.5" : "top-0"}`} />
                  <span className={`block h-[1px] bg-current transition-all duration-500 absolute w-full ${menuOpen ? "-rotate-45 top-1.5" : "top-3"}`} />
                </div>
              </button>

              <div className="hidden md:flex items-center gap-8">
                <Link
                  href="/properties"
                  onClick={() => setMenuOpen(false)}
                  className="text-off-white hover:text-gold active:scale-[0.95] transition-all duration-300"
                  aria-label="Search properties"
                >
                  <Search size={16} strokeWidth={1.5} />
                </Link>
                <Link href="/properties?intent=buy" className={`eyebrow text-[10px] tracking-[0.2em] transition-colors duration-300 ${isLinkActive('/properties?intent=buy') ? 'text-gold' : 'text-off-white hover:text-gold'}`}>BUY</Link>
                <Link href="/properties?intent=rent" className={`eyebrow text-[10px] tracking-[0.2em] transition-colors duration-300 ${isLinkActive('/properties?intent=rent') ? 'text-gold' : 'text-off-white hover:text-gold'}`}>RENT</Link>
                <Link href="/sell" className={`eyebrow text-[10px] tracking-[0.2em] transition-colors duration-300 ${isLinkActive('/sell') ? 'text-gold' : 'text-off-white hover:text-gold'}`}>SELL</Link>
                <Link href="/management" className={`eyebrow text-[10px] tracking-[0.2em] transition-colors duration-300 ${isLinkActive('/management') ? 'text-gold' : 'text-off-white hover:text-gold'}`}>MANAGEMENT</Link>
              </div>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center flex-1">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center hover:opacity-80 active:scale-[0.98] transition-all duration-300"
                aria-label="Kreebz — home"
              >
                <Image
                  src="/kreebz-logo.png"
                  alt="Kreebz"
                  width={96}
                  height={88}
                  priority
                  className="h-10 w-auto md:h-12 object-contain"
                />
              </Link>
            </div>

            {/* Right: Search (Mobile) / Utilities (Desktop) */}
            <div className="flex justify-end flex-1 items-center gap-8">
              <Link
                href="/properties"
                onClick={() => setMenuOpen(false)}
                className="md:hidden text-off-white hover:text-gold active:scale-[0.95] transition-all duration-300"
                aria-label="Search properties"
              >
                <Search size={18} strokeWidth={1.5} />
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <Link href="/partnerships" className={`eyebrow text-[10px] tracking-[0.2em] transition-colors duration-300 ${isLinkActive('/partnerships') ? 'text-gold' : 'text-off-white hover:text-gold'}`}>PARTNERSHIPS</Link>
                <Link href="/concierge" className={`eyebrow text-[10px] tracking-[0.2em] transition-colors duration-300 ${isLinkActive('/concierge') ? 'text-gold' : 'text-off-white hover:text-gold'}`}>CONCIERGE</Link>
                <Link href="/about" className={`eyebrow text-[10px] tracking-[0.2em] transition-colors duration-300 ${isLinkActive('/about') ? 'text-gold' : 'text-off-white hover:text-gold'}`}>ABOUT</Link>
                <Link href="/contact" className={`eyebrow text-[10px] tracking-[0.2em] transition-colors duration-300 ${isLinkActive('/contact') ? 'text-gold' : 'text-off-white hover:text-gold'}`}>CONTACT</Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-Only Immersive Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[50] bg-obsidian/95 backdrop-blur-2xl flex flex-col md:hidden overflow-y-auto overflow-x-hidden"
          >
            <div className="max-w-[1400px] w-full min-h-full mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 py-20">
              
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
                      className={`group flex items-center justify-between font-serif font-light text-[clamp(32px,10vw,80px)] active:scale-[0.98] transition-all duration-300 leading-none ${isLinkActive(link.href) ? 'text-gold' : 'text-off-white hover:text-gold'}`}
                    >
                      <span className={link.label === "SELL" || isLinkActive(link.href) ? "italic" : "italic"}>{link.label}</span>
                      <ArrowRight className={`w-8 h-8 md:w-12 md:h-12 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ${link.label === "SELL" || isLinkActive(link.href) ? "text-gold" : ""}`} strokeWidth={1} />
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
                        className={`eyebrow active:scale-[0.95] transition-all duration-300 flex items-center gap-4 ${isLinkActive(link.href) ? 'text-gold' : 'text-off-white/70 hover:text-gold'}`}
                      >
                        <span className={`w-8 h-[1px] bg-gold transition-opacity duration-300 ${isLinkActive(link.href) ? 'opacity-100' : 'opacity-0'}`} />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-6 eyebrow text-off-white/50"
                >
                  <p>LAGOS, NIGERIA</p>
                  <a href="mailto:concierge@kreebzltd.com" className="hover:text-gold transition-colors">CONCIERGE@KREEBZLTD.COM</a>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

