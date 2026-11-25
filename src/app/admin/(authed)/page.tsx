import { getAdminProperties, Property } from "@/data/properties";
import { ArrowUpRight, Building2, TrendingUp, Users, Plane, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { propertyCompleteness } from "@/lib/property-completeness";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { requireAdminPage } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

function formatNaira(kobo: number | bigint) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(kobo) / 100);
}

function monthStart(offset = 0) {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + offset, 1);
}

export default async function AdminDashboard() {
  await requireAdminPage();
  const thisMonth = monthStart(0);
  const lastMonth = monthStart(-1);

  const [
    properties,
    totalLeads,
    leadsThisMonth,
    leadsLastMonth,
    paidAgg,
    pendingBookings,
    totalBookings,
    recentBookings,
    newLeads,
  ] = await Promise.all([
    getAdminProperties(),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: thisMonth } } }),
    prisma.lead.count({ where: { createdAt: { gte: lastMonth, lt: thisMonth } } }),
    prisma.jetBooking.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: "Paid" } }),
    prisma.jetBooking.count({ where: { status: "Pending" } }),
    prisma.jetBooking.count(),
    prisma.jetBooking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { email: true, name: true } }, jet: { select: { name: true } } },
    }),
    prisma.lead.findMany({
      where: { status: "New" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, interest: true, createdAt: true },
    }),
  ]);

  const activeProperties = properties.filter((p: Property) => p.publicationStatus !== "ARCHIVED");
  const totalProperties = activeProperties.length;
  const revenue = paidAgg._sum.totalAmount ?? BigInt(0);
  const leadsDelta = leadsThisMonth - leadsLastMonth;

  // Actionable alerts — each links straight to the thing that needs attention.
  const incompleteListings = activeProperties
    .map((p: Property) => ({ property: p, result: propertyCompleteness(p) }))
    .filter(({ result }: { result: { score: number; total: number } }) => result.score / result.total < 0.6)
    .map(({ property: p, result }: { property: Property; result: { score: number; total: number; missing: string[] } }) => ({
      id: p.id,
      slug: p.slug,
      address: p.address,
      score: result.score,
      total: result.total,
      missing: result.missing.slice(0, 3),
    }));

  const alerts: { href: string; tone: "warn" | "info"; title: string; detail: string }[] = [];
  if (newLeads.length > 0) {
    alerts.push({
      href: "/admin/leads",
      tone: "warn",
      title: `${newLeads.length} new lead${newLeads.length !== 1 ? "s" : ""} awaiting first response`,
      detail: `Latest: ${newLeads[0].name} — ${newLeads[0].interest.replace(/-/g, " ")}`,
    });
  }
  if (pendingBookings > 0) {
    alerts.push({
      href: "/admin/bookings",
      tone: "warn",
      title: `${pendingBookings} booking${pendingBookings !== 1 ? "s" : ""} pending confirmation`,
      detail: "Confirm or cancel so clients know where they stand.",
    });
  }
  for (const l of incompleteListings.slice(0, 3)) {
    alerts.push({
      href: `/admin/properties/${l.id}`,
      tone: "info",
      title: `${l.address} is ${l.score}/${l.total} complete`,
      detail: `Missing: ${l.missing.join(", ")}${l.missing.length >= 3 ? "…" : ""}`,
    });
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Dashboard</h1>
        <p className="text-muted mt-2">What&apos;s happening across Kreebz right now.</p>
      </div>

      {/* Stat cards — real data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-obsidian-light border border-border rounded-xl p-5 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs md:text-sm text-muted font-medium">Revenue</p>
              <h3 className="text-xl md:text-3xl font-bold text-off-white mt-2">{formatNaira(revenue)}</h3>
            </div>
            <div className="p-2.5 md:p-3 bg-gold/5 rounded-lg text-gold">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted">
            {totalBookings} jet booking{totalBookings !== 1 ? "s" : ""} total
          </div>
        </div>

        <div className="bg-obsidian-light border border-border rounded-xl p-5 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs md:text-sm text-muted font-medium">Pending</p>
              <h3 className="text-xl md:text-3xl font-bold text-off-white mt-2">{pendingBookings}</h3>
            </div>
            <div className="p-2.5 md:p-3 bg-gold/5 rounded-lg text-gold">
              <Clock className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted">
            bookings awaiting action
          </div>
        </div>

        <div className="bg-obsidian-light border border-border rounded-xl p-5 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs md:text-sm text-muted font-medium">Leads</p>
              <h3 className="text-xl md:text-3xl font-bold text-off-white mt-2">{totalLeads}</h3>
            </div>
            <div className="p-2.5 md:p-3 bg-gold/5 rounded-lg text-gold">
              <Users className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className={`mt-3 flex items-center text-xs ${leadsDelta >= 0 ? "text-gold-light" : "text-red-400"}`}>
            <ArrowUpRight className={`w-3.5 h-3.5 mr-1 ${leadsDelta < 0 ? "rotate-90" : ""}`} />
            <span>{leadsDelta >= 0 ? "+" : ""}{leadsDelta} vs last month</span>
          </div>
        </div>

        <div className="bg-obsidian-light border border-border rounded-xl p-5 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs md:text-sm text-muted font-medium">Properties</p>
              <h3 className="text-xl md:text-3xl font-bold text-off-white mt-2">{totalProperties}</h3>
            </div>
            <div className="p-2.5 md:p-3 bg-gold/5 rounded-lg text-gold">
              <Building2 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted">
            active in portfolio
          </div>
        </div>
      </div>

      {/* Needs attention */}
      {alerts.length > 0 && (
        <div className="bg-obsidian-light border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <AlertTriangle size={16} className="text-gold" />
            <h2 className="text-off-white font-medium">Needs attention</h2>
          </div>
          <div className="divide-y divide-black/5">
            {alerts.map((a, i) => (
              <Link key={i} href={a.href} className="flex items-center justify-between gap-4 p-4 md:px-5 hover:bg-obsidian/50 transition-colors group">
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${a.tone === "warn" ? "text-gold-light" : "text-off-white"}`}>
                    {a.title}
                  </p>
                  <p className="text-muted text-xs mt-0.5 truncate">{a.detail}</p>
                </div>
                <ChevronRight size={16} className="text-muted group-hover:text-gold transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="bg-obsidian-light border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-off-white font-medium flex items-center gap-2">
            <Plane size={16} className="text-gold" /> Recent bookings
          </h2>
          <Link href="/admin/bookings" className="text-xs text-gold hover:text-gold-light transition-colors uppercase tracking-wider">
            View all
          </Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="p-6 text-sm text-muted">No bookings yet.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 p-4 md:px-5">
                <div className="min-w-0">
                  <p className="text-off-white text-sm font-medium truncate">{b.route}</p>
                  <p className="text-muted text-xs mt-0.5 truncate">
                    {b.jet.name} · {b.user.name || b.user.email}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif text-gold-light text-sm">{formatNaira(b.totalAmount)}</p>
                  <p className={`text-[10px] uppercase tracking-wider mt-0.5 ${
                    b.paymentStatus === "Paid" ? "text-emerald-400" : b.paymentStatus === "Refunded" ? "text-violet-400" : "text-gold"
                  }`}>
                    {b.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
