import type { Metadata } from "next";
import BourdillonContent from "@/components/BourdillonContent";
import { bourdillon } from "@/data/bourdillon";

export const metadata: Metadata = {
  title: "Bourdillon, Ikoyi — Current Project | Kreebz Ltd",
  description:
    "Bourdillon is a private residential development on Bourdillon Road, Ikoyi, currently at foundation stage. Request the approved brochure or arrange a private consultation with the Kreebz team.",
  openGraph: {
    title: "Bourdillon, Ikoyi — Current Project | Kreebz Ltd",
    description:
      "A private residential development on Bourdillon Road, Ikoyi — currently at foundation stage. Request the approved project information.",
    url: "/projects/bourdillon",
    images: [bourdillon.heroImage],
  },
  alternates: {
    canonical: "/projects/bourdillon",
  },
};

export default function BourdillonPage() {
  return <BourdillonContent />;
}
