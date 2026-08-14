import Hero from "@/components/Hero";
import BrandStatement from "@/components/BrandStatement";
import FeaturedProperties from "@/components/FeaturedProperties";
import HowItWorks from "@/components/HowItWorks";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import BrandLogos from "@/components/BrandLogos";
import { getProperties } from "@/data/properties";

export const dynamic = "force-dynamic";

export default async function Home() {
  const properties = await getProperties();
  
  return (
    <div className="bg-obsidian">
      <Hero properties={properties} />
      <BrandStatement />
      <FeaturedProperties properties={properties} />
      <HowItWorks />
      <CaseStudies />
      <Testimonials />
      <FAQ />
      <BrandLogos />
    </div>
  );
}
