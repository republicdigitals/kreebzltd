"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Shield, Calendar, Plus, Pencil, Trash2, X, KeyRound } from "lucide-react";

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

const emptyForm = { email: "", name: "", password: "", role: "USER" };

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [resetting, setResetting] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditing(null);
    setResetting(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setResetting(null);
    setForm({ email: u.email, name: u.name ?? "", password: "", role: u.role });
    setFormError(null);
    setShowForm(true);
  };

  const openReset = (u: AdminUser) => {
    setResetting(u);
    setEditing(null);
    setForm({ email: u.email, name: u.name ?? "", password: "", role: u.role });
    setFormError(null);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      let res: Response;
      if (resetting) {
        if (form.password.length < 12) throw new Error("Password must be at least 12 characters.");
        res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: resetting.id, password: form.password }),
        });
      } else if (editing) {
        res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, name: form.name || null, role: form.role }),
        });
      } else {
        if (form.password.length < 12) throw new Error("Password must be at least 12 characters.");
        res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, name: form.name || undefined, password: form.password, role: form.role }),
        });
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Save failed");
      }
      setNotice(resetting ? `Password reset for ${resetting.email} — their existing sessions were signed out.` : editing ? "User updated." : "User created.");
      setShowForm(false);
      await fetchUsers();
      setTimeout(() => setNotice(null), 5000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (u: AdminUser) => {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    setDeletingId(u.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: u.id }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Delete failed");
      }
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
      setNotice(`Deleted ${u.email}.`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const inputCls = "w-full bg-obsidian border border-border rounded-lg px-4 py-2.5 text-sm text-off-white focus:outline-none focus:border-gold transition-colors";
  const labelCls = "block text-xs uppercase tracking-wider text-muted mb-1.5";

  const actionButtons = (u: AdminUser) => (
    <div className="flex items-center gap-1.5">
      <button onClick={() => openEdit(u)} title="Edit role & name" className="p-2 text-muted hover:text-off-white hover:bg-obsidian rounded-lg transition-colors">
        <Pencil className="w-4 h-4" />
      </button>
      <button onClick={() => openReset(u)} title="Reset password" className="p-2 text-muted hover:text-gold hover:bg-obsidian rounded-lg transition-colors">
        <KeyRound className="w-4 h-4" />
      </button>
      <button onClick={() => remove(u)} disabled={deletingId === u.id} title="Delete user" className="p-2 text-red-500 hover:text-red-400 hover:bg-obsidian rounded-lg transition-colors disabled:opacity-40">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-accent text-3xl font-medium text-off-white tracking-tight">Users</h1>
          <p className="text-muted mt-1">
            {loading ? "Loading…" : `${users.length} registered account${users.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => { setLoading(true); fetchUsers(); }}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted hover:text-off-white border border-border hover:border-gold transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gold text-ink font-medium hover:bg-gold-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add user
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
      )}
      {notice && (
        <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">{notice}</div>
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
            <div className="md:hidden divide-y divide-black/5">
              {filtered.map((u) => (
                <div key={u.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-off-white font-medium truncate">{u.name || u.email}</p>
                      {u.name && <p className="text-muted text-xs truncate">{u.email}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {u.role === "ADMIN" && (
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/10 text-gold">
                          <Shield size={11} /> Admin
                        </span>
                      )}
                      {actionButtons(u)}
                    </div>
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
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-black/[0.03] transition-colors">
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
                      <td className="px-4 py-3 text-right">{actionButtons(u)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Create / Edit / Reset sheet */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-6">
          <div className="w-full sm:max-w-md bg-obsidian-light border border-border rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-off-white font-medium">
                {resetting ? `Reset password — ${resetting.email}` : editing ? `Edit ${editing.email}` : "Add user"}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-muted hover:text-off-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={save} className="p-5 space-y-5">
              {!editing && !resetting && (
                <div>
                  <label className={labelCls}>Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} placeholder="person@example.com" />
                </div>
              )}
              {!resetting && (
                <div>
                  <label className={labelCls}>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Full name" />
                </div>
              )}
              {!resetting && (
                <div>
                  <label className={labelCls}>Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
                    <option value="USER">User — account portal only</option>
                    <option value="ADMIN">Admin — full portal access</option>
                  </select>
                </div>
              )}
              {(!editing || resetting) && (
                <div>
                  <label className={labelCls}>{resetting ? "New password" : "Password"}</label>
                  <input required type="text" minLength={12} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} placeholder="At least 12 characters" />
                  <p className="text-xs text-muted mt-1.5">
                    {resetting
                      ? "Resetting signs the user out of every device immediately."
                      : "Shown in plain text so you can copy it exactly — share it securely with the user."}
                  </p>
                </div>
              )}
              {formError && <p className="text-sm text-red-400">{formError}</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gold text-ink py-3 font-medium text-sm uppercase tracking-wider hover:bg-gold-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <RefreshCw size={15} className="animate-spin" />}
                {resetting ? "Reset password" : editing ? "Save changes" : "Create user"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
