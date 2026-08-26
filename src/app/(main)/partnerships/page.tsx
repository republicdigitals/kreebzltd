import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PartnershipsContent from "@/components/PartnershipsContent";

export const metadata: Metadata = {
  title: "Developer Partnerships | Kreebz Limited",
  description: "Your competitive advantage in luxury real estate. Partner with Kreebz for integrated marketing, faster sales absorption, and complete ecosystem management.",
};

export default function PartnershipsPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="Developer Partnerships"
        title="Your Competitive Advantage in Luxury Real Estate"
        subtitle="We transform property developments into complete lifestyle brands. Faster sales absorption, premium positioning, and guaranteed UHNWI network activation."
      />
      <PartnershipsContent />
    </div>
  );
}
