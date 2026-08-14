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
      <div className="w-full max-w-md bg-surface p-8 rounded-lg border border-white/5">
        <div className="flex justify-center mb-8">
          <Image src="/kreebz-logo.png" alt="Kreebz" width={80} height={80} />
        </div>
        <h1 className="text-2xl font-serif text-white mb-6 text-center">Principal Access</h1>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/50 mb-2 block">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-md px-4 py-3 text-white focus:border-gold outline-none" 
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-white/50 mb-2 block">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-md px-4 py-3 text-white focus:border-gold outline-none" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-obsidian font-medium uppercase tracking-widest py-3 rounded-md transition-colors mt-4"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
