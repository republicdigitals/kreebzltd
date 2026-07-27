import { Suspense } from "react";
import type { Metadata } from "next";
import { PropertyFilterProvider } from "@/components/PropertyFilterProvider";
import PropertiesClient from "@/components/PropertiesClient";
import { getProperties } from "@/data/properties";

export const metadata: Metadata = {
  title: "Properties | Kreebz Limited",
  description: "Explore our portfolio of prime residences currently under management across Lagos.",
};

export default async function PropertiesPage() {
  const properties = await getProperties();
  
  return (
    <Suspense>
      <PropertyFilterProvider initialProperties={properties}>
        <PropertiesClient />
      </PropertyFilterProvider>
    </Suspense>
  );
}
