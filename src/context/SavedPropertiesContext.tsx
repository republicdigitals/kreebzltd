"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SavedPropertiesContextType {
  savedIds: Set<string>;
  toggleSave: (propertyId: string) => Promise<void>;
  isLoading: boolean;
}

const SavedPropertiesContext = createContext<SavedPropertiesContextType>({
  savedIds: new Set(),
  toggleSave: async () => {},
  isLoading: true,
});

export function SavedPropertiesProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/saved/ids")
        .then(res => res.json())
        .then(data => {
          if (data.ids) {
            setSavedIds(new Set(data.ids));
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else if (status === "unauthenticated") {
      // Small timeout to avoid React warning about sync state update during render
      setTimeout(() => {
        setSavedIds(new Set());
        setIsLoading(false);
      }, 0);
    }
  }, [status]);

  const toggleSave = async (propertyId: string) => {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    const isSaved = savedIds.has(propertyId);
    
    // Optimistic UI update
    const newSaved = new Set(savedIds);
    if (isSaved) {
      newSaved.delete(propertyId);
    } else {
      newSaved.add(propertyId);
    }
    setSavedIds(newSaved);

    try {
      if (isSaved) {
        await fetch(`/api/user/saved?propertyId=${propertyId}`, { method: "DELETE" });
      } else {
        await fetch("/api/user/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId })
        });
      }
    } catch (error) {
      // Revert on error
      setSavedIds(savedIds);
      console.error("Failed to toggle save", error);
    }
  };

  return (
    <SavedPropertiesContext.Provider value={{ savedIds, toggleSave, isLoading }}>
      {children}
    </SavedPropertiesContext.Provider>
  );
}

export const useSavedProperties = () => useContext(SavedPropertiesContext);
