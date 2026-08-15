"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";

interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

export default function ViewingModal({ isOpen, onClose, propertyTitle }: ViewingModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      interest: `Private Viewing Request: ${propertyTitle}`,
      website: formData.get("website"), // Honeypot
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-obsidian/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-obsidian border border-white/10 p-8 sm:p-12 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted hover:text-off-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {status === "success" ? (
          <div className="text-center py-8">
            <h3 className="font-serif text-2xl text-off-white font-light mb-4">Request Received</h3>
            <p className="font-sans text-muted tracking-wide text-sm leading-relaxed mb-8">
              Thank you. A principal will be in touch shortly to schedule your private viewing of {propertyTitle}.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h3 className="font-serif text-2xl text-off-white font-light mb-2">Request Private Viewing</h3>
            <p className="font-sans text-muted tracking-wide text-sm leading-relaxed mb-8">
              {propertyTitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-gold-light/70 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-off-white font-sans text-[15px] focus:outline-none focus:border-gold transition-colors placeholder:text-white/20 rounded-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-gold-light/70 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-off-white font-sans text-[15px] focus:outline-none focus:border-gold transition-colors placeholder:text-white/20 rounded-none"
                  placeholder="john@example.com"
                />
              </div>

              {errorMsg && (
                <p className="text-red-400 text-sm mt-4">{errorMsg}</p>
              )}

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
