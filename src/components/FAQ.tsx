"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: "I'm abroad — how do I buy or manage property in Lagos safely?",
    answer: "Most of our clients are. You get a named principal, verified documentation, and video walkthroughs before you commit a naira — and the same team manages the property after you buy."
  },
  {
    question: "Do you handle both residential and commercial properties?",
    answer: "Yes — homes, penthouses, and commercial spaces across Lagos, mainly for private clients and corporate buyers."
  },
  {
    question: "What is your typical response time for property inquiries?",
    answer: "Within one business day — from a named principal who stays on your file, not a shared inbox."
  },
  {
    question: "Do you offer property management services?",
    answer: "Yes. Repairs, staff, compliance, tenants — we run the property so you don't have to. Ideal for absentee owners and busy professionals."
  },
  {
    question: "Are all your properties listed on the website?",
    answer: "No — a lot of our best properties never get listed publicly. Tell us what you're looking for and we'll source it discreetly."
  },
  {
    question: "How do you ensure the security of transactions?",
    answer: "Every transaction goes through independent legal review and verified documentation before money moves. We can walk you through the exact checks before you commit."
  }
];

interface FAQProps {
  items?: FaqItem[];
  heading?: string;
  eyebrow?: string;
}

export default function FAQ({
  items = defaultFaqs,
  heading = "Frequently Asked Questions",
  eyebrow = "Straight answers",
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-obsidian-light border-y border-border">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="display-serif-sm text-off-white mb-4">{heading}</h2>
          <p className="uppercase tracking-[0.2em] text-[10px] text-gold">{eyebrow}</p>
        </div>

        <div className="space-y-4">
          {items.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={faq.question} 
                className={`border border-border rounded-lg overflow-hidden transition-colors duration-300 ${isOpen ? 'bg-obsidian border-gold/40' : 'bg-transparent'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-sans font-medium text-lg text-off-white pr-8">{faq.question}</span>
                  <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isOpen ? 'border-gold text-gold bg-gold/5' : 'border-border-strong text-muted'}`}>
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
                      <div className="px-6 pb-6 pt-0 text-muted leading-relaxed">
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
