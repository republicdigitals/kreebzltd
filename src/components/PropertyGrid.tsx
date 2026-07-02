"use client";

import { motion } from "framer-motion";
import { properties } from "@/data/properties";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid() {
  return (
    <section id="properties" className="bg-obsidian py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section heading */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-gold uppercase text-center"
          style={{ fontSize: "11px", letterSpacing: "0.3em" }}
        >
          The Portfolio
        </motion.p>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-off-white font-serif font-normal text-center mt-4 mb-16"
          style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
        >
          Currently Under Management
        </motion.h2>

        {/* 2-col grid on desktop, 1-col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: (index % 2) * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
