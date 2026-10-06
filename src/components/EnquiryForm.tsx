"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import Button from "./ui/Button";

const enquirySchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone or WhatsApp number"),
  enquiryType: z.enum(["buy", "rent", "sell", "develop", "facility-management", "other"], {
    message: "Please select an enquiry type",
  }),
  project: z.enum(["bourdillon", "other", "not-sure"], {
    message: "Please select a project",
  }),
  nextStep: z.enum(["brochure", "call", "consultation", "viewing", "info"], {
    message: "Please choose your preferred next step",
  }),
  consent: z.literal(true, {
    message: "Please confirm we may contact you about this enquiry",
  }),
  // Optional qualification fields
  timeframe: z.string().optional(),
  preferredContact: z.string().optional(),
  message: z.string().optional(),
  website: z.string().optional(), // honeypot
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
}

interface EnquiryFormProps {
  /** Pre-selected project, e.g. "bourdillon" when rendered on the project page */
  defaultProject?: "bourdillon" | "other" | "not-sure";
  defaultEnquiryType?: EnquiryFormValues["enquiryType"];
  /** Action-specific submit label, e.g. "Request the Bourdillon brochure" */
  submitLabel?: string;
  /** Where to send the user after success — defaults to /thank-you */
  confirmationPath?: string;
  /** Compact mode hides optional qualification fields behind a toggle */
  compact?: boolean;
}

function readAttribution(): Attribution {
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

const inputClasses =
  "w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white placeholder:text-muted focus:outline-none focus:border-off-white transition-colors";
const errorClasses = "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50";
const labelClasses = "text-xs uppercase tracking-widest text-off-white/60";

export default function EnquiryForm({
  defaultProject = "not-sure",
  defaultEnquiryType = "buy",
  submitLabel = "Submit enquiry",
  confirmationPath = "/thank-you",
  compact = false,
}: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showOptional, setShowOptional] = useState(!compact);
  const startedRef = useRef(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      enquiryType: defaultEnquiryType,
      project: defaultProject,
      nextStep: "brochure",
      consent: undefined,
    },
  });

  const markStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("start_enquiry_form", { project: defaultProject });
    }
  };

  const onSubmit = async (data: EnquiryFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          interest: data.enquiryType,
          project: data.project,
          nextStep: data.nextStep,
          timeframe: data.timeframe || undefined,
          preferredContact: data.preferredContact || undefined,
          message: data.message || undefined,
          consent: data.consent,
          website: data.website,
          ...readAttribution(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Submission failed: ${res.status}`);
      }

      trackEvent("submit_enquiry_form", {
        project: data.project,
        enquiry_type: data.enquiryType,
        next_step: data.nextStep,
      });

      const target = new URL(confirmationPath, window.location.origin);
      target.searchParams.set("project", data.project);
      target.searchParams.set("step", data.nextStep);
      router.push(target.pathname + target.search);
    } catch (error) {
      console.error("[EnquiryForm]", error);
      trackEvent("enquiry_form_error", { project: defaultProject });
      setSubmitError(
        "Your enquiry could not be sent. Please try again, or contact us directly at hello@kreebzltd.com or +234 806 994 9948."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocus={markStarted}
      className="space-y-6"
      noValidate
    >
      {/* Honeypot */}
      <div className="absolute opacity-0 -z-10 w-0 h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="enq-website">Website</label>
        <input id="enq-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="enq-name" className={labelClasses}>Full name</label>
          <input
            id="enq-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={cn(inputClasses, errors.name && errorClasses)}
            {...register("name")}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="enq-email" className={labelClasses}>Email address</label>
          <input
            id="enq-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={cn(inputClasses, errors.email && errorClasses)}
            {...register("email")}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="enq-phone" className={labelClasses}>Phone / WhatsApp</label>
          <input
            id="enq-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+234..."
            className={cn(inputClasses, errors.phone && errorClasses)}
            {...register("phone")}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="enq-type" className={labelClasses}>Enquiry type</label>
          <select
            id="enq-type"
            className={cn(inputClasses, "appearance-none", errors.enquiryType && errorClasses)}
            {...register("enquiryType")}
          >
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
            <option value="sell">Sell</option>
            <option value="develop">Develop</option>
            <option value="facility-management">Facility Management</option>
            <option value="other">Other</option>
          </select>
          {errors.enquiryType && <p className="text-red-400 text-xs mt-1">{errors.enquiryType.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="enq-project" className={labelClasses}>Project of interest</label>
          <select
            id="enq-project"
            className={cn(inputClasses, "appearance-none", errors.project && errorClasses)}
            {...register("project")}
          >
            <option value="bourdillon">Bourdillon, Ikoyi</option>
            <option value="other">Other</option>
            <option value="not-sure">Not sure yet</option>
          </select>
          {errors.project && <p className="text-red-400 text-xs mt-1">{errors.project.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="enq-next" className={labelClasses}>Preferred next step</label>
          <select
            id="enq-next"
            className={cn(inputClasses, "appearance-none", errors.nextStep && errorClasses)}
            {...register("nextStep")}
          >
            <option value="brochure">Send me the project brochure</option>
            <option value="call">Arrange a call</option>
            <option value="consultation">Arrange a private consultation</option>
            <option value="viewing">Arrange a viewing</option>
            <option value="info">General information</option>
          </select>
          {errors.nextStep && <p className="text-red-400 text-xs mt-1">{errors.nextStep.message}</p>}
        </div>
      </div>

      {compact && !showOptional && (
        <button
          type="button"
          onClick={() => setShowOptional(true)}
          className="text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors"
        >
          + Add optional details
        </button>
      )}

      {showOptional && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="enq-timeframe" className={labelClasses}>
                Decision timeframe <span className="normal-case text-muted">(optional)</span>
              </label>
              <select
                id="enq-timeframe"
                className={cn(inputClasses, "appearance-none")}
                {...register("timeframe")}
              >
                <option value="">Prefer not to say</option>
                <option value="immediately">Immediately</option>
                <option value="1-3-months">1–3 months</option>
                <option value="3-6-months">3–6 months</option>
                <option value="6-12-months">6–12 months</option>
                <option value="researching">Researching</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="enq-contact-method" className={labelClasses}>
                Preferred contact method <span className="normal-case text-muted">(optional)</span>
              </label>
              <select
                id="enq-contact-method"
                className={cn(inputClasses, "appearance-none")}
                {...register("preferredContact")}
              >
                <option value="">No preference</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="enq-message" className={labelClasses}>
              Message or specific question <span className="normal-case text-muted">(optional)</span>
            </label>
            <textarea
              id="enq-message"
              rows={4}
              placeholder="Anything you'd like us to prepare for the conversation?"
              className={cn(inputClasses, "resize-none")}
              {...register("message")}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <label htmlFor="enq-consent" className="flex items-start gap-3 cursor-pointer">
          <input
            id="enq-consent"
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-[#D4AF37]"
            {...register("consent")}
          />
          <span className="text-sm text-off-white/70 leading-relaxed">
            I agree to be contacted by Kreebz Ltd about this enquiry. See our{" "}
            <a href="/privacy" className="text-gold underline underline-offset-2 hover:text-gold-light">
              privacy policy
            </a>
            .
          </span>
        </label>
        {errors.consent && <p className="text-red-400 text-xs mt-1">{errors.consent.message}</p>}
      </div>

      {submitError && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-sm)] text-red-400 text-sm">
          {submitError}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <svg className="animate-spin h-4 w-4 text-ink" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
