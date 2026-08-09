"use client";

import { motion } from "framer-motion";

export default function SingleSentence() {
  return (
    <section className="py-[120px] bg-obsidian-light" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="w-full px-6 lg:px-12 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-off-white"
          style={{ fontSize: "clamp(30px, 4vw, 56px)", lineHeight: 1.15 }}
        >
          Marketing, management, and lifestyle services for Lagos&apos;s most discerning properties.
        </motion.p>
      </div>
    </section>
  );
}
