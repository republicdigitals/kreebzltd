"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    label: "Your brief.",
    description: "We begin by understanding exactly what you expect of your property — and hold every decision against that brief."
  },
  {
    number: "02",
    label: "Your standard.",
    description: "Your taste, your requirements, your thresholds. We operate to your standard, not an industry average."
  },
  {
    number: "03",
    label: "Our presence.",
    description: "A dedicated Kreebz principal remains present at your property so you never have to be."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[100px]" style={{ backgroundColor: "#111111" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-gold uppercase text-center mb-16"
          style={{ fontSize: "11px", letterSpacing: "0.3em" }}
        >
          HOW WE WORK
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16" style={{ gap: "64px" }}>
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <span className="text-gold/50 font-serif text-sm tracking-widest mb-4 block">
                {step.number}
              </span>
              <h3 
                className="text-off-white font-serif font-normal mb-4"
                style={{ fontSize: "28px" }}
              >
                {step.label}
              </h3>
              <p 
                className="font-sans leading-relaxed"
                style={{ fontSize: "15px", color: "rgba(245, 245, 245, 0.7)" }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
