"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section 
      id="contact" 
      className="bg-obsidian flex flex-col justify-center"
      style={{ 
        minHeight: "60vh",
        paddingTop: "100px",
        paddingBottom: "80px",
        borderTop: "1px solid rgba(245, 245, 245, 0.08)"
      }}
    >
      <div className="max-w-[800px] mx-auto px-6 lg:px-12 text-center">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-gold font-serif text-3xl md:text-4xl lg:text-5xl mb-12"
        >
          Your property deserves a principal.
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col"
          style={{ gap: "8px" }}
        >
          <a
            href="mailto:hello@kreebz.com"
            className="font-sans hover:text-gold transition-colors duration-300"
            style={{ 
              fontSize: "18px", 
              color: "#F5F5F5",
              letterSpacing: "0.05em"
            }}
          >
            hello@kreebz.com
          </a>
          <a
            href="tel:+2348000000000"
            className="font-sans hover:text-gold transition-colors duration-300"
            style={{ 
              fontSize: "18px", 
              color: "#F5F5F5",
              letterSpacing: "0.05em"
            }}
          >
            +234 800 000 0000
          </a>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-12"
          style={{ 
            maxWidth: "480px",
            lineHeight: "1.8",
            color: "rgba(245, 245, 245, 0.4)",
            fontSize: "14px"
          }}
        >
          We hold your standard. We maintain your presence. So you never have to.
        </motion.p>
      </div>
    </section>
  );
}
