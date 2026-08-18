"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ConciergePage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      budget: formData.get("budget") as string,
      bedrooms: formData.get("bedrooms") as string,
      propertyType: formData.get("propertyType") as string,
      neighbourhoods: formData.get("neighbourhoods") as string,
      additionalInfo: formData.get("additionalInfo") as string,
    };

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col md:flex-row pt-20">
      {/* Visual / Branding Side */}
      <div className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-screen border-b md:border-b-0 md:border-r border-border/20">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          alt="Luxury living space"
          fill
          priority
          className="object-cover opacity-60 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent pointer-events-none" />
        
        <div className="absolute inset-0 flex items-center p-8 md:p-16 lg:p-24 z-10">
          <div className="max-w-xl">
            <span className="text-gold uppercase tracking-[0.2em] text-[10px] mb-4 block font-semibold">
              Kreebz Matchmaking
            </span>
            <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl text-off-white leading-[1.1] mb-6">
              Can&apos;t find what you&apos;re looking for?
            </h1>
            <p className="text-muted text-sm md:text-base tracking-wide leading-relaxed mb-8 max-w-md">
              Our inventory extends beyond our public portfolio. Share your exact requirements and our principals will curate a selection of off-market properties that match your vision.
            </p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-obsidian-light/30">
        <div className="w-full max-w-lg">
          {status === "success" ? (
            <div className="text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 mx-auto bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center text-gold">
                <CheckCircle2 size={32} strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-off-white font-light">Request Received</h2>
              <p className="text-muted tracking-wide text-sm">
                A principal from Kreebz Limited will review your requirements and contact you shortly with curated options.
              </p>
              <Button 
                variant="secondary" 
                onClick={() => router.push("/properties")}
                className="mt-8"
              >
                Return to Portfolio
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="uppercase text-[10px] tracking-[0.2em] text-muted ml-1">Full Name</label>
                  <input
                    required
                    id="name"
                    name="name"
                    type="text"
                    className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="uppercase text-[10px] tracking-[0.2em] text-muted ml-1">Email Address</label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="uppercase text-[10px] tracking-[0.2em] text-muted ml-1">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="budget" className="uppercase text-[10px] tracking-[0.2em] text-muted ml-1">Target Budget</label>
                  <input
                    id="budget"
                    name="budget"
                    type="text"
                    placeholder="e.g. ₦500M - ₦800M"
                    className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="bedrooms" className="uppercase text-[10px] tracking-[0.2em] text-muted ml-1">Bedrooms</label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50 appearance-none bg-obsidian"
                  >
                    <option value="">Any</option>
                    <option value="1-2">1-2 Bedrooms</option>
                    <option value="3-4">3-4 Bedrooms</option>
                    <option value="5+">5+ Bedrooms</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="propertyType" className="uppercase text-[10px] tracking-[0.2em] text-muted ml-1">Property Type</label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50 appearance-none bg-obsidian"
                  >
                    <option value="">Any</option>
                    <option value="Apartment">Apartment / Flat</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa / Detached</option>
                    <option value="Terrace">Terrace / Semi-Detached</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="neighbourhoods" className="uppercase text-[10px] tracking-[0.2em] text-muted ml-1">Preferred Areas</label>
                  <input
                    id="neighbourhoods"
                    name="neighbourhoods"
                    type="text"
                    placeholder="e.g. Ikoyi, Victoria Island"
                    className="w-full input-pill px-6 py-4 text-[15px] focus:ring-1 focus:ring-gold/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="additionalInfo" className="uppercase text-[10px] tracking-[0.2em] text-muted ml-1">Additional Requirements</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows={4}
                  placeholder="Tell us about specific features you need (e.g. Pool, Elevator, Smart Home features...)"
                  className="w-full bg-surface border border-border-strong rounded-2xl px-6 py-4 text-off-white font-sans text-[15px] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-colors resize-none placeholder:text-muted"
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm tracking-wide">
                  An error occurred while submitting your request. Please try again.
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-3 py-4"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  "Submitting..."
                ) : (
                  <>
                    Submit Request
                    <Send size={16} />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
