"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, Heart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  {
    name: "Profile",
    href: "/account",
    icon: User,
  },
  {
    name: "Saved Portfolio",
    href: "/account/saved",
    icon: Heart,
  },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-md transition-all duration-300 group",
              isActive 
                ? "bg-gold/10 text-gold border border-gold/20" 
                : "text-muted hover:text-off-white hover:bg-white/5 border border-transparent"
            )}
          >
            <Icon 
              size={18} 
              strokeWidth={isActive ? 2 : 1.5} 
              className={cn(isActive ? "text-gold" : "text-muted group-hover:text-off-white")}
            />
            <span className="font-sans text-sm tracking-wide uppercase">{link.name}</span>
          </Link>
        );
      })}

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-4 px-6 py-4 rounded-md transition-all duration-300 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 border border-transparent group mt-8 w-full text-left"
      >
        <LogOut size={18} strokeWidth={1.5} className="group-hover:text-red-400" />
        <span className="font-sans text-sm tracking-wide uppercase">Sign Out</span>
      </button>
    </nav>
  );
}
