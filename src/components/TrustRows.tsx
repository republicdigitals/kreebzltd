"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const rows = [
  {
    title: "Vetted homes & investments",
    desc: "Every listing is checked — title, condition, price — before it reaches you. Ikoyi, Victoria Island, Banana Island.",
    href: "/properties",
    image: "/images/banana-villa-render.webp",
  },
  {
    title: "Management you never think about",
    desc: "Staff, repairs, compliance, tenants — we run the property so you don't have to. Ideal for absentee owners.",
    href: "/management",
    image: null,
  },
  {
    title: "Private aviation on call",
    desc: "Light to heavy jets, booked and confirmed through Kreebz. One call — you're wheels-up.",
    href: "/services/private-jet",
    image: null,
  },
];

export default function TrustRows() {
  return (
    <section className="py-24 lg:py-32 bg-obsidian">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* DeNest-style centered header with hairlines */}
        <div className="text-center mb-14">
          <p className="flex items-center justify-center gap-5 eyebrow text-gold tracking-[0.25em] mb-8">
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
            About Kreebz
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
          </p>
          <h2 className="display-serif-sm text-off-white mb-4">
            One team for the whole property
          </h2>
          <p className="text-muted text-lead max-w-xl mx-auto mb-8">
            Find it, buy it, run it — and fly home to it.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center border border-gold text-gold rounded-[var(--radius-pill)] px-7 py-3 text-sm font-medium hover:bg-gold hover:text-ink transition-colors duration-300"
          >
            Learn More
          </Link>
        </div>

        {/* Alternating image / dark feature rows */}
        <div className="flex flex-col gap-6">
          {rows.map((row, i) => (
            <motion.div
              key={row.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={row.href}
                className="group relative flex min-h-[260px] md:min-h-[300px] overflow-hidden rounded-[var(--radius-lg)]"
              >
                {row.image ? (
                  <>
                    <Image
                      src={row.image}
                      alt={row.title}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/10 group-hover:from-black/45 transition-colors duration-500" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-panel" />
                )}

                <div className="relative z-10 flex flex-col justify-center gap-4 p-8 md:p-12 pr-24 md:pr-28">
                  <h3 className="font-sans font-bold text-white text-2xl md:text-3xl tracking-tight">
                    {row.title}
                  </h3>
                  <p className={`leading-relaxed max-w-md ${row.image ? "text-white font-medium" : "text-white/60"}`}>
                    {row.desc}
                  </p>
                </div>

                <span className="absolute right-6 bottom-6 md:right-10 md:bottom-10 w-12 h-12 rounded-full border border-gold/50 bg-black/30 backdrop-blur-sm flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-ink group-hover:border-gold transition-all duration-300">
                  <ArrowUpRight size={18} strokeWidth={2} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
