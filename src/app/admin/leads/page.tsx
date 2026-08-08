"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Mail, Phone, Calendar, User, Trash2, RefreshCw } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string;
  message: string | null;
  propertyId: string | null;
  status: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Lost"] as const;

function statusClass(status: string) {
  switch (status) {
    case "New":         return "bg-cyan-900/30 text-cyan-500";
    case "Contacted":   return "bg-gold/10 text-gold";
    case "Qualified":   return "bg-emerald-900/30 text-emerald-500";
    case "Lost":        return "bg-red-900/30 text-red-500";
    default:            return "bg-obsidian-light text-muted";
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      setError(`Failed to load leads. ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      );
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Permanently delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error();
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("Failed to delete lead.");
    }
  };

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.interest.toLowerCase().includes(q) ||
      (l.phone ?? "").includes(q)
    );
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Leads</h1>
          <p className="text-muted mt-1">
            {loading ? "Loading…" : `${leads.length} total lead${leads.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted hover:text-off-white border border-border hover:border-gold rounded-none transition-colors disabled:opacity-40 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-obsidian-light border border-border rounded-none overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads…"
              className="w-full bg-obsidian border border-border rounded-none pl-10 pr-4 py-2 text-sm text-off-white focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          {search && (
            <p className="text-xs text-muted shrink-0">
              {filtered.length} of {leads.length} shown
            </p>
          )}
        </div>

        <div className="w-full">
          {loading ? (
            <div className="py-24 text-center text-neutral-500 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 opacity-40" />
              Loading leads…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center text-neutral-500 text-sm">
              {search ? "No leads match your search." : "No leads yet. Submissions from the contact form and concierge will appear here."}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-muted">
                  <thead className="bg-obsidian/50 border-b border-border text-xs uppercase text-muted font-semibold">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">Lead</th>
                      <th className="px-6 py-4 whitespace-nowrap">Contact</th>
                      <th className="px-6 py-4 whitespace-nowrap">Interest</th>
                      <th className="px-6 py-4 whitespace-nowrap">Message</th>
                      <th className="px-6 py-4 whitespace-nowrap">Date</th>
                      <th className="px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map((lead) => (
                      <tr key={lead.id} className="hover:bg-obsidian transition-colors">
                        <td className="px-6 py-4 font-medium text-off-white whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold">{lead.name}</div>
                                <div className="text-[10px] text-muted font-mono">{lead.id.slice(0, 8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1 text-xs">
                              <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-off-white transition-colors">
                                <Mail className="w-3 h-3 text-muted shrink-0" />
                                {lead.email}
                              </a>
                              {lead.phone && (
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-off-white transition-colors">
                                  <Phone className="w-3 h-3 text-muted shrink-0" />
                                  {lead.phone}
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="capitalize text-off-white font-medium">
                              {lead.interest.replace(/-/g, " ")}
                            </span>
                            {lead.propertyId && (
                              <div className="text-[10px] text-muted mt-0.5">
                                Property: {lead.propertyId}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 max-w-[220px]">
                            {lead.message ? (
                              <p className="text-xs text-muted truncate" title={lead.message}>
                                {lead.message}
                              </p>
                            ) : (
                              <span className="text-muted text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="w-3 h-3 text-muted" />
                              {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={lead.status}
                              disabled={updatingId === lead.id}
                              onChange={(e) => updateStatus(lead.id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-none font-medium border-0 focus:outline-none cursor-pointer disabled:opacity-50 ${statusClass(lead.status)}`}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s} className="bg-obsidian-light text-off-white">
                                  {s}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="p-2 text-muted hover:text-red-400 hover:bg-obsidian rounded-none transition-colors"
                              title="Delete lead"
                              aria-label={`Delete lead from ${lead.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="block md:hidden divide-y divide-border">
                  {filtered.map((lead) => (
                    <div key={lead.id} className="p-4 space-y-4 hover:bg-obsidian transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-obsidian-light border border-border flex items-center justify-center text-muted shrink-0">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-off-white">{lead.name}</div>
                            <div className="text-[10px] text-muted font-mono">{lead.id.slice(0, 8)}</div>
                        </div>
                      </div>
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`text-[10px] px-2 py-1 rounded-none font-medium border-0 focus:outline-none cursor-pointer disabled:opacity-50 ${statusClass(lead.status)}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-obsidian-light text-off-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-muted hover:text-off-white transition-colors">
                        <Mail className="w-3 h-3 shrink-0" />
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-muted hover:text-off-white transition-colors">
                          <Phone className="w-3 h-3 shrink-0" />
                          {lead.phone}
                        </a>
                      )}
                    </div>

                    <div className="text-sm">
                      <span className="text-muted">Interest: </span>
                      <span className="capitalize text-off-white font-medium">
                        {lead.interest.replace(/-/g, " ")}
                      </span>
                      {lead.propertyId && (
                        <div className="text-xs text-muted mt-0.5">
                          {lead.propertyId}
                        </div>
                      )}
                    </div>

                    {lead.message && (
                      <div className="text-xs text-muted bg-obsidian p-3 rounded-none border border-border">
                        {lead.message}
                      </div>
                    )}

                    <div className="flex justify-between items-end pt-2 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Calendar className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="p-2 text-muted hover:text-red-400 hover:bg-obsidian rounded-none transition-colors"
                        title="Delete lead"
                        aria-label={`Delete lead from ${lead.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
