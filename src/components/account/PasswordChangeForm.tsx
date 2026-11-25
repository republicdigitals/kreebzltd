"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { KeyRound, Loader2, Eye, EyeOff } from "lucide-react";

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) {
      setError("New passwords do not match");
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not change password");
        setStatus("idle");
        return;
      }
      setStatus("done");
      // tokenVersion bump invalidates this session — sign out cleanly
      setTimeout(() => signOut({ callbackUrl: "/login" }), 1800);
    } catch {
      setError("Network error — please try again");
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <div className="bg-surface/50 border border-gold/30 rounded-2xl p-8 text-center">
        <KeyRound size={20} className="text-gold mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-off-white font-sans">Password updated.</p>
        <p className="text-muted text-sm mt-1 font-sans">Signing you out — log back in with your new password.</p>
      </div>
    );
  }

  const inputCls =
    "w-full bg-transparent border border-border/40 rounded-lg px-4 py-3 text-off-white font-sans text-sm focus:outline-none focus:border-gold/60 transition-colors placeholder:text-muted/50";

  return (
    <form onSubmit={submit} className="bg-surface/50 border border-border/20 rounded-2xl p-8 sm:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-off-white font-serif text-xl mb-1">Change Password</h3>
          <p className="text-muted text-sm font-sans">
            You&apos;ll be signed out everywhere once it&apos;s changed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-muted hover:text-gold transition-colors"
          aria-label={show ? "Hide passwords" : "Show passwords"}
        >
          {show ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type={show ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          required
          autoComplete="current-password"
          className={inputCls}
        />
        <input
          type={show ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (12+ characters)"
          required
          minLength={12}
          autoComplete="new-password"
          className={inputCls}
        />
        <input
          type={show ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat new password"
          required
          minLength={12}
          autoComplete="new-password"
          className={inputCls}
        />
      </div>

      {error && <p className="text-red-400 text-sm font-sans">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-background text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-gold-light transition-colors disabled:opacity-60"
        >
          {status === "saving" && <Loader2 size={14} className="animate-spin" />}
          {status === "saving" ? "Updating…" : "Update Password"}
        </button>
      </div>
    </form>
  );
}
