"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Users, Settings, LogOut, Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
    { href: "/admin/properties", label: "Properties", Icon: Home },
    { href: "/admin/leads", label: "Leads", Icon: Users },
    { href: "/admin/settings", label: "Settings", Icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="md:hidden flex items-center justify-between bg-obsidian-light border-b border-border p-4 shrink-0 absolute top-0 left-0 right-0 z-20">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <span className="font-accent text-gold text-2xl font-bold tracking-wider">K.</span>
          <span className="font-sans font-medium tracking-[0.2em] text-sm text-off-white mt-1">KREEBZ</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-muted hover:text-off-white hover:bg-obsidian rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 border-r border-border bg-obsidian-light flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 border-b border-border hidden md:block">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-accent text-gold text-2xl font-bold tracking-wider">K.</span>
            <span className="font-sans font-medium tracking-[0.15em] text-xs text-off-white mt-1">ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0 overflow-y-auto">
          {links.map(({ href, label, Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname?.startsWith(href);
            return (
              <Link 
                key={href}
                href={href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-gold/5 text-gold border-r-2 border-gold font-medium rounded-r-none" 
                    : "text-muted hover:text-off-white hover:bg-obsidian"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:text-red-400 hover:bg-obsidian transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
