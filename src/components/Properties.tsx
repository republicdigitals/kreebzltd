"use client";

import { motion } from "framer-motion";

/* ASSET SWAP: Replace background-color placeholders with real photography when property-ikoyi.jpg, property-vi.jpg, property-banana-island.jpg are supplied to /public/images/ */

const properties = [
  {
    neighbourhood: "Ikoyi",
    description: "Lagos' most established prime address.",
    placeholder: "property-ikoyi.jpg",
    height: "480px"
  },
  {
    neighbourhood: "Victoria Island",
    description: "The commercial and residential heart of Lagos.",
    placeholder: "property-vi.jpg",
    height: "360px"
  },
  {
    neighbourhood: "Banana Island",
    description: "Exclusive waterfront living at its finest.",
    placeholder: "property-banana-island.jpg",
    height: "540px"
  }
];

export default function Properties() {
  return (
    <section id="properties" className="py-24 lg:py-32" style={{ backgroundColor: "#111111" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-gold uppercase text-center"
          style={{ fontSize: "11px", letterSpacing: "0.3em" }}
        >
          THE PORTFOLIO
        </motion.p>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-gold font-serif font-normal text-center mb-16 mt-4"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
        >
          The Portfolio
        </motion.h2>

        {/* Masonry Layout - CSS Columns */}
        <div 
          className="columns-1 md:columns-2 lg:columns-3"
          style={{ columnGap: "24px" }}
        >
          {properties.map((property, index) => (
            <motion.div
              key={property.neighbourhood}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              style={{ breakInside: "avoid", marginBottom: "24px" }}
            >
              {/* Image Placeholder */}
              <div 
                className="flex items-center justify-center w-full"
                style={{ 
                  height: property.height,
                  backgroundColor: "#1a1a1a"
                }}
              >
                <span 
                  className="uppercase"
                  style={{ 
                    color: "#D4AF37",
                    fontSize: "11px",
                    letterSpacing: "0.3em"
                  }}
                >
                  {property.placeholder}
                </span>
              </div>

              {/* Content */}
              <div className="mt-4">
                <span 
                  className="font-sans uppercase block"
                  style={{ 
                    fontSize: "10px",
                    letterSpacing: "0.25em",
                    color: "#D4AF37"
                  }}
                >
                  CURRENTLY UNDER MANAGEMENT
                </span>
                <h3 
                  className="font-serif font-normal mt-2"
                  style={{ 
                    fontSize: "24px",
                    color: "#F5F5F5"
                  }}
                >
                  {property.neighbourhood}
                </h3>
                <p 
                  className="font-sans mt-1"
                  style={{ 
                    fontSize: "14px",
                    color: "rgba(245, 245, 245, 0.6)"
                  }}
                >
                  {property.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
