import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-obsidian text-off-white font-sans overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        body, * { cursor: auto !important; }
        a, button, [role="button"], input, select, textarea { cursor: pointer !important; }
        input[type="text"], input[type="email"], input[type="password"], textarea { cursor: text !important; }
      `}} />
      <AdminSidebar />
      
      {/* Main Content */}
      <main data-lenis-prevent className="flex-1 overflow-auto bg-obsidian relative md:static pt-[72px] md:pt-0">
        {children}
      </main>
    </div>
  );
}
