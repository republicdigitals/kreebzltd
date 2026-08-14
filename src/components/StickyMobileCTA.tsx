"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian-light border-t border-white/10 p-4 pb-safe flex gap-4"
        >
          <Link 
            href="tel:+2348069949948"
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-md py-3 text-sm font-medium transition-colors"
          >
            <Phone size={16} /> Call
          </Link>
          <Link 
            href="/contact"
            className="flex-[2] flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-obsidian rounded-md py-3 text-sm font-medium uppercase tracking-widest transition-colors"
          >
            <Mail size={16} /> Inquire Now
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
