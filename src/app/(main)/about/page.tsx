import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About | Kreebz Limited",
  description: "Where others manage, Kreebz represents. Our philosophy of principal-led property representation in Lagos.",
};

export default function AboutPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="About Kreebz"
        title="Where Others Manage, We Represent"
        subtitle="A principal-led practice built for owners who expect their standard held without exception."
      />
      <AboutContent />
    </div>
  );
}
