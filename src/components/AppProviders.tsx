"use client";

import { SessionProvider } from "next-auth/react";
import { SavedPropertiesProvider } from "@/context/SavedPropertiesContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SavedPropertiesProvider>
        {children}
      </SavedPropertiesProvider>
    </SessionProvider>
  );
}
