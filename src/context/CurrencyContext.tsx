"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { formatConvertedPrice, type Currency } from "@/lib/currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Converted display price when a numeric USD value exists; otherwise the original string. */
  displayPrice: (priceValue: number | null | undefined, fallback: string) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
  displayPrice: (_v, fallback) => fallback,
});

const KEY = "kreebz-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === "NGN" || stored === "USD") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating preference from localStorage is only possible client-side
        setCurrencyState(stored);
      }
    } catch {}
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(KEY, c);
    } catch {}
  }, []);

  const displayPrice = useCallback(
    (priceValue: number | null | undefined, fallback: string) => {
      if (priceValue != null && priceValue > 0) {
        return formatConvertedPrice(priceValue, currency);
      }
      return fallback;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, displayPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
