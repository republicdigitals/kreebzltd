import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyDetail from "@/components/PropertyDetail";
import { properties, getProperty } from "@/data/properties";

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-obsidian">
      <Navigation />
      <main className="flex-1">
        <PropertyDetail property={property} />
      </main>
      <Footer />
    </div>
  );
}
