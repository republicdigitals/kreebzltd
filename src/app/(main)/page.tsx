import Hero from "@/components/Hero";
import BrandStatement from "@/components/BrandStatement";
import FeaturedProperties from "@/components/FeaturedProperties";
import HowItWorks from "@/components/HowItWorks";
import { getPublishedProperties } from "@/data/properties";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getPublishedProperties();
  
  return (
    <div className="bg-obsidian">
      <Hero properties={properties} />
      <BrandStatement />
      <FeaturedProperties properties={properties} />
      <HowItWorks />
    </div>
  );
}
