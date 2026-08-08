"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

// 1. Define the schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  interest: z.enum(["buying", "renting", "management", "other"], {
    message: "Please select an area of interest",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
        }),
      });

      if (!res.ok) {
        throw new Error(`Submission failed: ${res.status}`);
      }

      setIsSuccess(true);
      reset();
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("[Contact form]", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="bg-obsidian flex flex-col justify-center"
      style={{ 
        minHeight: "60vh",
        paddingTop: "100px",
        paddingBottom: "80px"
      }}
    >
      <div className="max-w-[800px] mx-auto px-6 lg:px-12 w-full">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="display-lg text-off-white mb-6"
          >
            Your property deserves a{" "}
            <span className="accent-italic text-gold-light">principal.</span>
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-2"
          >
            <a
              href="mailto:hello@kreebzltd.com"
              className="font-sans text-off-white hover:text-gold transition-colors duration-300 text-lg tracking-wide"
            >
              hello@kreebzltd.com
            </a>
            <a
              href="tel:+2348000000000"
              className="font-sans text-off-white hover:text-gold transition-colors duration-300 text-lg tracking-wide"
            >
              +234 800 000 0000
            </a>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-[#151515] p-8 md:p-12 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#151515]/95 backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Message Received</h3>
                <p className="text-white/60">A principal will be in touch shortly.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-white/50">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={cn(
                    "w-full bg-black/30 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/20",
                    "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors",
                    errors.name && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                  )}
                  {...register("name")}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-white/50">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className={cn(
                    "w-full bg-black/30 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/20",
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
                <label htmlFor="phone" className="text-xs uppercase tracking-widest text-white/50">Phone (Optional)</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+234..."
                  className={cn(
                    "w-full bg-black/30 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/20",
                    "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
                  )}
                  {...register("phone")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="interest" className="text-xs uppercase tracking-widest text-white/50">I am interested in</label>
                <select
                  id="interest"
                  className={cn(
                    "w-full bg-black/30 border border-white/10 rounded-md px-4 py-3 text-white appearance-none",
                    "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors",
                    errors.interest && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                  )}
                  {...register("interest")}
                >
                  <option value="buying">Buying a Property</option>
                  <option value="renting">Renting a Property</option>
                  <option value="management">Facility Management</option>
                  <option value="other">Other Inquiry</option>
                </select>
                {errors.interest && <p className="text-red-400 text-xs mt-1">{errors.interest.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase tracking-widest text-white/50">Message</label>
              <textarea
                id="message"
                rows={5}
                placeholder="How can we assist you?"
                className={cn(
                  "w-full bg-black/30 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-white/20 resize-none",
                  "focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors",
                  errors.message && "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50"
                )}
                {...register("message")}
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold-light text-obsidian font-medium uppercase tracking-[0.2em] text-xs py-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-obsidian" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Send Inquiry"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
