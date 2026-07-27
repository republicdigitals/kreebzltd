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
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Properties</h1>
          <p className="text-neutral-400 mt-1">Manage your property portfolio</p>
        </div>
        <Link 
          href="/admin/properties/new" 
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-neutral-400">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-neutral-400">No properties found. Add one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-neutral-950/50 border-b border-neutral-800 text-xs uppercase text-neutral-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden relative flex-shrink-0">
                        {property.image ? (
                          <Image src={property.image} alt={property.id} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">No img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{property.id}</div>
                        <div className="text-xs text-neutral-500">{property.type} • {property.beds} Beds</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'For Sale' ? 'bg-blue-500/10 text-blue-400' :
                        property.status === 'For Lease' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{property.price}</td>
                    <td className="px-6 py-4">{property.neighbourhood}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/properties/${property.id}`} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(property.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
