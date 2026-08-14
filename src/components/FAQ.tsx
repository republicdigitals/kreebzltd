"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Do you handle both residential and commercial properties?",
    answer: "Yes, Kreebz Ltd specializes in both luxury residential properties and premium commercial spaces, primarily focusing on high-net-worth individuals and corporate entities."
  },
  {
    question: "What is your typical response time for property inquiries?",
    answer: "We guarantee a response within 2 hours during business hours. A dedicated principal is assigned to ensure your requirements are handled with utmost urgency."
  },
  {
    question: "Do you offer property management services?",
    answer: "Absolutely. Our concierge property management service is designed for absentee owners and busy professionals who demand meticulous care for their assets."
  },
  {
    question: "Are all your properties listed on the website?",
    answer: "No. We maintain a discrete portfolio of off-market properties for our exclusive clients. Contact us directly to discuss your specific requirements."
  },
  {
    question: "How do you ensure the security of transactions?",
    answer: "We partner with top-tier legal and financial institutions in Nigeria to guarantee rigorous due diligence and absolute security for every transaction we facilitate."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-obsidian-light border-y border-white/5">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Frequently Asked Questions</h2>
          <p className="uppercase tracking-[0.2em] text-[10px] text-gold">Clarity & Transparency</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={`border border-white/10 rounded-lg overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-obsidian/50 border-gold/30' : 'bg-transparent'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-serif text-lg text-white pr-8">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isOpen ? 'border-gold text-gold bg-gold/5' : 'border-white/20 text-white/50'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-white/60 leading-relaxed font-light">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
