"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    title: "Buyers & Sellers",
    description: "Access our exclusive off-market properties or list your premium asset with complete discretion.",
    placeholder: "marketing-sales.jpg",
    href: "/properties",
  },
  {
    title: "Estate Owners",
    description: "End-to-end facility management, operations, and compliance—preserving the value of your assets.",
    placeholder: "estate-management.jpg",
    href: "/contact?subject=Estate%20Management",
  },
  {
    title: "Developers",
    description: "Comprehensive advisory from feasibility and design procurement to construction management and launch.",
    placeholder: "development.jpg",
    href: "/contact?subject=Development%20Advisory",
  },
  {
    title: "Residents",
    description: "Support for current property residents.",
    placeholder: "residents.jpg",
    href: "/contact?subject=Resident%20Services",
  }
];

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    gsap.from(".service-item", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="services" className="py-24 lg:py-32 bg-obsidian border-t border-border/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-24">
          <h2 className="font-serif text-4xl lg:text-6xl text-off-white font-light tracking-tight mb-6">
            Our <span className="italic text-gold">Services</span>
          </h2>
          <p className="text-muted font-sans text-lg max-w-2xl leading-relaxed">
            From pre-development through occupancy, we provide an extensive list of premium services to successfully execute any project and overcome development challenges in Lagos.
          </p>
        </div>

        {/* Desktop Split Layout */}
        <div className="hidden lg:flex gap-16 items-start relative">
          
          {/* Left: Sticky Image Showcase */}
          <div className="w-5/12 sticky top-32 h-[70vh] rounded-none overflow-hidden bg-obsidian-light border border-border/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center bg-obsidian-light"
              >
                {/* Fallback pattern/text for placeholder */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />
                <span className="uppercase text-xs tracking-[0.4em] text-gold-light/40 z-20">
                  {services[hoveredIndex].placeholder}
                </span>
                
                {/* Decorative border elements */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-gold/20" />
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-gold/20" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Scrollable Interactive List */}
          <div className="w-7/12 flex flex-col">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`service-item border-b border-border/30 py-8 transition-colors duration-500 cursor-pointer ${
                  hoveredIndex === index ? "border-gold/50" : "hover:border-border/80"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                <div className="flex justify-between items-start gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-4">
                      <span className="font-mono text-xs text-gold/50">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <h3 className={`font-serif text-2xl lg:text-3xl transition-colors duration-500 ${
                        hoveredIndex === index ? "text-gold-light" : "text-off-white"
                      }`}>
                        {service.title}
                      </h3>
                    </div>
                    
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: hoveredIndex === index ? "auto" : 0,
                        opacity: hoveredIndex === index ? 1 : 0,
                        marginTop: hoveredIndex === index ? 16 : 0
                      }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-muted leading-relaxed max-w-lg pl-10 text-[15px]">
                        {service.description}
                      </p>
                    </motion.div>
                  </div>

                  <Link 
                    href={service.href}
                    className={`mt-2 p-3 border rounded-full transition-all duration-500 flex items-center justify-center shrink-0 ${
                      hoveredIndex === index 
                        ? "border-gold text-gold bg-gold/5 -rotate-45" 
                        : "border-border/50 text-muted hover:text-off-white hover:border-off-white"
                    }`}
                  >
                    <ArrowUpRight size={20} strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="lg:hidden flex flex-col gap-4 mt-8">
          {services.map((service, index) => {
            const isExpanded = expandedIndex === index;
            
            return (
              <div 
                key={index}
                className="service-item bg-obsidian-light border border-border/30 overflow-hidden"
              >
                <button 
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full text-left p-6 flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-gold/50">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <h3 className={`font-serif text-xl ${isExpanded ? "text-gold-light" : "text-off-white"}`}>
                      {service.title}
                    </h3>
                  </div>
                  <div className={`p-2 border rounded-full transition-colors ${
                    isExpanded ? "border-gold text-gold" : "border-border/50 text-muted"
                  }`}>
                    {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-border/10 mt-2">
                        <p className="font-sans text-muted text-sm leading-relaxed mb-6">
                          {service.description}
                        </p>
                        
                        {/* Mobile Image Placeholder */}
                        <div className="relative h-48 w-full bg-obsidian border border-border/20 mb-6 flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />
                          <span className="uppercase text-[10px] tracking-[0.3em] text-gold-light/30 z-20">
                            {service.placeholder}
                          </span>
                        </div>
                        
                        <Link 
                          href={service.href}
                          className="inline-flex items-center gap-2 text-gold hover:text-gold-light uppercase tracking-widest text-[11px] font-medium transition-colors"
                        >
                          Explore Service <ArrowUpRight size={14} />
                        </Link>
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
