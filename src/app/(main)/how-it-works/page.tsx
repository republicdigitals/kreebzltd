import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import HowItWorks from "@/components/HowItWorks";

export const metadata: Metadata = {
  title: "How We Work | Kreebz Limited",
  description: "Your brief, your standard, our presence. The Kreebz approach to representing property owners.",
};

export default function HowItWorksPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="How We Work"
        title="The Kreebz Approach"
        subtitle="We operate to your standard, not an industry average — with a dedicated principal present at your property."
      />
      <HowItWorks />
    </div>
  );
}
