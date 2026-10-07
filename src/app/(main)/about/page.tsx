import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AboutContent from "@/components/AboutContent";
import Principals from "@/components/Principals";

export const metadata: Metadata = {
  title: "About | Kreebz Limited",
  description: "One principal. Your standard. No exceptions. The Kreebz approach to property in Lagos.",
};

export default function AboutPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="About Kreebz"
        title="The team behind the standard"
        subtitle="We started Kreebz because owning property in Lagos was harder than it should be. So we built the team we wanted to call."
      />
      <AboutContent />
      <Principals />
    </div>
  );
}
