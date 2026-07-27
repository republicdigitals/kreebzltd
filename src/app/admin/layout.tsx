import Link from "next/link";
import { LayoutDashboard, Home, Users, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <span className="text-black font-bold text-xl">K</span>
            </div>
            <span className="font-bold text-lg tracking-wide">KREEBZ ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            <Home className="w-5 h-5" />
            <span>Properties</span>
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            <Users className="w-5 h-5" />
            <span>Leads</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-neutral-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-neutral-950">
        {children}
      </main>
    </div>
  );
}
