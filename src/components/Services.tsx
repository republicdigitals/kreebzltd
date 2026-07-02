"use client";

import { motion } from "framer-motion";

/* ASSET SWAP: Replace background-color placeholders with real photography when service-1.jpg through service-4.jpg are supplied to /public/images/ */

const services = [
  {
    title: "Owner Representation",
    description: "We act solely for property owners. Your interests, our priority.",
    placeholder: "service-1.jpg"
  },
  {
    title: "Property & Estate Management",
    description: "End-to-end oversight. Maintenance, compliance, and value preservation.",
    placeholder: "service-2.jpg"
  },
  {
    title: "The Private Circle",
    description: "Exclusive access. Pre-qualified tenants, discreet transactions.",
    placeholder: "service-3.jpg"
  },
  {
    title: "Housekeeping & Specialist Care",
    description: "Detail-oriented stewardship. From daily maintenance to concierge-level.",
    placeholder: "service-4.jpg"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-obsidian">
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
          WHAT WE DO
        </motion.p>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-gold font-serif font-normal text-center mb-16 mt-4"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
        >
          What We Do
        </motion.h2>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gap: "24px" }}>
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="overflow-hidden"
              style={{ 
                backgroundColor: "#111111",
                borderRadius: "2px"
              }}
            >
              {/* Image Placeholder Area */}
              <div 
                className="flex items-center justify-center"
                style={{ 
                  height: "400px",
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
                  {service.placeholder}
                </span>
              </div>

              {/* Content Area */}
              <div style={{ padding: "32px" }}>
                <h3 
                  className="font-serif font-normal mb-3"
                  style={{ 
                    fontSize: "28px",
                    color: "#F5F5F5"
                  }}
                >
                  {service.title}
                </h3>
                <p 
                  className="font-sans"
                  style={{ 
                    fontSize: "15px",
                    lineHeight: "1.7",
                    color: "rgba(245, 245, 245, 0.7)"
                  }}
                >
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
