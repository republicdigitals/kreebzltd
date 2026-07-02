"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, AtSign, Send, Link2 } from "lucide-react";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Kreebz", href: "/#hero" },
      { label: "How We Work", href: "/#how-it-works" },
      { label: "The Private Circle", href: "/#services" },
      { label: "Careers", href: "/#contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Owner Representation", href: "/#services" },
      { label: "Estate Management", href: "/#services" },
      { label: "Housekeeping", href: "/#services" },
      { label: "Specialist Care", href: "/#services" },
    ],
  },
  {
    title: "Portfolio",
    links: [
      { label: "Ikoyi", href: "/#properties" },
      { label: "Victoria Island", href: "/#properties" },
      { label: "Banana Island", href: "/#properties" },
      { label: "All Listings", href: "/#properties" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hello@kreebz.com", href: "mailto:hello@kreebz.com" },
      { label: "+234 800 000 0000", href: "tel:+2348000000000" },
      { label: "Lagos, Nigeria", href: "/#contact" },
      { label: "Begin", href: "/#contact" },
    ],
  },
];

// Brand icons (Instagram/LinkedIn/etc.) were removed from this Lucide version;
// using generic stand-ins for the social row.
const socials = [
  { Icon: AtSign, label: "Instagram", href: "#" },
  { Icon: Globe, label: "LinkedIn", href: "#" },
  { Icon: Send, label: "Twitter", href: "#" },
  { Icon: Link2, label: "Website", href: "#" },
];

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#111111", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Newsletter */}
        <div
          className="py-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity"
              aria-label="Kreebz — home"
            >
              <Image
                src="/kreebz-logo.png"
                alt="Kreebz"
                width={40}
                height={37}
                className="h-9 w-auto object-contain"
              />
              <span className="font-serif text-off-white text-2xl tracking-[0.15em] group-hover:text-gold transition-colors">
                KREEBZ
              </span>
            </Link>
            <p className="font-serif text-off-white/80 mt-3" style={{ fontSize: "20px" }}>
              Curated insights for your legacy.
            </p>
          </div>
          <form
            className="flex items-center gap-3 w-full lg:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="input-pill px-5 py-3 text-sm flex-1 lg:w-72"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3
                className="uppercase text-off-white mb-5"
                style={{ fontSize: "11px", letterSpacing: "0.25em" }}
              >
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="uppercase transition-colors duration-300 hover:text-off-white"
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--muted)",
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="py-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-5">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-off-white/50 hover:text-gold transition-colors duration-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p
            className="uppercase text-center"
            style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(245,245,245,0.4)" }}
          >
            &copy; 2026 Kreebz Limited. Lagos, Nigeria. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
