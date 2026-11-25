"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("kreebz_cookie_consent");
    if (!hasConsented) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("kreebz_cookie_consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] left-4 right-4 md:bottom-28 md:left-auto md:right-8 md:translate-x-0 md:w-[360px] z-[65] cookie-consent bg-black border border-white/10 rounded-none shadow-card p-3 md:p-5 text-white"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-white/55 hover:text-white transition-colors"
            aria-label="Close cookie banner"
          >
            <X size={16} />
          </button>

          <h3 className="hidden md:block font-sans font-semibold text-white text-lg mb-2">We value your privacy</h3>
          <p className="hidden md:block text-white/62 text-sm leading-relaxed mb-5">
            We use cookies to improve your experience and analyse traffic. See our <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
          </p>
          <p className="md:hidden pr-6 text-white/72 text-xs leading-snug mb-2">
            <span className="font-semibold text-white">Privacy.</span> Cookies help us improve Kreebz. <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
          </p>
          
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={acceptCookies}
              className="flex-1 bg-gold hover:bg-gold-hover text-ink-fixed px-3 py-2 md:px-4 md:py-2.5 rounded-[var(--radius-sm)] text-xs md:text-sm font-medium transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="flex-1 border border-white/25 hover:border-white text-white px-3 py-2 md:px-4 md:py-2.5 rounded-[var(--radius-sm)] text-xs md:text-sm font-medium transition-colors"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
