"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import {
  PRINCIPAL_EMAIL,
  PRINCIPAL_EMAIL_MAILTO,
  PRINCIPAL_PHONE_DISPLAY,
  PRINCIPAL_PHONE_TEL,
  PRINCIPAL_WHATSAPP,
} from "@/lib/contact";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import Button from "./ui/Button";

function readAttribution() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    utmContent: params.get("utm_content") ?? undefined,
    referrer: document.referrer || undefined,
    landingPage: window.location.pathname + window.location.search,
  };
}

// 1. Define the schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  interest: z.enum(["buying", "renting", "management", "other"], {
    message: "Please select an area of interest",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().optional(), // Honeypot
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // 2. Initialize the form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "buying",
      message: "",
      website: "",
    },
  });

  // 3. Handle submission
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          interest: data.interest,
          message: data.message,
          website: data.website,
          ...readAttribution(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Submission failed: ${res.status}`);
      }

      trackEvent("submit_enquiry_form", { enquiry_type: data.interest });
      reset();
      router.push("/thank-you");
    } catch (error) {
      console.error("[Contact form]", error);
      trackEvent("enquiry_form_error", {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-obsidian flex flex-col justify-center pt-24 lg:pt-32 pb-20 min-h-[60vh]"
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 w-full">
        <div className="text-center mb-14">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="eyebrow text-gold mb-5"
          >
            Direct line to the people who decide
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="display-serif text-off-white mb-6"
          >
            Talk to a <span className="accent-italic text-gold-light">principal.</span>
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lead text-muted max-w-xl mx-auto"
          >
            No call centre, no ticket queue. Pick whichever suits you —
            a principal replies within one business day.
          </motion.p>
        </div>

        {/* Three contact paths */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            {
              label: "WhatsApp",
              value: PRINCIPAL_PHONE_DISPLAY,
              note: "Fastest — typically same day",
              href: PRINCIPAL_WHATSAPP,
              external: true,
            },
            {
              label: "Call",
              value: PRINCIPAL_PHONE_DISPLAY,
              note: "Mon–Sat, 9:00–18:00 WAT",
              href: PRINCIPAL_PHONE_TEL,
              external: false,
            },
            {
              label: "Email",
              value: PRINCIPAL_EMAIL,
              note: "For documents and detail",
              href: PRINCIPAL_EMAIL_MAILTO,
              external: false,
            },
          ].map((path) => (
            <a
              key={path.label}
              href={path.href}
              {...(path.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group bg-surface-2 border border-border rounded-[var(--radius-lg)] p-7 hover:border-gold/40 transition-colors duration-300"
            >
              <p className="eyebrow text-gold mb-3">{path.label}</p>
              <p className="text-off-white text-lg font-medium tracking-tight break-words group-hover:text-gold-light transition-colors">
                {path.value}
              </p>
              <p className="text-muted text-sm mt-2">{path.note}</p>
            </a>
          ))}
        </motion.div>

        <p className="eyebrow text-muted text-center mb-8">or write to us</p>

        {/* Contact Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-surface-2 p-8 md:p-12 rounded-[var(--radius-lg)] border border-border shadow-2xl relative overflow-hidden"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Honeypot field - visually hidden but available to screen readers/bots */}
            <div className="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-off-white/60">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={cn(
                    "w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white placeholder:text-muted",
                    "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors",
                    errors.name && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                  )}
                  {...register("name")}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-off-white/60">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={cn(
                    "w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white placeholder:text-muted",
                    "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors",
                    errors.email && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                  )}
                  {...register("email")}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs uppercase tracking-widest text-off-white/60">Phone (Optional)</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+234..."
                  className={cn(
                    "w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white placeholder:text-muted",
                    "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
                  )}
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="interest" className="text-xs uppercase tracking-widest text-off-white/60">I am interested in</label>
                <select
                  id="interest"
                  className={cn(
                    "w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white appearance-none",
                    "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors",
                    errors.interest && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                  )}
                  {...register("interest")}
                >
                  <option value="buying">Buying a Property</option>
                  <option value="renting">Renting a Property</option>
                  <option value="management">Facility Management</option>
                  <option value="aviation">Private Jet Charter</option>
                  <option value="other">Other Inquiry</option>
                </select>
                {errors.interest && <p className="text-red-400 text-xs mt-1">{errors.interest.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase tracking-widest text-off-white/60">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="How can we assist you?"
                className={cn(
                  "w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white placeholder:text-muted resize-none",
                  "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors",
                  errors.message && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                )}
                {...register("message")}
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Send it over"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
