import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side guard. This intentionally lives in the Node.js render layer
  // rather than the edge proxy: redirect responses must never be cached
  // independently of the session cookie, and edge-layer redirects were being
  // served to authenticated users, bouncing them back to /admin/login.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-obsidian text-off-white font-sans overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        body, * { cursor: auto !important; }
        a, button, [role="button"], input, select, textarea { cursor: pointer !important; }
        input[type="text"], input[type="email"], input[type="password"], textarea { cursor: text !important; }
      `}} />
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-obsidian relative md:static pt-[72px] md:pt-0">
        {children}
      </main>
    </div>
  );
}
