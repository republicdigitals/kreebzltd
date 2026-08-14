"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const cases = [
  {
    id: "cs-1",
    title: "The Ikoyi Acquisition",
    category: "Luxury Residential",
    description: "Secured a rare off-market penthouse for an international client, negotiating a 15% below-market rate through exclusive developer relationships.",
    metric: "15% Below Market",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cs-2",
    title: "Victoria Island Estate",
    category: "Property Management",
    description: "Revamped the management of a 12-unit luxury complex, increasing tenant retention by 40% and optimizing operational costs within 6 months.",
    metric: "40% Higher Retention",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
  }
];

export default function CaseStudies() {
  return (
    <section className="py-24 bg-obsidian">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Case Studies</h2>
            <p className="uppercase tracking-[0.2em] text-[10px] text-gold">Proven Results</p>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-medium">
            Discuss Your Needs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group relative block overflow-hidden rounded-xl border border-white/5 bg-obsidian-light"
            >
              <div className="aspect-[16/9] relative overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gold uppercase tracking-[0.2em] text-[10px] mb-2">{study.category}</p>
                    <h3 className="text-2xl font-serif text-white">{study.title}</h3>
                  </div>
                  <div className="bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                    {study.metric}
                  </div>
                </div>
                <p className="text-white/60 leading-relaxed font-light mb-6">
                  {study.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
