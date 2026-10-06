"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

export default function PayNowButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/jets/bookings/${bookingId}/pay`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Could not start payment. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start md:items-end gap-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-gold text-ink px-6 py-3 uppercase tracking-wider text-xs font-semibold hover:bg-gold-light transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <>Starting checkout <Loader2 size={14} className="animate-spin" /></>
        ) : (
          <>Pay Now <ExternalLink size={14} /></>
        )}
      </button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
