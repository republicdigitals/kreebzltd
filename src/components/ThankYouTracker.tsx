"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ThankYouTracker({ project }: { project?: string }) {
  useEffect(() => {
    trackEvent("view_confirmation", { project: project ?? "general" });
  }, [project]);

  return null;
}
