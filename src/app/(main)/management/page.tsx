import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ManagementContent from "@/components/ManagementContent";

export const metadata: Metadata = {
  title: "Premium Facility Management | Kreebz Limited",
  description: "Living Perfected. We handle the operational complexity of your luxury real estate so you can focus on what matters most.",
};

export default function ManagementPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="Facility Management"
        title="Living Perfected"
        subtitle="Your time is precious. We handle the operational complexity of luxury ownership, ensuring your investment appreciates and your privacy remains sacred."
      />
      <ManagementContent />
    </div>
  );
}
