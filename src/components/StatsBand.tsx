"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "100%",
    label: "Listings inspected",
    desc: "Every property on this site has been walked by our team",
  },
  {
    value: "5",
    label: "Districts covered",
    desc: "Ground we know street by street — nothing we can't inspect",
  },
  {
    value: "24/7",
    label: "Concierge Cover",
    desc: "A real person on call for managed homes",
  },
];

export default function StatsBand() {
  return (
    <section className="py-24 lg:py-32 bg-obsidian">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <p className="flex items-center justify-center gap-5 eyebrow text-gold tracking-[0.25em] mb-8">
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
            By the numbers
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
          </p>
          <h2 className="display-serif-sm text-off-white mb-4">Results, not promises</h2>
          <p className="text-muted text-lead">Consistent outcomes, built over time</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center"
            >
              <p className="font-serif text-gold-light text-[clamp(56px,7vw,88px)] leading-none tracking-tight" style={{ fontVariationSettings: "'opsz' 144" }}>
                {stat.value}
              </p>
              <p className="eyebrow text-off-white tracking-[0.2em] mt-4">{stat.label}</p>
              <p className="text-muted text-sm mt-2 max-w-[240px] mx-auto">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
