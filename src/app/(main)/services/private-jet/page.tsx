import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PrivateJetContent from "@/components/PrivateJetContent";

export const metadata: Metadata = {
  title: "Private Jet Charter & Rental | Kreebz Ltd",
  description:
    "Charter or rent a private jet with Kreebz Ltd. We arrange light, midsize, and heavy jet charters across Africa and beyond through our trusted aviation partners.",
  openGraph: {
    title: "Private Jet Charter & Rental | Kreebz Ltd",
    description:
      "Charter or rent a private jet with Kreebz Ltd. We arrange light, midsize, and heavy jet charters across Africa and beyond.",
    url: "/services/private-jet",
    siteName: "Kreebz Ltd",
    images: ["/opengraph-image.png"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Jet Charter & Rental | Kreebz Ltd",
    description:
      "Charter or rent a private jet with Kreebz Ltd. We arrange light, midsize, and heavy jet charters across Africa and beyond.",
    images: ["/twitter-image.png"],
  },
};

export default function PrivateJetPage() {
  return (
    <div className="bg-obsidian">
      <PageHeader
        eyebrow="Lifestyle Services"
        title="Private Jet Charter & Rental"
        subtitle="Charter light, midsize, and heavy jets for business or leisure. Kreebz arranges every detail through trusted aviation partners."
      />
      <PrivateJetContent />
    </div>
  );
}
