import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "What We Do | Kreebz Ltd",
  description:
    "Kreebz Ltd offers marketing and sales, facility and estate management, private jet charter, concierge services, and a trusted contractor network for discerning owners and residents in Lagos.",
  openGraph: {
    title: "What We Do | Kreebz Ltd",
    description:
      "Kreebz Ltd offers marketing and sales, facility and estate management, private jet charter, concierge services, and a trusted contractor network.",
    url: "/services",
    siteName: "Kreebz Ltd",
    images: ["/opengraph-image.png"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What We Do | Kreebz Ltd",
    description:
      "Kreebz Ltd offers marketing and sales, facility and estate management, private jet charter, concierge services, and a trusted contractor network.",
    images: ["/twitter-image.png"],
  },
};

export default function ServicesPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="What We Do"
        title="Our Services"
        subtitle="Marketing, facility management, private aviation, concierge care, and trusted contractors — all held to the Kreebz standard."
      />
      <Services />
    </div>
  );
}
