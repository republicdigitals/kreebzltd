"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Heart, User, ChevronRight, KeyRound, Building2, Tag, Plane, Wrench, Sparkles, Handshake, Landmark, Users, Phone, MessageCircle, MapPin } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";

const menuGroups = [
  {
    title: "Property",
    items: [
      { label: "Buy", desc: "Vetted homes & investments", href: "/properties?intent=buy", icon: KeyRound },
      { label: "Rent", desc: "Homes with a team behind them", href: "/properties?intent=rent", icon: Building2 },
      { label: "Sell", desc: "Reach qualified buyers, quietly", href: "/sell", icon: Tag },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Private Jet", desc: "Charter on your schedule", href: "/services/private-jet", icon: Plane },
      { label: "Management", desc: "We run your property", href: "/management", icon: Wrench },
      { label: "Concierge", desc: "Ask once — it's done", href: "/concierge", icon: Sparkles },
      { label: "Partnerships", desc: "For developers", href: "/partnerships", icon: Handshake },
    ],
  },
  {
    title: "Kreebz",
    items: [
      { label: "Developments", desc: "We design, build & manage", href: "/developments", icon: Landmark },
      { label: "Areas", desc: "Guides to the districts we cover", href: "/areas", icon: MapPin },
      { label: "About", desc: "The team behind the standard", href: "/about", icon: Users },
    ],
  },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Transparent over the homepage hero; solid dark chrome elsewhere/scrolled
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Lock scroll when menu is open (stops Lenis + hides overflow on <html>)
  useScrollLock(menuOpen);

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', menuOpen);
    return () => document.body.classList.remove('nav-menu-open');
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[60] pt-[env(safe-area-inset-top)] transition-all duration-700 flex flex-col border-b ${
          isHome && !isScrolled && !menuOpen
            ? "bg-transparent border-transparent"
            : "bg-panel/95 backdrop-blur-md border-white/10"
        }`}
      >
        {/* Main Nav — single row */}
        <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-center justify-between h-[72px] md:h-20">
            {/* Left: Hamburger (Mobile) / Primary Links (Desktop) */}
            <div className="flex-1 flex items-center gap-6">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden group flex items-center gap-4 text-white hover:text-gold active:scale-[0.95] transition-all duration-300 eyebrow"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-3 flex flex-col justify-between">
                  <span className={`block h-[1px] bg-current transition-all duration-500 absolute w-full ${menuOpen ? "rotate-45 top-1.5" : "top-0"}`} />
                  <span className={`block h-[1px] bg-current transition-all duration-500 absolute w-full ${menuOpen ? "-rotate-45 top-1.5" : "top-3"}`} />
                </div>
              </button>

              <div className="hidden md:flex items-center gap-6 xl:gap-8">
                <Link
                  href="/properties"
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-gold active:scale-[0.95] transition-all duration-300"
                  aria-label="Search properties"
                >
                  <Search size={16} strokeWidth={1.5} />
                </Link>
                <Link href="/properties?intent=buy" className={`eyebrow text-[10px] tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${isLinkActive('/properties?intent=buy') ? 'text-gold' : 'text-white/80 hover:text-gold'}`}>BUY</Link>
                <Link href="/properties?intent=rent" className={`eyebrow text-[10px] tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${isLinkActive('/properties?intent=rent') ? 'text-gold' : 'text-white/80 hover:text-gold'}`}>RENT</Link>
                <Link href="/sell" className={`eyebrow text-[10px] tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${isLinkActive('/sell') ? 'text-gold' : 'text-white/80 hover:text-gold'}`}>SELL</Link>
                <Link href="/management" className={`eyebrow text-[10px] tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${isLinkActive('/management') ? 'text-gold' : 'text-white/80 hover:text-gold'}`}>MANAGEMENT</Link>
                <Link href="/services/private-jet" className={`eyebrow text-[10px] tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${isLinkActive('/services/private-jet') ? 'text-gold' : 'text-white/80 hover:text-gold'}`}>PRIVATE JET</Link>
                <Link href="/developments" className={`eyebrow text-[10px] tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${isLinkActive('/developments') ? 'text-gold' : 'text-white/80 hover:text-gold'}`}>DEVELOPMENTS</Link>
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
              <div className="md:hidden flex items-center gap-5">
                <Link
                  href="/account/saved"
                  className="text-white hover:text-gold active:scale-[0.95] transition-all duration-300"
                  aria-label="Saved properties"
                >
                  <Heart size={17} strokeWidth={1.5} />
                </Link>
                <Link
                  href={accountLink}
                  className="text-white hover:text-gold active:scale-[0.95] transition-all duration-300"
                  aria-label="Account"
                >
                  <User size={17} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/properties"
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-gold active:scale-[0.95] transition-all duration-300"
                  aria-label="Search properties"
                >
                  <Search size={18} strokeWidth={1.5} />
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-6 xl:gap-8">
                <Link
                  href="/account/saved"
                  className="text-white/80 hover:text-gold active:scale-[0.95] transition-all duration-300"
                  aria-label="Saved properties"
                >
                  <Heart size={15} strokeWidth={1.5} />
                </Link>
                <Link
                  href={accountLink}
                  className="text-white/80 hover:text-gold active:scale-[0.95] transition-all duration-300"
                  aria-label="Account"
                >
                  <User size={15} strokeWidth={1.5} />
                </Link>
                <Link href="/concierge" className={`eyebrow text-[10px] tracking-[0.2em] whitespace-nowrap transition-colors duration-300 ${isLinkActive('/concierge') ? 'text-gold' : 'text-white/80 hover:text-gold'}`}>CONCIERGE</Link>
                <Link
                  href="/contact"
                  className="eyebrow text-[10px] tracking-[0.2em] whitespace-nowrap shrink-0 px-5 py-2.5 bg-gold text-ink-fixed rounded-[var(--radius-pill)] hover:bg-gold-hover transition-all duration-300"
                >
                  TALK TO A PRINCIPAL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile-Only App Sheet */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            {/* Bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-x-0 bottom-0 top-[calc(4.5rem+env(safe-area-inset-top))] z-[58] bg-obsidian border-t border-border rounded-t-3xl flex flex-col md:hidden overflow-hidden"
            >
              {/* Grab handle */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <span className="w-10 h-1 rounded-full bg-black/15" />
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4 pb-6">
                {menuGroups.map((group, gi) => (
                  <div key={group.title} className={gi > 0 ? "mt-7" : ""}>
                    <p className="eyebrow text-[10px] tracking-[0.25em] text-gold-light/60 mb-2 px-1">
                      {group.title}
                    </p>
                    <div className="rounded-2xl border border-border bg-obsidian-light/50 divide-y divide-white/5 overflow-hidden">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-4 px-4 py-4 active:bg-white/5 transition-colors"
                        >
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isLinkActive(item.href) ? "bg-gold/15 text-gold" : "bg-white/5 text-off-white/70"
                          }`}>
                            <item.icon size={18} strokeWidth={1.5} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className={`block text-[15px] font-medium ${isLinkActive(item.href) ? "text-gold" : "text-off-white"}`}>
                              {item.label}
                            </span>
                            <span className="block text-[12px] text-muted truncate mt-0.5">
                              {item.desc}
                            </span>
                          </span>
                          <ChevronRight size={16} className="text-white/25 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Location line */}
                <p className="text-center eyebrow text-[9px] tracking-[0.25em] text-off-white/40 mt-8">
                  LAGOS, NIGERIA
                </p>
              </div>

              {/* Pinned contact row */}
              <div className="shrink-0 border-t border-border bg-obsidian px-5 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                <div className="flex gap-3 pb-4">
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gold text-ink-fixed rounded-xl py-3.5 text-[11px] uppercase tracking-[0.2em] font-bold active:scale-[0.98] transition-all"
                  >
                    Talk to a principal
                  </Link>
                  <a
                    href="tel:+2348069949948"
                    aria-label="Call Kreebz"
                    className="w-12 flex items-center justify-center rounded-xl border border-border text-off-white/80 active:bg-white/5 transition-colors"
                  >
                    <Phone size={18} strokeWidth={1.5} />
                  </a>
                  <a
                    href="https://wa.me/2348069949948"
                    aria-label="WhatsApp Kreebz"
                    className="w-12 flex items-center justify-center rounded-xl border border-border text-off-white/80 active:bg-white/5 transition-colors"
                  >
                    <MessageCircle size={18} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

