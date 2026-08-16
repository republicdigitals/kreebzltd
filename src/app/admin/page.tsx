import { getAdminProperties, Property } from "@/data/properties";
import { ArrowUpRight, Building2, TrendingUp, Users } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [properties, totalLeads] = await Promise.all([
    getAdminProperties(),
    prisma.lead.count(),
  ]);
  const activeProperties = properties.filter((p: Property) => p.publicationStatus !== 'ARCHIVED');
  const totalProperties = activeProperties.length;
  const totalValue = activeProperties.reduce((acc: number, curr: Property) => acc + curr.priceValue, 0);
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalValue);


  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Dashboard Overview</h1>
        <p className="text-muted mt-2">Welcome back to the Kreebz Admin Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-obsidian-light border border-border rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted font-medium">Total Properties</p>
              <h3 className="text-3xl font-bold text-off-white mt-2">{totalProperties}</h3>
            </div>
            <div className="p-3 bg-gold/5 rounded-lg text-gold">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gold-light">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+2 this month</span>
          </div>
        </div>

        <div className="bg-obsidian-light border border-border rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted font-medium">Portfolio Value</p>
              <h3 className="text-3xl font-bold text-off-white mt-2">{formattedValue}</h3>
            </div>
            <div className="p-3 bg-gold/5 rounded-lg text-gold">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gold-light">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12.5% this quarter</span>
          </div>
        </div>

        <div className="bg-obsidian-light border border-border rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted font-medium">Active Leads</p>
              <h3 className="text-3xl font-bold text-off-white mt-2">{totalLeads}</h3>
            </div>
            <div className="p-3 bg-gold/5 rounded-lg text-gold">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-muted">
            <span>{totalLeads === 0 ? "No leads yet" : `${totalLeads} total inquir${totalLeads !== 1 ? "ies" : "y"}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
