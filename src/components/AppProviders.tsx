"use client";

import { SessionProvider } from "next-auth/react";
import { SavedPropertiesProvider } from "@/context/SavedPropertiesContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <SavedPropertiesProvider>
          {children}
        </SavedPropertiesProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}
