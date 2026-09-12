import Hero from "@/components/Hero";
import BrandStatement from "@/components/BrandStatement";
import AviationSection from "@/components/AviationSection";
import BrandLogos from "@/components/BrandLogos";
import FeaturedProject from "@/components/FeaturedProject";
import FeaturedProperties from "@/components/FeaturedProperties";
import HowItWorks from "@/components/HowItWorks";
import { getPublishedProperties } from "@/data/properties";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getPublishedProperties();

  return (
    <div className="bg-obsidian">
      <Hero />
      <BrandStatement />
      <AviationSection />
      <FeaturedProject />
      <FeaturedProperties properties={properties} />
      <BrandLogos />
      <HowItWorks />
    </div>
  );
}
