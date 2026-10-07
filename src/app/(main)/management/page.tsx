import type { Metadata } from "next";
import ManagementContent from "@/components/ManagementContent";

export const metadata: Metadata = {
  title: "Property Management | Kreebz Limited",
  description: "Repairs, staff, compliance, tenants — a named principal handles it all, and you get one number to call.",
};

export default function ManagementPage() {
  return (
    <div className="bg-obsidian">
      <ManagementContent />
    </div>
  );
}
