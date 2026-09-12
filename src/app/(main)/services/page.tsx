import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Services | Kreebz Ltd",
  description:
    "Property sales and leasing, facility management, private jet charter, and concierge — one team in Lagos.",
  openGraph: {
    title: "Services | Kreebz Ltd",
    description:
      "Property sales and leasing, facility management, private jet charter, and concierge — one team in Lagos.",
    url: "/services",
    siteName: "Kreebz Ltd",
    images: ["/opengraph-image.png"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Kreebz Ltd",
    description:
      "Property sales and leasing, facility management, private jet charter, and concierge — one team in Lagos.",
    images: ["/twitter-image.png"],
  },
};

export default function ServicesPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="What We Do"
        title="Everything handled, end to end"
        subtitle="Buying, selling, managing, or flying in — you deal with one team that knows your name, not a rotating cast of agents."
      />
      <Services />
    </div>
  );
}
