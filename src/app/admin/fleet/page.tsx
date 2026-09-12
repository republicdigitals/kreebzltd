"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, RefreshCw, X, Plane } from "lucide-react";

type Jet = {
  id: string;
  tailNumber: string;
  name: string;
  class: string;
  passengers: number;
  range: string;
  baseHourlyRate: number; // kobo
  image: string | null;
  status: string;
};

const JET_CLASSES = ["Light Jet", "Midsize Jet", "Heavy Jet"] as const;

const emptyForm = {
  tailNumber: "",
  name: "",
  class: "Light Jet" as string,
  passengers: 8,
  range: "",
  hourlyRateNaira: "",
  image: "",
  status: "Active",
};

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);
}

export default function FleetPage() {
  const [jets, setJets] = useState<Jet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Jet | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchJets = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/jets", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setJets(data.jets);
      setError(null);
    } catch {
      setError("Failed to load fleet.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/jets", { credentials: "same-origin" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setJets(data.jets);
        setError(null);
      })
      .catch(() => setError("Failed to load fleet."))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (jet: Jet) => {
    setEditing(jet);
    setForm({
      tailNumber: jet.tailNumber,
      name: jet.name,
      class: jet.class,
      passengers: jet.passengers,
      range: jet.range,
      hourlyRateNaira: String(jet.baseHourlyRate / 100),
      image: jet.image ?? "",
      status: jet.status,
    });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        passengers: Number(form.passengers),
        hourlyRateNaira: Number(form.hourlyRateNaira),
        image: form.image || null,
      };
      const res = await fetch(editing ? `/api/admin/jets/${editing.id}` : "/api/admin/jets", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setShowForm(false);
      fetchJets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save aircraft.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (jet: Jet) => {
    if (!confirm(`Remove ${jet.name}? Aircraft with bookings are archived, not deleted.`)) return;
    setDeletingId(jet.id);
    try {
      const res = await fetch(`/api/admin/jets/${jet.id}`, { method: "DELETE", credentials: "same-origin" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      if (data.archived) setNotice(`${jet.name} has bookings — set to Maintenance instead of deleting.`);
      fetchJets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete aircraft.");
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls = "w-full bg-obsidian border border-border px-4 py-3 rounded-lg text-sm text-off-white focus:outline-none focus:border-gold transition-colors";
  const labelCls = "block text-xs uppercase tracking-wider text-muted mb-2";

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Fleet</h1>
          <p className="text-muted mt-1">
            {loading ? "Loading…" : `${jets.length} aircraft · ${jets.filter(j => j.status === "Active").length} active`}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => { setLoading(true); fetchJets(); }}
            disabled={loading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted hover:text-off-white border border-border hover:border-gold transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gold text-obsidian font-semibold hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Aircraft
          </button>
        </div>
      </div>

      {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}
      {notice && <div className="px-4 py-3 bg-gold/10 border border-gold/20 rounded-lg text-gold text-sm">{notice}</div>}

      {loading ? (
        <div className="p-12 text-center text-muted text-sm">Loading fleet…</div>
      ) : jets.length === 0 ? (
        <div className="p-12 text-center text-muted text-sm border border-border bg-obsidian-light">
          No aircraft yet. Add your first jet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {jets.map((jet) => (
            <div key={jet.id} className="bg-obsidian-light border border-border rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-off-white font-medium truncate">{jet.name}</p>
                  <p className="text-muted text-xs mt-1">{jet.class} · {jet.tailNumber}</p>
                </div>
                <span className={`shrink-0 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  jet.status === "Active" ? "bg-emerald-900/30 text-emerald-400" : "bg-gold/10 text-gold"
                }`}>
                  {jet.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5"><Plane size={13} /> {jet.passengers} pax</span>
                <span>{jet.range}</span>
              </div>

              <p className="font-serif text-gold-light text-xl">{formatNaira(jet.baseHourlyRate)}<span className="text-muted text-sm not-italic font-sans">/hr</span></p>

              <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
                <button
                  onClick={() => openEdit(jet)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs text-muted hover:text-off-white border border-border hover:border-gold rounded-lg transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => remove(jet)}
                  disabled={deletingId === jet.id}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 border border-border hover:border-red-500/40 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit sheet */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-6">
          <div className="w-full sm:max-w-lg bg-obsidian-light border border-border rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-obsidian-light">
              <h2 className="text-off-white font-medium">{editing ? `Edit ${editing.name}` : "Add Aircraft"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-muted hover:text-off-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={save} className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Tail Number</label>
                  <input required value={form.tailNumber} onChange={(e) => setForm({ ...form, tailNumber: e.target.value })} className={inputCls} placeholder="5N-KRZ" />
                </div>
                <div>
                  <label className={labelCls}>Class</label>
                  <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className={inputCls}>
                    {JET_CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Aircraft Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Citation XLS+" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Passengers</label>
                  <input required type="number" min={1} max={30} value={form.passengers} onChange={(e) => setForm({ ...form, passengers: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Range</label>
                  <input required value={form.range} onChange={(e) => setForm({ ...form, range: e.target.value })} className={inputCls} placeholder="3,400 km" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Hourly Rate (₦)</label>
                <input required type="number" min={1} value={form.hourlyRateNaira} onChange={(e) => setForm({ ...form, hourlyRateNaira: e.target.value })} className={inputCls} placeholder="2500000" />
              </div>
              <div>
                <label className={labelCls}>Image URL (optional)</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} placeholder="/images/jets/light.jpg" />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 text-sm text-muted border border-border rounded-lg hover:text-off-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-3 text-sm bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50">
                  {saving ? "Saving…" : editing ? "Save changes" : "Add aircraft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
