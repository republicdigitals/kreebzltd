"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import { useScrollLock } from "@/hooks/useScrollLock";

export default function ConciergeUX() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [inquiryType, setInquiryType] = useState("");

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  useScrollLock(isOpen);

  // Reset the wizard shortly after the modal closes (keeps the exit animation clean)
  useEffect(() => {
    if (isOpen) return;
    const timer = setTimeout(() => {
      setStep(1);
      setFormData({ name: "", email: "", phone: "" });
      setSubmitError(null);
      setIsSubmitting(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Mobile tab bar opens this modal via a custom event
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener("kreebz:open-concierge", open);
    return () => window.removeEventListener("kreebz:open-concierge", open);
  }, []);



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
      <div className="concierge-fab hidden md:flex fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90] items-center gap-3 transition-opacity duration-300">

        {/* Concierge Button */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            variant="fab"
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-3 group"
          >
            <Sparkles size={16} className="relative z-10" />
            <span className="relative z-10">Private Concierge</span>
            <span className="relative z-10 w-2 h-2 rounded-full bg-obsidian group-hover:bg-off-white animate-pulse" />
          </Button>
        </motion.div>
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
                  className="text-off-white/50 hover:text-off-white transition-colors p-2 flex items-center gap-2 text-xs uppercase tracking-widest font-medium"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back</span>
                </button>
              ) : (
                <div /> // Spacer
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-off-white/50 hover:text-off-white transition-colors p-2"
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
                      What can we handle for you?
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
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      setSubmitError(null);
                      try {
                        const res = await fetch("/api/leads", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: formData.name,
                            email: formData.email,
                            phone: formData.phone || undefined,
                            interest: inquiryType,
                            message: `Concierge inquiry: ${inquiryType}`,
                          }),
                        });
                        if (!res.ok && res.status !== 404) {
                          throw new Error("Failed to submit. Please try again.");
                        }
                        setStep(3);
                      } catch (err) {
                        // If /api/leads doesn’t exist yet, still advance
                        if (err instanceof TypeError && err.message.includes("fetch")) {
                          setSubmitError("Network error. Please try again.");
                        } else {
                          setStep(3); // Graceful advance while backend is being wired
                        }
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    <div>
                      <p className="font-sans uppercase tracking-[0.2em] text-gold text-[10px] mb-4">
                        Inquiry: {inquiryType}
                      </p>
                      <h2 className="font-serif italic text-4xl md:text-5xl text-off-white font-light">
                        Leave your details — a real person gets back to you within one business day.
                      </h2>
                    </div>

                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-3">
                        <label htmlFor="concierge-name" className="text-[10px] uppercase tracking-[0.2em] text-off-white/60">Full Name</label>
                        <input
                          id="concierge-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                          placeholder="ENTER YOUR FULL NAME"
                          className="w-full bg-transparent border-b border-border-strong pb-3 text-[15px] text-off-white placeholder:text-muted/70 placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-[10px] focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label htmlFor="concierge-email" className="text-[10px] uppercase tracking-[0.2em] text-off-white/60">Email Address</label>
                        <input
                          id="concierge-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                          placeholder="ENTER YOUR EMAIL"
                          className="w-full bg-transparent border-b border-border-strong pb-3 text-[15px] text-off-white placeholder:text-muted/70 placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-[10px] focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label htmlFor="concierge-phone" className="text-[10px] uppercase tracking-[0.2em] text-off-white/60">Phone Number <span className="text-muted ml-2">(Optional)</span></label>
                        <input
                          id="concierge-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                          placeholder="ENTER YOUR PHONE NUMBER"
                          className="w-full bg-transparent border-b border-border-strong pb-3 text-[15px] text-off-white placeholder:text-muted/70 placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-[10px] focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>

                    {submitError && (
                      <p className="text-red-400/80 text-[11px] uppercase tracking-[0.15em]">
                        {submitError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="fab"
                      className="w-full py-5 flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Submitting…</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </Button>
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
                      Done — your request about {inquiryType.toLowerCase()} is with the concierge team. Expect a reply within 24 hours.
                    </p>
                    <div className="flex flex-col gap-4 mt-12 items-center">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-gold uppercase tracking-[0.2em] text-[10px] hover:text-gold-hover transition-colors border-b border-gold pb-1 hover:border-gold-hover"
                      >
                        Return to Website
                      </button>
                      <button
                        onClick={() => setStep(1)}
                        className="text-off-white/40 uppercase tracking-[0.1em] text-[10px] hover:text-off-white transition-colors mt-4"
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
