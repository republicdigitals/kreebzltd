"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Plane, Calendar, User as UserIcon } from "lucide-react";

type Booking = {
  id: string;
  route: string;
  passengers: number;
  startDate: string;
  endDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number; // kobo
  paymentReference: string | null;
  createdAt: string;
  user: { email: string; name: string | null };
  jet: { name: string; class: string; tailNumber: string };
};

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"] as const;
const PAYMENT_OPTIONS = ["Unpaid", "Paid", "Refunded"] as const;

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function statusClass(s: string) {
  switch (s) {
    case "Confirmed": return "bg-emerald-900/30 text-emerald-400";
    case "Completed": return "bg-emerald-900/30 text-emerald-500";
    case "Pending":   return "bg-gold/10 text-gold";
    case "Cancelled": return "bg-red-900/30 text-red-400";
    case "Paid":      return "bg-emerald-900/30 text-emerald-400";
    case "Unpaid":    return "bg-gold/10 text-gold";
    case "Refunded":  return "bg-violet-900/30 text-violet-400";
    default:          return "bg-obsidian-light text-muted";
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bookings", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setBookings(data.bookings);
      setError(null);
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/bookings", { credentials: "same-origin" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setBookings(data.bookings);
        setError(null);
      })
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, []);

  const patch = async (id: string, body: { status?: string; paymentStatus?: string }) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    } catch {
      setError("Failed to update booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    const q = search.toLowerCase();
    return (
      b.route.toLowerCase().includes(q) ||
      b.user.email.toLowerCase().includes(q) ||
      (b.user.name ?? "").toLowerCase().includes(q) ||
      b.jet.name.toLowerCase().includes(q) ||
      (b.paymentReference ?? "").toLowerCase().includes(q)
    );
  });

  const paidTotal = bookings.filter(b => b.paymentStatus === "Paid").reduce((s, b) => s + b.totalAmount, 0);
  const pendingCount = bookings.filter(b => b.status === "Pending").length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Bookings</h1>
          <p className="text-muted mt-1">
            {loading ? "Loading…" : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} · ${formatNaira(paidTotal)} collected`}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchBookings(); }}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted hover:text-off-white border border-border hover:border-gold transition-colors disabled:opacity-40 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
              filter === s
                ? "bg-gold text-ink border-gold"
                : "border-border text-muted hover:text-off-white"
            }`}
          >
            {s === "all" ? `All (${bookings.length})` : `${s}${s === "Pending" && pendingCount ? ` (${pendingCount})` : ""}`}
          </button>
        ))}
      </div>

      <div className="bg-obsidian-light border border-border overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search route, client, jet, reference…"
              className="w-full bg-obsidian border border-border pl-10 pr-4 py-2 text-sm text-off-white focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted text-sm">Loading bookings…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            {bookings.length === 0 ? "No bookings yet." : "No bookings match your filters."}
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden divide-y divide-black/5">
              {filtered.map((b) => (
                <div key={b.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-off-white font-medium truncate">{b.jet.name}</p>
                      <p className="text-muted text-xs mt-0.5">{b.jet.class} · {b.jet.tailNumber}</p>
                    </div>
                    <p className="font-serif text-gold-light text-lg shrink-0">{formatNaira(b.totalAmount)}</p>
                  </div>
                  <p className="text-off-white/80 text-sm">{b.route}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1"><UserIcon size={12} />{b.user.name || b.user.email}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} />{fmtDate(b.startDate)}</span>
                    <span className="flex items-center gap-1"><Plane size={12} />{b.passengers} pax</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <select
                      value={b.status}
                      disabled={updatingId === b.id}
                      onChange={(e) => patch(b.id, { status: e.target.value })}
                      className={`text-xs px-3 py-2 rounded-lg border-0 ${statusClass(b.status)} bg-obsidian disabled:opacity-50`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                      value={b.paymentStatus}
                      disabled={updatingId === b.id}
                      onChange={(e) => patch(b.id, { paymentStatus: e.target.value })}
                      className={`text-xs px-3 py-2 rounded-lg border-0 ${statusClass(b.paymentStatus)} bg-obsidian disabled:opacity-50`}
                    >
                      {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Aircraft</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Route</th>
                    <th className="px-4 py-3 font-medium">Departure</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-black/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-off-white font-medium">{b.jet.name}</p>
                        <p className="text-muted text-xs">{b.jet.class}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-off-white">{b.user.name || "—"}</p>
                        <p className="text-muted text-xs">{b.user.email}</p>
                      </td>
                      <td className="px-4 py-3 text-off-white/80">{b.route}</td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">{fmtDate(b.startDate)}</td>
                      <td className="px-4 py-3 font-serif text-gold-light whitespace-nowrap">{formatNaira(b.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          disabled={updatingId === b.id}
                          onChange={(e) => patch(b.id, { status: e.target.value })}
                          className={`text-xs px-2 py-1.5 rounded-md border-0 ${statusClass(b.status)} bg-obsidian disabled:opacity-50`}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={b.paymentStatus}
                          disabled={updatingId === b.id}
                          onChange={(e) => patch(b.id, { paymentStatus: e.target.value })}
                          className={`text-xs px-2 py-1.5 rounded-md border-0 ${statusClass(b.paymentStatus)} bg-obsidian disabled:opacity-50`}
                        >
                          {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
