import { getProperties } from "@/data/properties";
import { ArrowUpRight, Building2, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const properties = await getProperties();
  const totalProperties = properties.length;
  const totalValue = properties.reduce((acc, curr) => acc + curr.priceValue, 0);
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalValue);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-neutral-400 mt-2">Welcome back to the Kreebz Admin Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-400 font-medium">Total Properties</p>
              <h3 className="text-3xl font-bold text-white mt-2">{totalProperties}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-400">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+2 this month</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-400 font-medium">Portfolio Value</p>
              <h3 className="text-3xl font-bold text-white mt-2">{formattedValue}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-400">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12.5% this quarter</span>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-neutral-400 font-medium">Active Leads</p>
              <h3 className="text-3xl font-bold text-white mt-2">24</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-neutral-400">
            <span>Requires attention (3)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
