import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import FeaturedProperties from "@/components/FeaturedProperties";
import FeaturedDevelopments from "@/components/FeaturedDevelopments";
import ServiceCards from "@/components/ServiceCards";
import FAQ from "@/components/FAQ";
import { getPublishedProperties } from "@/data/properties";
import { getAllProjects } from "@/data/projects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getPublishedProperties();
  const projects = getAllProjects();

  return (
    <div className="bg-obsidian">
      <Hero />
      <Manifesto />
      <FeaturedProperties properties={properties} />
      <FeaturedDevelopments projects={projects} />
      <ServiceCards />
      <FAQ />
    </div>
  );
}
