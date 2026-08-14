import { notFound } from "next/navigation";
import PropertyDetail from "@/components/PropertyDetail";
import { getProperties, getProperty } from "@/data/properties";

import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Property Not Found | Kreebz Ltd",
    };
  }

  return {
    title: `${property.address}, ${property.neighbourhood} | Kreebz Ltd`,
    description: property.description.slice(0, 160) + "...",
    openGraph: {
      title: `${property.address} | Kreebz Ltd`,
      description: property.description.slice(0, 160) + "...",
      images: property.image ? [property.image] : [],
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-obsidian pt-24 md:pt-28">
      <PropertyDetail property={property} />
    </div>
  );
}
