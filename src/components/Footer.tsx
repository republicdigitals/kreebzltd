"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const footerColumns = [
  {
    title: "COMPANY",
    links: [
      { label: "ABOUT US", href: "/about" },
      { label: "WHAT WE DO", href: "/services" },
      { label: "HOW WE WORK", href: "/how-it-works" },
      { label: "CAREERS", href: "/contact" },
      { label: "CONTACT US", href: "/contact" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "THE PORTFOLIO", href: "/properties" },
      { label: "MARKETING & SALES", href: "/services" },
      { label: "FACILITY MANAGEMENT", href: "/services" },
      { label: "PRIVATE JET", href: "/services/private-jet" },
      { label: "TRUSTED CONTRACTORS", href: "/services" },
    ],
  },
  {
    title: "PORTFOLIO",
    links: [
      { label: "BUY", href: "/properties?intent=buy" },
      { label: "RENT", href: "/properties?intent=rent" },
      { label: "SELL", href: "/properties?intent=sell" },
      { label: "IKOYI", href: "/properties" },
      { label: "VICTORIA ISLAND", href: "/properties" },
      { label: "BANANA ISLAND", href: "/properties" },
    ],
  },
];

const legalLinks = [
  { label: "SITE MAP", href: "/" },
  { label: "TERMS", href: "/contact" },
  { label: "PRIVACY", href: "/contact" },
  { label: "COOKIE PREFERENCES", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="dark-mode bg-obsidian pt-24 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Top Section: Newsletter and Brand */}
        <div className="flex flex-col xl:flex-row justify-between items-start gap-16 pb-24 border-b border-border/50">
          <div className="max-w-2xl">
            <Link href="/" className="inline-block mb-12 hover:opacity-80 transition-opacity">
              <Image src="/kreebz-logo.png" alt="Kreebz" width={60} height={55} className="w-12 h-auto" />
            </Link>
            <h2 className="font-serif italic text-off-white/90 text-3xl md:text-5xl leading-tight mb-10">
              Stay informed on new developments, curated listings, and the services behind the standard.
            </h2>
            <form className="flex items-center w-full max-w-md relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="w-full bg-transparent border-b border-white/20 pb-4 text-sm text-off-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors tracking-widest uppercase"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 text-off-white/60 hover:text-gold transition-colors"
                aria-label="Subscribe"
              >
                <ChevronRight size={20} />
              </button>
            </form>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 xl:gap-24 w-full xl:w-auto">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h3 className="uppercase text-off-white/90 mb-8 text-[11px] tracking-[0.25em] font-medium whitespace-nowrap">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="uppercase transition-colors duration-300 hover:text-gold text-[10px] tracking-[0.2em] text-muted relative group whitespace-nowrap"
                      >
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized Brand Typography */}
        <div className="w-full pt-16 pb-8 flex justify-center overflow-hidden">
          <h1 className="font-serif text-off-white/5 text-[15vw] leading-none tracking-tighter select-none">
            KREEBZ
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border/30">
          <div className="flex flex-wrap justify-center items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="uppercase transition-colors duration-300 hover:text-off-white text-[10px] tracking-[0.15em] text-muted/60"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-8 text-muted/60 text-[10px] tracking-[0.1em] uppercase">
            <span>© {new Date().getFullYear()} Kreebz Limited</span>
            <a href="https://instagram.com/kreebzltd" className="hover:text-gold transition-colors duration-300 flex items-center gap-2">
              <InstagramIcon size={14} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
