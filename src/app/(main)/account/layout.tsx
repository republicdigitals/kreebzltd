import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AccountNav from "@/components/AccountNav";
import PageHeader from "@/components/PageHeader";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="bg-obsidian min-h-screen">
      <PageHeader
        eyebrow="Your Private Collection"
        title="Welcome Back"
        subtitle="Manage your profile and portfolio of selected properties."
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <AccountNav />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
