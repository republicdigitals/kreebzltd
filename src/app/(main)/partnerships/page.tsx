import type { Metadata } from "next";
import PartnershipsContent from "@/components/PartnershipsContent";

export const metadata: Metadata = {
  title: "Developer Partnerships | Kreebz Limited",
  description: "We market, sell, and manage your development — so units move faster and residents stay happy long after handover.",
};

export default function PartnershipsPage() {
  return (
    <div className="bg-obsidian">
      <PartnershipsContent />
    </div>
  );
}
