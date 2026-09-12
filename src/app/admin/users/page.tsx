"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Shield, Calendar } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  _count: { jetBookings: number; savedProperties: number };
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "same-origin" });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setUsers(data.users);
      setError(null);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "same-origin" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUsers(data.users);
        setError(null);
      })
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Users</h1>
          <p className="text-muted mt-1">
            {loading ? "Loading…" : `${users.length} registered account${users.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchUsers(); }}
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

      <div className="bg-obsidian-light border border-border overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name…"
              className="w-full bg-obsidian border border-border pl-10 pr-4 py-2 text-sm text-off-white focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            {users.length === 0 ? "No registered users yet." : "No users match your search."}
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="md:hidden divide-y divide-white/5">
              {filtered.map((u) => (
                <div key={u.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-off-white font-medium truncate">{u.name || u.email}</p>
                      {u.name && <p className="text-muted text-xs truncate">{u.email}</p>}
                    </div>
                    {u.role === "ADMIN" && (
                      <span className="shrink-0 flex items-center gap-1 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/10 text-gold">
                        <Shield size={11} /> Admin
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1"><Calendar size={12} />Joined {fmtDate(u.createdAt)}</span>
                    <span>{u._count.jetBookings} booking{u._count.jetBookings !== 1 ? "s" : ""}</span>
                    <span>{u._count.savedProperties} saved</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium">Bookings</th>
                    <th className="px-4 py-3 font-medium">Saved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-off-white">{u.name || "—"}</p>
                        <p className="text-muted text-xs">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        {u.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/10 text-gold">
                            <Shield size={11} /> Admin
                          </span>
                        ) : (
                          <span className="text-muted text-xs uppercase tracking-wider">User</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                      <td className="px-4 py-3 text-off-white/80">{u._count.jetBookings}</td>
                      <td className="px-4 py-3 text-off-white/80">{u._count.savedProperties}</td>
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
