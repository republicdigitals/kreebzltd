import Hero from "@/components/Hero";
import BrandStatement from "@/components/BrandStatement";
import FeaturedProperties from "@/components/FeaturedProperties";
import HowItWorks from "@/components/HowItWorks";
import BrandLogos from "@/components/BrandLogos";
import { getProperties } from "@/data/properties";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getProperties();
  
  return (
    <div className="bg-obsidian">
      <Hero />
      <BrandStatement />
      <FeaturedProperties properties={properties} />
      <HowItWorks />
      <BrandLogos />
    </div>
  );
}
