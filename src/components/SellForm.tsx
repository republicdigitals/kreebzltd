"use client";

import { useState } from "react";
import Button from "./ui/Button";

export default function SellForm() {
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
      interest: "Property Listing Inquiry: " + formData.get("propertyDetails"),
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
      <div className="p-8 border border-gold/20 bg-gold/5 text-center">
        <h3 className="font-serif text-2xl text-off-white font-light mb-4">Inquiry Received</h3>
        <p className="font-sans text-muted tracking-wide text-sm leading-relaxed">
          Thank you. A principal will be in touch shortly to discuss your property and [Kreebz Content Placeholder: outline next steps for valuation/marketing].
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 border border-white/10 bg-white/5">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Honeypot field - hidden from humans */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-gold-light/70 mb-2">
            Owner / Representative Name
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
            Contact Email
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
          <label htmlFor="propertyDetails" className="block text-xs uppercase tracking-[0.2em] text-gold-light/70 mb-2">
            Property Details
          </label>
          <textarea
            id="propertyDetails"
            name="propertyDetails"
            required
            rows={4}
            className="w-full bg-transparent border-b border-white/20 pb-3 text-off-white font-sans text-[15px] focus:outline-none focus:border-gold transition-colors placeholder:text-white/20 resize-none rounded-none"
            placeholder="Location, Type, Estimated Value (Optional)"
          />
        </div>

        {errorMsg && (
          <p className="text-red-400 text-sm mt-4">{errorMsg}</p>
        )}

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Submit Listing Inquiry"}
          </Button>
        </div>
      </form>
    </div>
  );
}
