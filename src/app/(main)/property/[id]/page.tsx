import { notFound } from "next/navigation";
import PropertyDetail from "@/components/PropertyDetail";
import { getProperties, getProperty } from "@/data/properties";

export const dynamic = "force-dynamic";

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
