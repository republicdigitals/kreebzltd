import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SavedClient from "./SavedClient";
import { getSavedPropertiesForUser } from "@/data/properties";

export const metadata = {
  title: "Saved Properties | Kreebz",
};

export default async function SavedPropertiesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null; // Layout will redirect
  }

  const properties = await getSavedPropertiesForUser(session.user.id);

  return <SavedClient initialProperties={properties} />;
}
