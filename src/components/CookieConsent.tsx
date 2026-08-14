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
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[400px] z-[100] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl p-6"
        >
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            aria-label="Close cookie banner"
          >
            <X size={16} />
          </button>
          
          <h3 className="font-serif text-white text-lg mb-2">We value your privacy</h3>
          <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies as described in our <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link>.
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={acceptCookies}
              className="flex-1 bg-gold hover:bg-gold-light text-obsidian px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="flex-1 border border-white/20 hover:border-white/40 text-white px-4 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-colors"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
