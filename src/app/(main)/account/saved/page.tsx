import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SavedClient from "./SavedClient";
import { getSavedPropertiesForUser } from "@/data/properties";

export const metadata = {
  title: "Saved Properties | Kreebz",
};

export default async function SavedPropertiesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const properties = await getSavedPropertiesForUser(session.user.id);

  return <SavedClient initialProperties={properties} />;
}
