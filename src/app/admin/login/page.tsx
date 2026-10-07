"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials or rate limit exceeded");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface p-8 rounded-[var(--radius-md)] border border-border shadow-card">
        <div className="flex justify-center mb-8">
          <Image src="/kreebz-logo.png" alt="Kreebz" width={80} height={80} priority className="h-20 w-20 object-contain" />
        </div>
        <h1 className="text-2xl font-sans font-semibold tracking-tight text-off-white mb-6 text-center">Principal Access</h1>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted mb-2 block">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white focus:border-off-white outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted mb-2 block">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white focus:border-off-white outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-hover text-ink font-medium py-3 rounded-[var(--radius-sm)] transition-colors mt-4"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
