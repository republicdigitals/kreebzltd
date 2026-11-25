"use client";

import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      role="group"
      aria-label="Currency"
      className="flex items-center border border-white/20 rounded-full overflow-hidden"
    >
      {(["USD", "NGN"] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={`px-2 py-1 text-[10px] font-sans tracking-wide transition-colors duration-300 ${
            currency === c
              ? "bg-gold text-background font-semibold"
              : "text-white/60 hover:text-gold"
          }`}
        >
          {c === "USD" ? "$" : "₦"}
        </button>
      ))}
    </div>
  );
}
