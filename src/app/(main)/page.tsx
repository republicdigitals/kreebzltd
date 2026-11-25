import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import FeaturedProperties from "@/components/FeaturedProperties";
import FeaturedProject from "@/components/FeaturedProject";
import ServiceCards from "@/components/ServiceCards";
import FAQ from "@/components/FAQ";
import { getPublishedProperties } from "@/data/properties";
import { getProjectContent } from "@/data/project-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [properties, bourdillonContent] = await Promise.all([
    getPublishedProperties(),
    getProjectContent("bourdillon"),
  ]);

  return (
    <div className="bg-obsidian">
      <Hero />
      <Manifesto />
      <FeaturedProperties properties={properties} />
      <FeaturedProject latestProgress={bourdillonContent.progress[0]} />
      <ServiceCards />
      <FAQ />
    </div>
  );
}
