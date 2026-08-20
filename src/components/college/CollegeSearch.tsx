"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function CollegeSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") || "";

  const [query, setQuery] = useState(searchParam);
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);

  // Sync state if URL changes externally during render
  if (searchParam !== prevSearchParam) {
    setPrevSearchParam(searchParam);
    setQuery(searchParam);
  }

  // Debounced search update to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query !== searchParam) {
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
          params.set("search", query.trim());
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        router.push(`/colleges?${params.toString()}`);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [query, router, searchParams, searchParam]);

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    router.push(`/colleges?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by college name, city, state, or course..."
        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-colors focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
