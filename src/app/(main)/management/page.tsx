import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ManagementContent from "@/components/ManagementContent";

export const metadata: Metadata = {
  title: "Property Management | Kreebz Limited",
  description: "Repairs, staff, compliance, tenants — a named principal handles it all, and you get one number to call.",
};

export default function ManagementPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="Property Management"
        title="Own property in Lagos — live anywhere."
        subtitle="Repairs, staff, compliance, tenants — a named principal handles it all, reports on schedule, and you get one number to call."
      />
      <ManagementContent />
    </div>
  );
}
