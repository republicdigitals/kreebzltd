"use client";

/**
 * Lightweight analytics event helper.
 * Pushes events to Google Analytics (gtag) when available and always
 * mirrors them to the dataLayer so a tag manager can pick them up.
 *
 * Event names follow the conversion-funnel brief:
 * view_project, click_primary_cta, click_brochure_cta,
 * click_consultation_cta, click_phone, click_whatsapp, click_email,
 * start_enquiry_form, submit_enquiry_form, enquiry_form_error,
 * view_confirmation, brochure_sent, consultation_booked.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(event: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const payload = { event, ...params };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch {
    // never let analytics break the page
  }

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
  } catch {
    // no-op
  }
}
