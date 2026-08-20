"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CollegeListItem } from "@/types";


interface CompareContextType {
  selectedColleges: CollegeListItem[];
  addToCompare: (college: CollegeListItem) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "collegecompass_compare";
const MAX_COMPARE = 3;

function getInitialColleges(): CollegeListItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, MAX_COMPARE);
      }
    }
  } catch (e) {
    console.error("Failed to load compare list from localStorage", e);
  }
  return [];
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer — runs once on client mount, avoids SSR issues
  const [selectedColleges, setSelectedColleges] = useState<CollegeListItem[]>(getInitialColleges);


  // Sync to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedColleges));
    } catch (e) {
      console.error("Failed to save compare list to localStorage", e);
    }
  }, [selectedColleges]);

  const addToCompare = (college: CollegeListItem): boolean => {
    if (selectedColleges.some((c) => c.id === college.id)) {
      return false; // Already present
    }
    if (selectedColleges.length >= MAX_COMPARE) {
      return false; // Exceeded limit
    }
    setSelectedColleges((prev) => [...prev, college]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setSelectedColleges((prev) => prev.filter((c) => c.id !== id));
  };

  const clearCompare = () => {
    setSelectedColleges([]);
  };

  const isInCompare = (id: string) => {
    return selectedColleges.some((c) => c.id === id);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedColleges,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAddMore: selectedColleges.length < MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

const DEFAULT_CONTEXT: CompareContextType = {
  selectedColleges: [],
  addToCompare: () => false,
  removeFromCompare: () => undefined,
  clearCompare: () => undefined,
  isInCompare: () => false,
  canAddMore: true,
};

export function useCompare() {
  const context = useContext(CompareContext);
  // Return a safe no-op during SSR/prerendering when CompareProvider is absent
  return context ?? DEFAULT_CONTEXT;
}
