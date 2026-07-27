"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Sun, Moon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConciergeUX() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [inquiryType, setInquiryType] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setTimeout(() => setStep(1), 500);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const inquiryOptions = [
    "Acquiring a Property",
    "Listing a Property",
    "Facility Management",
    "Private Aviation",
    "General Inquiry"
  ];

  return (
    <>
      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90] flex items-center gap-3">
        {/* Theme Toggle Button */}
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-surface border border-border text-off-white w-12 h-12 md:px-6 md:w-auto md:h-14 rounded-full flex items-center justify-center gap-3 shadow-xl hover:border-gold hover:text-gold transition-colors duration-500"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {/* Concierge Button */}
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setIsOpen(true)}
          className="bg-off-white text-obsidian px-6 py-4 md:h-14 rounded-full font-sans uppercase tracking-[0.2em] text-[10px] font-semibold hover:bg-gold hover:text-off-white transition-colors duration-500 shadow-2xl flex items-center justify-center gap-3 group overflow-hidden"
        >
          <span className="relative z-10 hidden md:inline-block">Private Concierge</span>
          <Sparkles size={16} className="md:hidden relative z-10" />
          <span className="relative z-10 w-2 h-2 rounded-full bg-obsidian group-hover:bg-off-white animate-pulse hidden md:block" />
        </motion.button>
      </div>

      {/* Full Screen Glassmorphism Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/60 backdrop-blur-2xl"
          >
            {/* Close / Back Buttons */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
              {step > 1 && step < 3 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-off-white/50 hover:text-white transition-colors p-2 flex items-center gap-2 text-xs uppercase tracking-widest font-medium"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back</span>
                </button>
              ) : (
                <div /> // Spacer
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-off-white/50 hover:text-white transition-colors p-2"
                aria-label="Close"
              >
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            {/* Modal Content container */}
            <div className="w-full max-w-2xl px-6 relative">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-12"
                  >
                    <h2 className="font-serif italic text-4xl md:text-6xl text-off-white font-light">
                      How may we assist you today?
                    </h2>
                    
                    <div className="flex flex-col gap-2">
                      {inquiryOptions.map((option, idx) => (
                  <button
                    key={option}
                    onClick={() => {
                      setInquiryType(option);
                      setStep(2);
                    }}
                    className="text-left py-6 border-b border-border text-off-white/70 hover:text-gold hover:border-gold/50 transition-all duration-300 font-sans uppercase tracking-[0.15em] text-[11px] flex justify-between items-center group"
                  >
                          <span>0{idx + 1} — {option}</span>
                          <ArrowRight size={16} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep(3);
                    }}
                  >
                    <div>
                      <p className="font-sans uppercase tracking-[0.2em] text-gold text-[10px] mb-4">
                        Inquiry: {inquiryType}
                      </p>
                      <h2 className="font-serif italic text-4xl md:text-5xl text-off-white font-light">
                        Please provide your details, and a dedicated associate will contact you shortly.
                      </h2>
                    </div>

                    <div className="flex flex-col gap-8">
                      <input
                        type="text"
                        required
                        placeholder="FULL NAME"
                        className="w-full bg-transparent border-b border-border pb-4 text-sm text-off-white placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors tracking-widest uppercase"
                      />
                      <input
                        type="email"
                        required
                        placeholder="EMAIL ADDRESS"
                        className="w-full bg-transparent border-b border-border pb-4 text-sm text-off-white placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors tracking-widest uppercase"
                      />
                      <input
                        type="tel"
                        placeholder="PHONE NUMBER (OPTIONAL)"
                        className="w-full bg-transparent border-b border-border pb-4 text-sm text-off-white placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors tracking-widest uppercase"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-off-white text-obsidian hover:bg-gold hover:text-off-white transition-colors duration-500 py-5 w-full uppercase tracking-[0.2em] text-[11px] font-semibold flex items-center justify-center gap-4"
                    >
                      <span>Submit Request</span>
                      <ArrowRight size={16} />
                    </button>
                  </motion.form>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center flex flex-col items-center justify-center py-20"
                  >
                    <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-8">
                      <div className="w-2 h-2 rounded-full bg-gold" />
                    </div>
                    <h2 className="font-serif italic text-4xl md:text-5xl text-off-white font-light mb-6">
                      Request Received.
                    </h2>
                    <p className="text-off-white/60 font-sans text-sm tracking-wide max-w-md mx-auto leading-relaxed">
                      Your inquiry regarding {inquiryType.toLowerCase()} has been securely routed to our concierge team. We will be in touch within 24 hours.
                    </p>
                    <div className="flex flex-col gap-4 mt-12 items-center">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gold uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors border-b border-gold pb-1 hover:border-white"
                      >
                        Return to Website
                      </button>
                      <button
                        onClick={() => setStep(1)}
                        className="text-off-white/40 uppercase tracking-[0.1em] text-[10px] hover:text-white transition-colors mt-4"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
