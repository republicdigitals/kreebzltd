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
    <section className="py-24 bg-obsidian-light border-y border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Client Testimonials</h2>
          <p className="uppercase tracking-[0.2em] text-[10px] text-gold">Trusted by the best</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-8 border border-white/10 rounded-xl bg-obsidian flex flex-col justify-between"
            >
              <div className="mb-8 relative">
                <svg className="w-8 h-8 text-gold/20 absolute -top-4 -left-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-white/80 font-serif leading-relaxed text-lg relative z-10 italic">
                  "{testimonial.quote}"
                </p>
              </div>
              <div>
                <p className="text-white font-medium uppercase tracking-widest text-xs">{testimonial.author}</p>
                <p className="text-gold uppercase tracking-widest text-[9px] mt-1">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
