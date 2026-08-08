import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-obsidian text-off-white font-sans overflow-hidden">
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-obsidian relative md:static pt-[72px] md:pt-0">
        {children}
      </main>
    </div>
  );
}
