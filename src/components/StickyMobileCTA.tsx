"use client";

import Link from "next/link";
import { Home, Search, Plane, Sparkles, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Browse", href: "/properties", icon: Search },
  { label: "Jet", href: "/services/private-jet", icon: Plane },
  { label: "Concierge", event: "kreebz:open-concierge", icon: Sparkles },
  { label: "Enquire", href: "/contact", icon: MessageCircle },
] as const;

/**
 * App-style bottom tab bar (mobile only). Always visible — the site
 * should feel like a native app, not a page you have to scroll to act on.
 */
export default function StickyMobileCTA() {
  const pathname = usePathname();

  const isActive = (href?: string) => {
    if (!href || !pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Admin routes and property detail have their own fixed bars — don't stack.
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/property/")) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian/95 backdrop-blur-md border-t border-border"
    >
      <div className="grid grid-cols-5 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        {tabs.map((tab) => {
          const active = isActive("href" in tab ? tab.href : undefined);
          const cls = `flex flex-col items-center justify-center gap-1.5 pt-4 pb-2 transition-colors ${
            active ? "text-gold" : "text-off-white/60 active:text-gold"
          }`;

          if ("event" in tab) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => {
                  trackEvent("open_concierge", { location: "tab_bar" });
                  window.dispatchEvent(new CustomEvent(tab.event));
                }}
                className={cls}
              >
                <tab.icon size={20} strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-[0.12em] font-medium">{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              href={tab.href}
              onClick={() =>
                trackEvent("click_tab", { location: "tab_bar", target: tab.href })
              }
              className={cls}
            >
              <tab.icon size={20} strokeWidth={1.5} />
              <span className="text-[9px] uppercase tracking-[0.12em] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
