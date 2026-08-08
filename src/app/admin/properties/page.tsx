"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Property } from "@/data/properties";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminPropertiesList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          if (mounted) {
            setProperties(data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch properties", error);
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties(properties.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete property", error);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Properties</h1>
          <p className="text-muted mt-1">Manage your property portfolio</p>
        </div>
        <Link 
          href="/admin/properties/new" 
          className="bg-gold text-obsidian px-5 py-2.5 font-medium uppercase tracking-wider text-xs hover:bg-gold-hover transition-colors flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      <div className="bg-obsidian-light border border-border rounded-none flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="w-full bg-obsidian border border-border rounded-none pl-10 pr-4 py-2 text-sm text-off-white focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-muted">No properties found. Add one to get started.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-muted">
                <thead className="bg-obsidian/50 border-b border-border text-xs uppercase text-muted font-semibold">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">Property</th>
                    <th className="px-6 py-4 whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 whitespace-nowrap">Price</th>
                    <th className="px-6 py-4 whitespace-nowrap">Location</th>
                    <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-obsidian transition-colors">
                      <td className="px-6 py-4 font-medium text-off-white flex items-center gap-4 whitespace-nowrap">
                        <div className="w-12 h-12 bg-obsidian border border-border overflow-hidden relative flex-shrink-0">
                          {property.image ? (
                            <Image src={property.image} alt={property.id} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-xs">No img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold capitalize">
                            {property.id.replace(/-/g, " ")}
                          </div>
                          <div className="text-xs text-muted">{property.type} • {property.beds} Beds</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-none text-xs font-medium whitespace-nowrap ${
                          property.status === 'For Sale' ? 'bg-cyan-900/30 text-cyan-500' :
                          property.status === 'For Lease' ? 'bg-fuchsia-900/30 text-fuchsia-500' :
                          'bg-emerald-900/30 text-emerald-500'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{property.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{property.neighbourhood}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/properties/${property.id}`} className="p-2 text-muted hover:text-off-white hover:bg-obsidian rounded-none transition-colors">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(property.id)} className="p-2 text-red-500 hover:text-red-400 hover:bg-obsidian rounded-none transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-border">
              {properties.map((property) => (
                <div key={property.id} className="p-4 space-y-4 hover:bg-obsidian transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-obsidian border border-border overflow-hidden relative flex-shrink-0">
                        {property.image ? (
                          <Image src={property.image} alt={property.id} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted text-xs">No img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-off-white capitalize">
                          {property.id.replace(/-/g, " ")}
                        </div>
                        <div className="text-xs text-muted">{property.type} • {property.beds} Beds</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-none text-[10px] font-medium whitespace-nowrap ${
                      property.status === 'For Sale' ? 'bg-cyan-900/30 text-cyan-500' :
                      property.status === 'For Lease' ? 'bg-fuchsia-900/30 text-fuchsia-500' :
                      'bg-emerald-900/30 text-emerald-500'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-off-white">{property.price}</div>
                      <div className="text-xs text-muted">{property.neighbourhood}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/properties/${property.id}`} className="p-2 text-muted hover:text-off-white hover:bg-obsidian rounded-none transition-colors">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(property.id)} className="p-2 text-red-500 hover:text-red-400 hover:bg-obsidian rounded-none transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
