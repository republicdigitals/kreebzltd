import type { Metadata } from "next";
import ConciergeContent from "@/components/ConciergeContent";

export const metadata: Metadata = {
  title: "Concierge Services | Kreebz Limited",
  description: "Jets, off-market homes, reservations, contractors — if it touches your life or your property, ask us.",
};

export default function ConciergePage() {
  return (
    <div className="bg-obsidian">
      <ConciergeContent />
    </div>
  );
}
