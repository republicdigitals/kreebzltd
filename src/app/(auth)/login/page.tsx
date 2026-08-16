"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";

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
      // Role-based redirection is usually handled by middleware, but we can do a fallback
      router.push("/properties");
    }
  };

  return (
    <main className="min-h-screen bg-obsidian flex flex-col font-sans">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-white font-light">Welcome Back</h1>
            <p className="text-neutral-400 mt-2">Sign in to save your favorite properties.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold/90 text-obsidian font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-neutral-400 border-t border-white/10 pt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-gold hover:text-white transition-colors">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
