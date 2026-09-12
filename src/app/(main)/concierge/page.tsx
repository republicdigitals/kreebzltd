import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ConciergeContent from "@/components/ConciergeContent";

export const metadata: Metadata = {
  title: "Concierge Services | Kreebz Limited",
  description: "Jets, off-market homes, reservations, contractors — if it touches your life or your property, ask us.",
};

export default function ConciergePage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="The Concierge Hub"
        title="More than property"
        subtitle="Jets, off-market homes, reservations, contractors — if it touches your life or your property, ask us."
      />
      <ConciergeContent />
    </div>
  );
}
