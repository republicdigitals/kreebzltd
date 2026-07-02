"use client";

import { motion } from "framer-motion";

export default function SingleSentence() {
  return (
    <section className="py-[120px] bg-obsidian">
      <div className="w-full px-6 lg:px-12 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-gold font-serif font-normal italic"
          style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
        >
          Where others manage, Kreebz represents.
        </motion.p>
      </div>
    </section>
  );
}
