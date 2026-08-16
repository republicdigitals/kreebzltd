import { notFound, redirect } from "next/navigation";
import PropertyDetail from "@/components/PropertyDetail";
import { getPublishedPropertyById, getPublishedPropertyBySlug } from "@/data/properties";

import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  let property = await getPublishedPropertyBySlug(decodedSlug);
  if (!property) {
    property = await getPublishedPropertyById(decodedSlug);
  }

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  const property = await getPublishedPropertyBySlug(decodedSlug);

  if (!property) {
    // Try to find by legacy ID and redirect
    const legacyProperty = await getPublishedPropertyById(decodedSlug);
    if (legacyProperty) {
      redirect(`/property/${legacyProperty.slug}`);
    }
    notFound();
  }

  return (
    <div className="bg-obsidian pt-24 md:pt-28">
      <PropertyDetail property={property} />
    </div>
  );
}
