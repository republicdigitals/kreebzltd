import { notFound, permanentRedirect } from "next/navigation";
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
    alternates: {
      canonical: `https://kreebzltd.com/property/${property.slug}`,
    },
    openGraph: {
      title: `${property.address} | Kreebz Ltd`,
      description: property.description.slice(0, 160) + "...",
      url: `https://kreebzltd.com/property/${property.slug}`,
      images: property.image ? [
        {
          url: property.image,
          width: 1200,
          height: 630,
          alt: property.address,
        }
      ] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.address} | Kreebz Ltd`,
      description: property.description.slice(0, 160) + "...",
      images: property.image ? [property.image] : [],
    }
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
      permanentRedirect(`/property/${legacyProperty.slug}`);
    }
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    "name": `${property.address}, ${property.neighbourhood}`,
    "description": property.description,
    "url": `https://kreebzltd.com/property/${property.slug}`,
    "image": property.image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": "LA",
      "addressCountry": "NG"
    },
    "numberOfRooms": property.beds + property.baths,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "NGN", // Assuming NGN or USD based on site context, price string has formatting
      "price": property.priceValue > 0 ? property.priceValue : undefined,
      "url": `https://kreebzltd.com/property/${property.slug}`
    }
  };

  return (
    <div className="bg-obsidian pt-24 md:pt-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PropertyDetail property={property} />
    </div>
  );
}
