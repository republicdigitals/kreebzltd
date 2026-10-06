"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Kreebz delivered beyond our expectations. They found us an off-market penthouse in Ikoyi that perfectly matched our discrete requirements. The entire process was seamless and handled with absolute professionalism.",
    author: "Elena R.",
    role: "Private Investor"
  },
  {
    quote: "Working with Michael and his team was a breath of fresh air. They understand luxury real estate at a fundamental level. From viewing to acquisition, their attention to detail was immaculate.",
    author: "Jonathan K.",
    role: "CEO, Tech Ventures"
  },
  {
    quote: "We entrusted Kreebz with our estate management, and they have been phenomenal. The concierge approach ensures our properties are pristine and our tenants are always satisfied.",
    author: "Sarah O.",
    role: "Property Owner"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-obsidian">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <p className="flex items-center justify-center gap-5 eyebrow text-gold tracking-[0.25em] mb-8">
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
            Testimonials
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
          </p>
          <h2 className="display-serif-sm text-off-white mb-4">What clients tell us</h2>
          <p className="text-muted text-lead">In their words</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-10 rounded-[var(--radius-lg)] bg-obsidian-light flex flex-col items-center text-center"
            >
              <svg className="w-10 h-10 text-off-white/10 mb-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="font-serif italic text-off-white/80 leading-relaxed text-[17px] mb-8">
                {testimonial.quote}
              </p>
              <span className="w-11 h-11 rounded-full bg-panel text-white flex items-center justify-center font-sans font-bold text-sm mt-auto">
                {testimonial.author.charAt(0)}
              </span>
              <p className="text-gold font-bold uppercase tracking-[0.15em] text-xs mt-4">{testimonial.author}</p>
              <p className="text-muted text-xs mt-1">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
