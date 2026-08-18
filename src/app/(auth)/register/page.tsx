"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Suspense } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      // Automatically sign in after registering
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Account created, but failed to automatically sign in. Please log in manually.");
        setLoading(false);
      } else {
        router.refresh();
        router.push("/account");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-obsidian flex flex-col font-sans">
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white font-light">Create Account</h1>
            <p className="text-neutral-400 mt-2">Save properties and access premium features.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 text-obsidian font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-neutral-400 border-t border-white/10 pt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:text-white transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
