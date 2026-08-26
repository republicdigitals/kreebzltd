import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ConciergeContent from "@/components/ConciergeContent";

export const metadata: Metadata = {
  title: "Premium Concierge Services | Kreebz Limited",
  description: "Luxury beyond the sale. Our private concierge ecosystem provides seamless access to aviation, travel, and exclusive community experiences.",
};

export default function ConciergePage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="The Concierge Hub"
        title="Luxury Beyond the Sale"
        subtitle="Exclusive access, curated experiences, and private aviation. The Kreebz lifestyle ecosystem is designed for those who demand the extraordinary."
      />
      <ConciergeContent />
    </div>
  );
}
