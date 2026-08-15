"use client";

import { useState } from "react";
import Button from "./ui/Button";

export default function RentalRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      interest: "Off-Market Rental Request: " + formData.get("requirements"),
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

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto p-8 border border-gold/20 bg-gold/5 text-center">
        <h3 className="font-serif text-2xl text-off-white font-light mb-4">Request Received</h3>
        <p className="font-sans text-muted tracking-wide text-sm leading-relaxed">
          Thank you for your interest. A principal will be in touch shortly to discuss our off-market rental portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 border border-white/10 bg-white/5 text-left">
      <h3 className="font-serif text-2xl text-off-white font-light mb-4">Off-Market Rentals</h3>
      <p className="font-sans text-muted tracking-wide text-sm leading-relaxed mb-8">
        Our premium rental portfolio is currently operating exclusively off-market to maintain the privacy of our high-net-worth clientele. Please share your requirements below, and a principal will curate a selection for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - hidden from humans */}
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

        <div>
          <label htmlFor="requirements" className="block text-xs uppercase tracking-[0.2em] text-gold-light/70 mb-2">
            Requirements (Budget, Location, Bedrooms)
          </label>
          <textarea
            id="requirements"
            name="requirements"
            required
            rows={3}
            className="w-full bg-transparent border-b border-white/20 pb-3 text-off-white font-sans text-[15px] focus:outline-none focus:border-gold transition-colors placeholder:text-white/20 resize-none rounded-none"
            placeholder="e.g. 4+ bedrooms in Ikoyi, up to $200k/yr"
          />
        </div>

        {errorMsg && (
          <p className="text-red-400 text-sm mt-4">{errorMsg}</p>
        )}

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Request Off-Market Access"}
          </Button>
        </div>
      </form>
    </div>
  );
}
