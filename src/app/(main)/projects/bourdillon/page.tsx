import type { Metadata } from "next";
import BourdillonContent from "@/components/BourdillonContent";
import { bourdillon } from "@/data/bourdillon";
import { getPropertiesByProjectSlug } from "@/data/properties";
import { getProjectContent } from "@/data/project-content";

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

export default async function BourdillonPage() {
  const [residences, content] = await Promise.all([
    getPropertiesByProjectSlug("bourdillon"),
    getProjectContent("bourdillon"),
  ]);
  return (
    <BourdillonContent
      residences={residences}
      progress={content.progress}
      siteMedia={content.siteMedia}
    />
  );
}
