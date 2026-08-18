"use client";

import { useState } from "react";
import { ArrowRight, Send, CheckCircle2 } from "lucide-react";
import Button from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function SellForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    propertyDetails: "",
    website: "", // Honeypot
  });

  const handleNext = () => {
    if (step === 1 && formData.name && formData.email) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      handleNext();
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const payload = {
      name: formData.name,
      email: formData.email,
      interest: "Property Listing Inquiry: " + formData.propertyDetails,
      website: formData.website,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit request.");
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("An error occurred. Please try again or contact us directly.");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 border border-border/30 bg-surface/50 text-center rounded-2xl"
      >
        <div className="w-16 h-16 mx-auto bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center text-gold mb-6">
          <CheckCircle2 size={32} strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-3xl text-off-white font-light mb-4">Inquiry Received</h3>
        <p className="font-sans text-muted tracking-wide text-sm leading-relaxed max-w-sm mx-auto">
          Thank you for trusting Kreebz Ltd. A principal will review your submission and contact you shortly with complete discretion.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-8 sm:p-12 border border-border/20 bg-surface/30 rounded-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10">
        {/* Honeypot field - hidden from humans */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input 
            type="text" 
            id="website" 
            name="website" 
            tabIndex={-1} 
            autoComplete="off"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-serif text-2xl text-off-white font-light mb-2">Let&apos;s begin</h3>
                <p className="text-muted text-sm tracking-wide">
                  Your information is handled with the utmost confidentiality.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-muted mb-3 pl-2">
                    Owner / Representative Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-muted mb-3 pl-2">
                    Private Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50"
                    placeholder="you@domain.com"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="w-full flex justify-center items-center gap-2"
                  disabled={!formData.name || !formData.email}
                >
                  Continue to Property Details <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-serif text-2xl text-off-white font-light mb-2">About the Asset</h3>
                <p className="text-muted text-sm tracking-wide">
                  Share the essential details of your property to help us prepare an accurate valuation strategy.
                </p>
              </div>

              <div>
                <label htmlFor="propertyDetails" className="block text-xs uppercase tracking-[0.2em] text-muted mb-3 pl-2">
                  Location & Specifications
                </label>
                <textarea
                  id="propertyDetails"
                  name="propertyDetails"
                  required
                  rows={5}
                  value={formData.propertyDetails}
                  onChange={(e) => setFormData({ ...formData, propertyDetails: e.target.value })}
                  className="w-full bg-surface border border-border-strong rounded-2xl px-6 py-4 text-off-white font-sans text-[15px] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors resize-none placeholder:text-muted"
                  placeholder="e.g. 4 Bedroom Penthouse in Ikoyi. Recently renovated."
                />
              </div>

              {errorMsg && (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              )}

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setStep(1)}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="w-2/3 flex justify-center items-center gap-2"
                  disabled={status === "loading" || !formData.propertyDetails}
                >
                  {status === "loading" ? "Submitting..." : (
                    <>Submit to Principals <Send size={16} /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
