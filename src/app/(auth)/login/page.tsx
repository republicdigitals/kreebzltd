"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Suspense } from "react";

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

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      // Refresh the router to let Next.js re-fetch the session
      router.refresh();
      // Route directly to the user's account dashboard
      router.push("/account");
    }
  };

  return (
    <main className="min-h-screen bg-obsidian flex flex-col font-sans">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-obsidian border border-border rounded-[var(--radius-md)] p-8 shadow-card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-sans font-semibold tracking-tight text-off-white">Welcome Back</h1>
            <p className="text-muted mt-2">Sign in to save your favorite properties.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-off-white mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white placeholder:text-muted focus:outline-none focus:border-off-white transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-off-white mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian border border-border-strong rounded-[var(--radius-sm)] px-4 py-3 text-off-white placeholder:text-muted focus:outline-none focus:border-off-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-hover text-ink font-medium py-3 px-4 rounded-[var(--radius-sm)] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted border-t border-border pt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold hover:text-gold-hover transition-colors">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
